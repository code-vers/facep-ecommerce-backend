import { z } from 'zod';

const createShippingZoneSchema = z.object({
  body: z.object({
    zoneName: z.string({
      message: 'Zone name is required',
    }),
    countries: z.string({
      message: 'Countries string is required',
    }),
    baseRate: z.number({
      message: 'Base rate is required',
    }),
    perKgRate: z.number({
      message: 'Per KG rate is required',
    }),
    isFreeShipping: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateShippingZoneSchema = z.object({
  body: z.object({
    zoneName: z.string().optional(),
    countries: z.string().optional(),
    baseRate: z.number().optional(),
    perKgRate: z.number().optional(),
    isFreeShipping: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ShippingZoneValidation = {
  createShippingZoneSchema,
  updateShippingZoneSchema,
};
