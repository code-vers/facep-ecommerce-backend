import { z } from 'zod';
import { CouponDiscountType, CouponScope } from '@prisma/client';

const createCouponSchema = z.object({
  body: z.object({
    code: z
      .string({ message: 'Coupon code is required' })
      .min(2, 'Coupon code must be at least 2 characters')
      .max(30, 'Coupon code must not exceed 30 characters')
      .trim(),
    title: z
      .string({ message: 'Title is required' })
      .min(2, 'Title must be at least 2 characters')
      .trim(),
    description: z.string().optional().nullable(),
    discountType: z.nativeEnum(CouponDiscountType).default(CouponDiscountType.PERCENTAGE),
    discountValue: z
      .number({ message: 'Discount value is required' })
      .positive('Discount value must be greater than 0'),
    maxDiscountAmount: z.number().positive().optional().nullable(),
    minOrderAmount: z.number().min(0).optional().default(0),
    scope: z.nativeEnum(CouponScope).default(CouponScope.ALL),
    categoryIds: z.array(z.string()).optional().default([]),
    productIds: z.array(z.string()).optional().default([]),
    usageLimit: z.number().int().positive().optional().nullable(),
    userUsageLimit: z.number().int().positive().optional().default(1),
    startDate: z.string().optional(),
    endDate: z.string({ message: 'Expiration date is required' }),
    isActive: z.boolean().optional().default(true),
    isPublic: z.boolean().optional().default(true),
    badgeText: z.string().optional().nullable()
  })
});

const updateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(2).max(30).trim().optional(),
    title: z.string().min(2).trim().optional(),
    description: z.string().optional().nullable(),
    discountType: z.nativeEnum(CouponDiscountType).optional(),
    discountValue: z.number().positive().optional(),
    maxDiscountAmount: z.number().positive().optional().nullable(),
    minOrderAmount: z.number().min(0).optional(),
    scope: z.nativeEnum(CouponScope).optional(),
    categoryIds: z.array(z.string()).optional(),
    productIds: z.array(z.string()).optional(),
    usageLimit: z.number().int().positive().optional().nullable(),
    userUsageLimit: z.number().int().positive().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    badgeText: z.string().optional().nullable()
  })
});

const validateCouponSchema = z.object({
  body: z.object({
    code: z.string({ message: 'Coupon code is required' }).trim().min(1),
    cartItems: z
      .array(
        z.object({
          productId: z.string(),
          price: z.number(),
          quantity: z.number(),
          categoryId: z.string().optional()
        })
      )
      .optional()
      .default([]),
    subtotal: z.number({ message: 'Subtotal is required' }).min(0)
  })
});

export const CouponValidation = {
  createCouponSchema,
  updateCouponSchema,
  validateCouponSchema
};
