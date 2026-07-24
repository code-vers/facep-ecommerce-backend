import { z } from 'zod';

const createCourierSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Name is required'
    }),
    rate: z.number({
      message: 'Rate is required'
    }),
    deliveryTime: z.string({
      message: 'Delivery time is required'
    })
  })
});

const updateCourierSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    rate: z.number().optional(),
    deliveryTime: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

export const CourierValidation = {
  createCourierSchema,
  updateCourierSchema
};
