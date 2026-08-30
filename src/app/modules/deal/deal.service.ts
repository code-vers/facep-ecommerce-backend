import { DealAddedBy, Prisma, Role } from '@prisma/client';

import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import type { ICreateDealInput, IUpdateDealInput } from './deal.interface';

type DealActor = { userId: string; role: Role };
type DealPayload = ICreateDealInput | IUpdateDealInput;

const dealInclude = {
  createdBy: { select: { id: true, name: true, email: true } }
} satisfies Prisma.DealInclude;

const asAddedBy = (role: Role): DealAddedBy => {
  if (role === Role.ADMIN) return DealAddedBy.ADMIN;
  if (role === Role.VENDOR) return DealAddedBy.VENDOR;
  throw new AppError(403, 'Only administrators and vendors can manage deals.');
};

const scopeWhere = (addedBy: DealAddedBy, userId: string): Prisma.DealWhereInput =>
  addedBy === DealAddedBy.ADMIN
    ? // Deals created before ownership tracking have no addedBy value. They were
      // admin-only deals, so they must also reserve their categories for admins.
      { OR: [{ addedBy: DealAddedBy.ADMIN }, { addedBy: null }] }
    : { addedBy: DealAddedBy.VENDOR, createdById: userId };

const vendorReadableWhere = (vendorId: string): Prisma.DealWhereInput => ({
  OR: [
    { addedBy: DealAddedBy.ADMIN },
    { addedBy: null },
    { addedBy: DealAddedBy.VENDOR, createdById: vendorId }
  ]
});

const getDate = (value: string | undefined) => (value ? new Date(value) : null);

const dealData = (payload: DealPayload): Prisma.DealUncheckedCreateInput => {
  const { startDate, endDate, ...rest } = payload;
  return {
    ...rest,
    ...(startDate !== undefined ? { startDate: getDate(startDate) } : {}),
    ...(endDate !== undefined ? { endDate: getDate(endDate) } : {})
  } as Prisma.DealUncheckedCreateInput;
};

const assertCategoriesAvailable = async (
  tx: Prisma.TransactionClient,
  categoryIds: string[],
  addedBy: DealAddedBy,
  userId: string,
  excludeDealId?: string
) => {
  const normalizedIds = [...new Set(categoryIds)];
  if (normalizedIds.length !== categoryIds.length) {
    throw new AppError(400, 'A category can only be selected once in a deal.');
  }

  const categories = await tx.category.findMany({
    where: { id: { in: normalizedIds }, isActive: true },
    select: { id: true }
  });
  if (categories.length !== normalizedIds.length) {
    throw new AppError(400, 'One or more selected categories are unavailable.');
  }

  const occupied = await tx.deal.findMany({
    where: {
      categoryIds: { hasSome: normalizedIds },
      ...scopeWhere(addedBy, userId),
      ...(excludeDealId ? { id: { not: excludeDealId } } : {})
    },
    select: { categoryIds: true }
  });
  const occupiedIds = new Set(occupied.flatMap((deal) => deal.categoryIds));
  const duplicateIds = normalizedIds.filter((id) => occupiedIds.has(id));
  if (duplicateIds.length) {
    const duplicateCategories = await tx.category.findMany({
      where: { id: { in: duplicateIds } },
      select: { name: true }
    });
    throw new AppError(
      409,
      `A deal already exists for: ${duplicateCategories.map((category) => category.name).join(', ')}.`
    );
  }
  return normalizedIds;
};

const getManagedDeal = async (id: string, actor: DealActor) => {
  const where: Prisma.DealWhereInput = {
    id,
    ...(actor.role === Role.ADMIN
      ? scopeWhere(DealAddedBy.ADMIN, actor.userId)
      : scopeWhere(DealAddedBy.VENDOR, actor.userId))
  };
  const deal = await prisma.deal.findFirst({ where, include: dealInclude });
  if (!deal) throw new AppError(404, 'Deal not found.');
  return deal;
};

const getReadableDeal = async (id: string, actor: DealActor) => {
  const deal = await prisma.deal.findFirst({
    where: {
      id,
      ...(actor.role === Role.ADMIN
        ? scopeWhere(DealAddedBy.ADMIN, actor.userId)
        : vendorReadableWhere(actor.userId))
    },
    include: dealInclude
  });
  if (!deal) throw new AppError(404, 'Deal not found.');
  return deal;
};

const createDeal = async (actor: DealActor, payload: ICreateDealInput) => {
  const addedBy = asAddedBy(actor.role);
  return prisma.$transaction(async (tx) => {
    const categoryIds = await assertCategoriesAvailable(
      tx,
      payload.categoryIds,
      addedBy,
      actor.userId
    );
    return tx.deal.create({
      data: { ...dealData(payload), categoryIds, createdById: actor.userId, addedBy },
      include: dealInclude
    });
  });
};

const getAllDeals = async (actor: DealActor, query: Record<string, unknown>) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const searchTerm = typeof query.searchTerm === 'string' ? query.searchTerm.trim() : '';
  const filters: Prisma.DealWhereInput[] = [
    actor.role === Role.ADMIN
      ? scopeWhere(DealAddedBy.ADMIN, actor.userId)
      : vendorReadableWhere(actor.userId)
  ];
  if (searchTerm) {
    filters.push({
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { bannerHeading: { contains: searchTerm, mode: 'insensitive' } }
      ]
    });
  }
  const where: Prisma.DealWhereInput = filters.length ? { AND: filters } : {};
  const [data, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      include: dealInclude,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.deal.count({ where })
  ]);
  return { meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) }, data };
};

const getActiveDeal = () =>
  prisma.deal.findFirst({
    where: { isActive: true, addedBy: DealAddedBy.ADMIN },
    include: dealInclude,
    orderBy: { updatedAt: 'desc' }
  });

const getSingleDeal = (id: string, actor: DealActor) => getReadableDeal(id, actor);

const getUnavailableCategoryIds = async (actor: DealActor, excludeDealId?: string) => {
  const addedBy = asAddedBy(actor.role);
  const deals = await prisma.deal.findMany({
    where: {
      ...scopeWhere(addedBy, actor.userId),
      ...(excludeDealId ? { id: { not: excludeDealId } } : {})
    },
    select: { categoryIds: true }
  });
  return [...new Set(deals.flatMap((deal) => deal.categoryIds))];
};

const updateDeal = async (id: string, actor: DealActor, payload: IUpdateDealInput) => {
  const existing = await getManagedDeal(id, actor);
  const addedBy = existing.addedBy ?? asAddedBy(actor.role);
  const createdById = existing.createdById ?? actor.userId;
  return prisma.$transaction(async (tx) => {
    const categoryIds = payload.categoryIds
      ? await assertCategoriesAvailable(tx, payload.categoryIds, addedBy, createdById, id)
      : undefined;
    return tx.deal.update({
      where: { id },
      data: {
        ...(dealData(payload) as Prisma.DealUncheckedUpdateInput),
        ...(categoryIds ? { categoryIds } : {}),
        ...(!existing.addedBy || !existing.createdById ? { addedBy, createdById } : {})
      },
      include: dealInclude
    });
  });
};

const deleteDeal = async (id: string, actor: DealActor) => {
  await getManagedDeal(id, actor);
  return prisma.deal.delete({ where: { id }, include: dealInclude });
};

export const DealService = {
  createDeal,
  getAllDeals,
  getActiveDeal,
  getSingleDeal,
  getUnavailableCategoryIds,
  updateDeal,
  deleteDeal
};
