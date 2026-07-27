import { z } from 'zod';

const createDealSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Deal title is required'
    }),
    bannerHeading: z.string().optional(),
    bannerSubheading: z.string().optional(),
    bannerImage: z.string().optional(),
    bannerBgColor: z.string().optional(),
    categoryIds: z.array(z.string()).optional(),
    discountStartPercent: z.number().optional(),
    discountEndPercent: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

const updateDealSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    bannerHeading: z.string().optional(),
    bannerSubheading: z.string().optional(),
    bannerImage: z.string().optional(),
    bannerBgColor: z.string().optional(),
    categoryIds: z.array(z.string()).optional(),
    discountStartPercent: z.number().optional(),
    discountEndPercent: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

export const DealValidation = {
  createDealSchema,
  updateDealSchema
};
