import { describe, expect, it, jest } from '@jest/globals';
import bcrypt from 'bcryptjs';

import prisma from '../../utils/prisma';
import { UserService } from './user.service';

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: { compare: jest.fn() }
}));

jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn()
    },
    userAddress: { findFirst: jest.fn() },
    savedPaymentMethod: { findFirst: jest.fn() },
    $transaction: jest.fn()
  }
}));

const mockedPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('User profile service', () => {
  beforeEach(() => {
    mockedPrisma.$transaction.mockImplementation(async (callback: (tx: unknown) => unknown) =>
      callback(mockedPrisma)
    );
  });

  it('prevents the last active admin from deactivating', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'admin-1',
      password: 'hash',
      role: 'ADMIN'
    });
    mockedPrisma.user.count.mockResolvedValue(1);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(
      UserService.deactivateMe('admin-1', { currentPassword: 'correct-password' })
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
  });

  it('rejects deactivation when the current password is wrong', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'buyer-1',
      password: 'hash',
      role: 'BUYER'
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      UserService.deactivateMe('buyer-1', { currentPassword: 'wrong-password' })
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it('reactivates a deactivated user', async () => {
    mockedPrisma.user.findUnique.mockResolvedValue({ id: 'buyer-1', isActive: false });
    mockedPrisma.user.update.mockResolvedValue({ id: 'buyer-1', isActive: true });

    await expect(UserService.reactivateUser('buyer-1')).resolves.toMatchObject({ isActive: true });
    expect(mockedPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { isActive: true, deletedAt: null } })
    );
  });
});
