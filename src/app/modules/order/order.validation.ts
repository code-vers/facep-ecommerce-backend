import { z } from 'zod';

const getMyOrdersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z
      .enum(['All Orders', 'Ordered', 'Packed', 'Shipped', 'Delivered', 'Returned'])
      .optional()
  })
});

const cancelOrderSchema = z.object({
  body: z.object({
    reason: z.string().max(500, 'Reason must not exceed 500 characters').optional()
  })
});

export const OrderValidation = {
  getMyOrdersQuerySchema,
  cancelOrderSchema
};
