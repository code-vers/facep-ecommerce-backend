import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import {
  ICreateCouponInput,
  IUpdateCouponInput,
  ICouponQueryFilters,
  IValidateCouponInput
} from './coupon.interface';
import { CouponDiscountType, CouponScope, Prisma } from '@prisma/client';

export const CouponService = {
  // ── Create a Coupon (Admin) ────────────────────────────────────────────────
  async createCoupon(payload: ICreateCouponInput) {
    const formattedCode = payload.code.trim().toUpperCase();

    // Check code uniqueness
    const existing = await prisma.coupon.findUnique({
      where: { code: formattedCode }
    });

    if (existing) {
      throw new AppError(400, `Coupon with code "${formattedCode}" already exists.`);
    }

    const startDate = payload.startDate ? new Date(payload.startDate) : new Date();
    const endDate = new Date(payload.endDate);

    if (endDate <= startDate) {
      throw new AppError(400, 'Expiration date must be later than the start date.');
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: formattedCode,
        title: payload.title.trim(),
        description: payload.description?.trim() || null,
        discountType: payload.discountType,
        discountValue: new Prisma.Decimal(payload.discountValue),
        maxDiscountAmount: payload.maxDiscountAmount
          ? new Prisma.Decimal(payload.maxDiscountAmount)
          : null,
        minOrderAmount: payload.minOrderAmount
          ? new Prisma.Decimal(payload.minOrderAmount)
          : new Prisma.Decimal(0),
        scope: payload.scope || CouponScope.ALL,
        categoryIds: payload.categoryIds || [],
        productIds: payload.productIds || [],
        usageLimit: payload.usageLimit || null,
        userUsageLimit: payload.userUsageLimit || 1,
        startDate,
        endDate,
        isActive: payload.isActive !== undefined ? payload.isActive : true,
        isPublic: payload.isPublic !== undefined ? payload.isPublic : true,
        badgeText: payload.badgeText?.trim() || null
      }
    });

    return coupon;
  },

  // ── Get All Coupons (Admin List with Filters & Pagination) ─────────────────
  async getAllCouponsAdmin(filters: ICouponQueryFilters) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 15;
    const skip = (page - 1) * limit;

    const where: Prisma.CouponWhereInput = {};

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search.trim().toUpperCase(), mode: 'insensitive' } },
        { title: { contains: filters.search.trim(), mode: 'insensitive' } }
      ];
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isPublic !== undefined) {
      where.isPublic = filters.isPublic;
    }

    if (filters.scope) {
      where.scope = filters.scope;
    }

    if (filters.discountType) {
      where.discountType = filters.discountType;
    }

    let orderBy: Prisma.CouponOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sortBy === 'code:asc') orderBy = { code: 'asc' };
    else if (filters.sortBy === 'code:desc') orderBy = { code: 'desc' };
    else if (filters.sortBy === 'endDate:asc') orderBy = { endDate: 'asc' };
    else if (filters.sortBy === 'usageCount:desc') orderBy = { usageCount: 'desc' };

    const [data, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy
      }),
      prisma.coupon.count({ where })
    ]);

    return {
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit) || 1
      },
      data
    };
  },

  // ── Get Summary Stats for Admin Dashboard ──────────────────────────────────
  async getCouponStats() {
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [totalCoupons, activeCoupons, usageAggregate, expiringSoon] = await Promise.all([
      prisma.coupon.count(),
      prisma.coupon.count({
        where: {
          isActive: true,
          endDate: { gt: now }
        }
      }),
      prisma.coupon.aggregate({
        _sum: {
          usageCount: true
        }
      }),
      prisma.coupon.count({
        where: {
          isActive: true,
          endDate: {
            gt: now,
            lte: inSevenDays
          }
        }
      })
    ]);

    return {
      totalCoupons,
      activeCoupons,
      totalRedemptions: usageAggregate._sum.usageCount || 0,
      expiringSoon
    };
  },

  // ── Get Single Coupon by ID (Admin) ────────────────────────────────────────
  async getSingleCouponAdmin(id: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      throw new AppError(404, 'Coupon not found.');
    }

    return coupon;
  },

  // ── Update Coupon (Admin) ──────────────────────────────────────────────────
  async updateCoupon(id: string, payload: IUpdateCouponInput) {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      throw new AppError(404, 'Coupon not found.');
    }

    let formattedCode = coupon.code;
    if (payload.code && payload.code.trim().toUpperCase() !== coupon.code) {
      formattedCode = payload.code.trim().toUpperCase();
      const existing = await prisma.coupon.findUnique({
        where: { code: formattedCode }
      });
      if (existing && existing.id !== id) {
        throw new AppError(400, `Coupon with code "${formattedCode}" already exists.`);
      }
    }

    const startDate = payload.startDate ? new Date(payload.startDate) : coupon.startDate;
    const endDate = payload.endDate ? new Date(payload.endDate) : coupon.endDate;

    if (endDate <= startDate) {
      throw new AppError(400, 'Expiration date must be later than the start date.');
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        code: formattedCode,
        ...(payload.title !== undefined && { title: payload.title.trim() }),
        ...(payload.description !== undefined && {
          description: payload.description ? payload.description.trim() : null
        }),
        ...(payload.discountType !== undefined && { discountType: payload.discountType }),
        ...(payload.discountValue !== undefined && {
          discountValue: new Prisma.Decimal(payload.discountValue)
        }),
        ...(payload.maxDiscountAmount !== undefined && {
          maxDiscountAmount: payload.maxDiscountAmount
            ? new Prisma.Decimal(payload.maxDiscountAmount)
            : null
        }),
        ...(payload.minOrderAmount !== undefined && {
          minOrderAmount: new Prisma.Decimal(payload.minOrderAmount)
        }),
        ...(payload.scope !== undefined && { scope: payload.scope }),
        ...(payload.categoryIds !== undefined && { categoryIds: payload.categoryIds }),
        ...(payload.productIds !== undefined && { productIds: payload.productIds }),
        ...(payload.usageLimit !== undefined && { usageLimit: payload.usageLimit }),
        ...(payload.userUsageLimit !== undefined && {
          userUsageLimit: payload.userUsageLimit
        }),
        startDate,
        endDate,
        ...(payload.isActive !== undefined && { isActive: payload.isActive }),
        ...(payload.isPublic !== undefined && { isPublic: payload.isPublic }),
        ...(payload.badgeText !== undefined && {
          badgeText: payload.badgeText ? payload.badgeText.trim() : null
        })
      }
    });

    return updated;
  },

  // ── Toggle Coupon Active/Inactive (Admin Quick Action) ─────────────────────
  async toggleCouponStatus(id: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      throw new AppError(404, 'Coupon not found.');
    }

    const updated = await prisma.coupon.update({
      where: { id },
      data: {
        isActive: !coupon.isActive
      }
    });

    return updated;
  },

  // ── Delete Coupon (Admin) ──────────────────────────────────────────────────
  async deleteCoupon(id: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { id }
    });

    if (!coupon) {
      throw new AppError(404, 'Coupon not found.');
    }

    await prisma.coupon.delete({
      where: { id }
    });

    return { message: 'Coupon deleted successfully.' };
  },

  // ── Get Public Available Coupons (For Customer Gallery /coupons) ───────────
  async getPublicCoupons(filters?: { search?: string; categoryId?: string }) {
    const now = new Date();

    const where: Prisma.CouponWhereInput = {
      isActive: true,
      isPublic: true,
      startDate: { lte: now },
      endDate: { gt: now }
    };

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search.trim().toUpperCase(), mode: 'insensitive' } },
        { title: { contains: filters.search.trim(), mode: 'insensitive' } },
        { description: { contains: filters.search.trim(), mode: 'insensitive' } }
      ];
    }

    if (filters?.categoryId) {
      where.OR = [{ scope: CouponScope.ALL }, { categoryIds: { has: filters.categoryId } }];
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { endDate: 'asc' }
    });

    // Filter out coupons that have hit their global usage limit
    return coupons.filter((c) => c.usageLimit === null || c.usageCount < c.usageLimit);
  },

  // ── Validate Coupon (Cart / Checkout Rule Engine) ──────────────────────────
  async validateCoupon(payload: IValidateCouponInput, userId?: string) {
    const formattedCode = payload.code.trim().toUpperCase();
    const now = new Date();

    const coupon = await prisma.coupon.findUnique({
      where: { code: formattedCode }
    });

    if (!coupon) {
      throw new AppError(404, 'Invalid coupon code.');
    }

    if (!coupon.isActive) {
      throw new AppError(400, 'This coupon is currently inactive.');
    }

    if (coupon.startDate > now) {
      throw new AppError(400, 'This coupon promotion has not started yet.');
    }

    if (coupon.endDate <= now) {
      throw new AppError(400, 'This coupon code has expired.');
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      throw new AppError(400, 'This coupon has reached its maximum global usage limit.');
    }

    // Minimum order amount validation
    const subtotal = Number(payload.subtotal) || 0;
    const minOrderAmount = Number(coupon.minOrderAmount) || 0;

    if (subtotal < minOrderAmount) {
      throw new AppError(
        400,
        `Minimum order spend of $${minOrderAmount.toFixed(2)} is required to apply this coupon.`
      );
    }

    // Scope & Item Eligibility Calculation
    let eligibleSubtotal = subtotal;
    const cartItems = payload.cartItems || [];

    if (coupon.scope === CouponScope.CATEGORY && coupon.categoryIds.length > 0) {
      const eligibleItems = cartItems.filter(
        (item) => item.categoryId && coupon.categoryIds.includes(item.categoryId)
      );
      if (cartItems.length > 0 && eligibleItems.length === 0) {
        throw new AppError(
          400,
          'None of the items in your cart qualify for this category-specific coupon.'
        );
      }
      if (eligibleItems.length > 0) {
        eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    } else if (coupon.scope === CouponScope.PRODUCT && coupon.productIds.length > 0) {
      const eligibleItems = cartItems.filter((item) => coupon.productIds.includes(item.productId));
      if (cartItems.length > 0 && eligibleItems.length === 0) {
        throw new AppError(
          400,
          'None of the items in your cart qualify for this product-specific coupon.'
        );
      }
      if (eligibleItems.length > 0) {
        eligibleSubtotal = eligibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      }
    }

    // Compute exact discount amount
    let discountAmount = 0;
    const discountVal = Number(coupon.discountValue);

    if (coupon.discountType === CouponDiscountType.PERCENTAGE) {
      const calculated = (eligibleSubtotal * discountVal) / 100;
      const maxDiscount = coupon.maxDiscountAmount ? Number(coupon.maxDiscountAmount) : null;
      discountAmount = maxDiscount ? Math.min(calculated, maxDiscount) : calculated;
    } else if (coupon.discountType === CouponDiscountType.FIXED_AMOUNT) {
      discountAmount = Math.min(discountVal, eligibleSubtotal);
    } else if (coupon.discountType === CouponDiscountType.FREE_SHIPPING) {
      discountAmount = 0; // Handled as shipping discount in checkout
    }

    // Round to 2 decimal places
    discountAmount = Math.round(discountAmount * 100) / 100;

    return {
      isValid: true,
      couponId: coupon.id,
      code: coupon.code,
      title: coupon.title,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discountAmount,
      minOrderAmount: Number(coupon.minOrderAmount),
      scope: coupon.scope,
      message: `Coupon "${coupon.code}" applied successfully!`
    };
  }
};
