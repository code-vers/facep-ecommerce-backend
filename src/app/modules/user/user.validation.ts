import { z } from 'zod';

const changeRole = z.object({
  body: z
    .object({
      role: z.enum(['BUYER', 'VENDOR', 'ADMIN'], {
        message: 'Invalid role. Must be BUYER, VENDOR, or ADMIN.'
      })
    })
    .strict()
});

const nullableTrimmed = (max: number) => z.string().trim().max(max).nullable().optional();

const updateProfile = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(100).optional(),
      contactNumber: nullableTrimmed(30),
      address: nullableTrimmed(500),
      avatarUrl: nullableTrimmed(500)
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, 'At least one profile field is required.')
});

const deactivateAccount = z.object({
  body: z.object({ currentPassword: z.string().min(1, 'Current password is required.') }).strict()
});

const addressBody = z
  .object({
    label: z.string().trim().min(1).max(50),
    addressLine: z.string().trim().min(3).max(500),
    phone: z.string().trim().min(3).max(30),
    isDefault: z.boolean().optional()
  })
  .strict();

const createAddress = z.object({ body: addressBody });
const updateAddress = z.object({
  body: addressBody
    .partial()
    .refine((body) => Object.keys(body).length > 0, 'At least one field is required.')
});

const paymentMethodBody = z
  .object({
    label: z.string().trim().min(1).max(50),
    brand: z.enum(['VISA', 'MASTERCARD']),
    last4: z.string().regex(/^\d{4}$/, 'Last four digits must contain exactly four numbers.'),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must use MM/YY format.'),
    isDefault: z.boolean().optional()
  })
  .strict();

const createPaymentMethod = z.object({ body: paymentMethodBody });
const updatePaymentMethod = z.object({
  body: paymentMethodBody
    .partial()
    .refine((body) => Object.keys(body).length > 0, 'At least one field is required.')
});

const updatePaymentPreference = z.object({
  body: z.object({ preferredPaymentMethod: z.enum(['COD', 'CARD']) }).strict()
});

const updatePlatformSettings = z.object({
  body: z
    .object({
      siteName: z.string().trim().min(1).max(100).optional(),
      adminEmail: z.string().trim().email().nullable().optional(),
      supportEmail: z.string().trim().email().nullable().optional(),
      address: nullableTrimmed(500),
      defaultCurrency: z
        .string()
        .trim()
        .regex(/^[A-Z]{3}$/)
        .optional(),
      defaultTimezone: z.string().trim().min(1).max(100).optional(),
      commissionRate: z.number().min(0).max(100).optional(),
      paymentGatewayFee: z.number().min(0).max(100).optional()
    })
    .strict()
    .refine((body) => Object.keys(body).length > 0, 'At least one setting is required.')
});

const updateVendorStatus = z.object({
  body: z
    .object({
      status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED'], {
        message: 'Invalid status. Must be ACTIVE, PENDING, or SUSPENDED.'
      })
    })
    .strict()
});

const bulkUpdateVendorStatus = z.object({
  body: z
    .object({
      ids: z.array(z.string().min(1, 'Vendor ID cannot be empty')).min(1, 'At least one vendor ID is required'),
      status: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED'], {
        message: 'Invalid status. Must be ACTIVE, PENDING, or SUSPENDED.'
      })
    })
    .strict()
});

const getVendorsQuery = z.object({
  query: z
    .object({
      page: z.string().optional(),
      limit: z.string().optional(),
      searchTerm: z.string().optional(),
      status: z.enum(['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED', 'all', 'active', 'pending', 'suspended']).optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional()
    })
    .optional()
});

export const UserValidation = {
  changeRole,
  updateProfile,
  deactivateAccount,
  createAddress,
  updateAddress,
  createPaymentMethod,
  updatePaymentMethod,
  updatePaymentPreference,
  updatePlatformSettings,
  updateVendorStatus,
  bulkUpdateVendorStatus,
  getVendorsQuery
};
