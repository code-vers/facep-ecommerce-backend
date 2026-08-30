import bcrypt from 'bcryptjs';
import type { Prisma } from '@prisma/client';

import AppError from '../../errors/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import prisma from '../../utils/prisma';
import type {
  IAddressPayload,
  IChangeRolePayload,
  IDeactivateAccountPayload,
  IPaymentMethodPayload,
  IPaymentPreferencePayload,
  IPlatformSettingsPayload,
  IUpdateProfilePayload
} from './user.interface';

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  contactNumber: true,
  address: true,
  avatarUrl: true,
  preferredPaymentMethod: true,
  isActive: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.UserSelect;

const assertOwnedRecord = async (kind: 'address' | 'paymentMethod', userId: string, id: string) => {
  const record =
    kind === 'address'
      ? await prisma.userAddress.findFirst({ where: { id, userId } })
      : await prisma.savedPaymentMethod.findFirst({ where: { id, userId } });

  if (!record) {
    throw new AppError(
      404,
      kind === 'address' ? 'Address not found.' : 'Payment method not found.'
    );
  }
  return record;
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      ...publicUserSelect,
      addresses: { orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }] },
      paymentMethods: { orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }] }
    }
  });
  if (!user) throw new AppError(404, 'User not found.');
  return user;
};

const updateMe = (userId: string, payload: IUpdateProfilePayload) =>
  prisma.user.update({ where: { id: userId }, data: payload, select: publicUserSelect });

const deactivateMe = async (userId: string, payload: IDeactivateAccountPayload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found.');
  if (!(await bcrypt.compare(payload.currentPassword, user.password))) {
    throw new AppError(403, 'Current password does not match.');
  }
  if (user.role === 'ADMIN') {
    return prisma.$transaction(
      async (tx) => {
        const activeAdminCount = await tx.user.count({
          where: { role: 'ADMIN', isActive: true }
        });
        if (activeAdminCount <= 1) {
          throw new AppError(409, 'The last active admin cannot be deactivated.');
        }
        return tx.user.update({
          where: { id: userId },
          data: {
            isActive: false,
            deletedAt: new Date(),
            passwordResetCode: null,
            passwordResetExpires: null
          },
          select: publicUserSelect
        });
      },
      { isolationLevel: 'Serializable' }
    );
  }
  return prisma.user.update({
    where: { id: userId },
    data: {
      isActive: false,
      deletedAt: new Date(),
      passwordResetCode: null,
      passwordResetExpires: null
    },
    select: publicUserSelect
  });
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query).search(['name', 'email']).filter().sort().paginate();
  const users = await prisma.user.findMany({ ...queryBuilder.build(), select: publicUserSelect });
  const total = await prisma.user.count({ where: queryBuilder.build().where });
  return {
    meta: { total, page: Number(query.page) || 1, limit: Number(query.limit) || 10 },
    data: users
  };
};

const changeRole = async (id: string, payload: IChangeRolePayload) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found.');
  return prisma.user.update({
    where: { id },
    data: { role: payload.role },
    select: publicUserSelect
  });
};

const reactivateUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, 'User not found.');
  if (user.isActive) throw new AppError(409, 'User account is already active.');
  return prisma.user.update({
    where: { id },
    data: { isActive: true, deletedAt: null },
    select: publicUserSelect
  });
};

const getAddresses = (userId: string) =>
  prisma.userAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }]
  });

const createAddress = (userId: string, payload: IAddressPayload) =>
  prisma.$transaction(async (tx) => {
    const count = await tx.userAddress.count({ where: { userId } });
    const makeDefault = count === 0 || payload.isDefault === true;
    if (makeDefault)
      await tx.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.userAddress.create({ data: { ...payload, userId, isDefault: makeDefault } });
  });

const updateAddress = async (userId: string, id: string, payload: Partial<IAddressPayload>) => {
  await assertOwnedRecord('address', userId, id);
  return prisma.$transaction(async (tx) => {
    if (payload.isDefault)
      await tx.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.userAddress.update({ where: { id }, data: payload });
  });
};

const setDefaultAddress = async (userId: string, id: string) => {
  await assertOwnedRecord('address', userId, id);
  return prisma.$transaction(async (tx) => {
    await tx.userAddress.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.userAddress.update({ where: { id }, data: { isDefault: true } });
  });
};

const deleteAddress = async (userId: string, id: string) => {
  const record = await assertOwnedRecord('address', userId, id);
  return prisma.$transaction(async (tx) => {
    const deleted = await tx.userAddress.delete({ where: { id } });
    if (record.isDefault) {
      const replacement = await tx.userAddress.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' }
      });
      if (replacement)
        await tx.userAddress.update({ where: { id: replacement.id }, data: { isDefault: true } });
    }
    return deleted;
  });
};

const getPaymentMethods = (userId: string) =>
  prisma.savedPaymentMethod.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }]
  });

const createPaymentMethod = (userId: string, payload: IPaymentMethodPayload) =>
  prisma.$transaction(async (tx) => {
    const count = await tx.savedPaymentMethod.count({ where: { userId } });
    const makeDefault = count === 0 || payload.isDefault === true;
    if (makeDefault)
      await tx.savedPaymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.savedPaymentMethod.create({ data: { ...payload, userId, isDefault: makeDefault } });
  });

const updatePaymentMethod = async (
  userId: string,
  id: string,
  payload: Partial<IPaymentMethodPayload>
) => {
  await assertOwnedRecord('paymentMethod', userId, id);
  return prisma.$transaction(async (tx) => {
    if (payload.isDefault)
      await tx.savedPaymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.savedPaymentMethod.update({ where: { id }, data: payload });
  });
};

const setDefaultPaymentMethod = async (userId: string, id: string) => {
  await assertOwnedRecord('paymentMethod', userId, id);
  return prisma.$transaction(async (tx) => {
    await tx.savedPaymentMethod.updateMany({ where: { userId }, data: { isDefault: false } });
    return tx.savedPaymentMethod.update({ where: { id }, data: { isDefault: true } });
  });
};

const deletePaymentMethod = async (userId: string, id: string) => {
  const record = await assertOwnedRecord('paymentMethod', userId, id);
  return prisma.$transaction(async (tx) => {
    const deleted = await tx.savedPaymentMethod.delete({ where: { id } });
    if (record.isDefault) {
      const replacement = await tx.savedPaymentMethod.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' }
      });
      if (replacement)
        await tx.savedPaymentMethod.update({
          where: { id: replacement.id },
          data: { isDefault: true }
        });
    }
    return deleted;
  });
};

const updatePaymentPreference = (userId: string, payload: IPaymentPreferencePayload) =>
  prisma.user.update({ where: { id: userId }, data: payload, select: publicUserSelect });

const getPlatformSettings = () =>
  prisma.platformSettings.upsert({
    where: { id: 'platform' },
    update: {},
    create: { id: 'platform' }
  });

const updatePlatformSettings = (payload: IPlatformSettingsPayload) =>
  prisma.platformSettings.upsert({
    where: { id: 'platform' },
    update: payload,
    create: { id: 'platform', ...payload }
  });

export const UserService = {
  getMe,
  updateMe,
  deactivateMe,
  getAllUsers,
  changeRole,
  reactivateUser,
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  updatePaymentPreference,
  getPlatformSettings,
  updatePlatformSettings
};
