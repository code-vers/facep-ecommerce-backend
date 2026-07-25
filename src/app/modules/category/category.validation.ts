import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Category name is required'
    }),
    isActive: z.boolean().optional().default(true),
    subcategories: z.array(z.string()).optional().default([])
  })
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    isActive: z.boolean().optional(),
    subcategories: z.array(z.string()).optional()
  })
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema
};
