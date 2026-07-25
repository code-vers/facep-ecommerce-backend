import { z } from 'zod';
import { InquiryStatus } from '@prisma/client';

const createInquirySchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Name is required'
    }),
    email: z
      .string({
        message: 'Email is required'
      })
      .email('Invalid email address'),
    contactNumber: z.string().optional(),
    message: z.string({
      message: 'Message is required'
    })
  })
});

const updateInquirySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
    contactNumber: z.string().optional(),
    message: z.string().optional(),
    status: z.nativeEnum(InquiryStatus).optional()
  })
});

export const InquiryValidation = {
  createInquirySchema,
  updateInquirySchema
};
