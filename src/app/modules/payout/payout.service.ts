import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const PayoutService = {
  async getWallet(vendorId: string) {
    let wallet = await prisma.vendorWallet.findUnique({ where: { vendorId } });
    if (!wallet) {
      wallet = await prisma.vendorWallet.create({
        data: { vendorId, pendingBalance: 0, availableBalance: 0, totalWithdrawn: 0 }
      });
    }
    return wallet;
  },

  async requestPayout(
    vendorId: string,
    payload: { amount: number; paymentMethod: string; accountDetails: string }
  ) {
    const wallet = await this.getWallet(vendorId);

    if (Number(wallet.availableBalance) < payload.amount) {
      throw new Error('Insufficient available balance');
    }

    // Deduct from available balance immediately to prevent double spending
    await prisma.vendorWallet.update({
      where: { vendorId },
      data: { availableBalance: { decrement: payload.amount } }
    });

    return await prisma.payoutRequest.create({
      data: {
        vendorId,
        amount: payload.amount,
        paymentMethod: payload.paymentMethod,
        accountDetails: payload.accountDetails
      }
    });
  },

  async getVendorPayouts(vendorId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where: { vendorId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.payoutRequest.count({ where: { vendorId } })
    ]);

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data
    };
  },

  async getAllPayouts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        include: { vendor: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.payoutRequest.count()
    ]);

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      data
    };
  },

  async updatePayoutStatus(
    id: string,
    status: 'PROCESSING' | 'COMPLETED' | 'REJECTED',
    adminNotes?: string
  ) {
    const payout = await prisma.payoutRequest.findUnique({ where: { id } });
    if (!payout) throw new Error('Payout request not found');

    if (status === 'REJECTED' && payout.status !== 'REJECTED') {
      // Refund the available balance
      await prisma.vendorWallet.update({
        where: { vendorId: payout.vendorId },
        data: { availableBalance: { increment: payout.amount } }
      });
    } else if (status === 'COMPLETED' && payout.status !== 'COMPLETED') {
      // Add to total withdrawn
      await prisma.vendorWallet.update({
        where: { vendorId: payout.vendorId },
        data: { totalWithdrawn: { increment: payout.amount } }
      });
    }

    return await prisma.payoutRequest.update({
      where: { id },
      data: { status, adminNotes }
    });
  }
};
