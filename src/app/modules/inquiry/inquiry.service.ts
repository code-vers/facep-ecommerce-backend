import prisma from '../../utils/prisma';
import { Inquiry } from '@prisma/client';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { sendEmail } from '../../utils/email';
import config from '../../config';

const createInquiry = async (payload: Partial<Inquiry>) => {
  const result = await prisma.inquiry.create({
    data: payload as Inquiry
  });

  const recipientEmail = config.smtp.user || config.admin.email;
  if (recipientEmail) {
    const subject = `New Support Inquiry from ${result.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1a1a1a;">New Support Inquiry Received</h2>
        <hr style="border: 1px solid #eee;" />
        <p><strong>Name:</strong> ${result.name}</p>
        <p><strong>Email:</strong> ${result.email}</p>
        <p><strong>Contact Number:</strong> ${result.contactNumber || 'N/A'}</p>
        <p><strong>Date & Time:</strong> ${new Date(result.createdAt).toLocaleString()}</p>
        <p><strong>Message / Inquiry:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #dec33a; margin: 10px 0;">
          ${result.message}
        </blockquote>
      </div>
    `;
    void sendEmail(recipientEmail, subject, html);
  }

  return result;
};

const getAllInquiries = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['name', 'email', 'contactNumber', 'message'])
    .filter()
    .sort()
    .paginate();
  const prismaArgs = queryBuilder.build();

  const result = await prisma.inquiry.findMany(prismaArgs as any);
  const total = await prisma.inquiry.count({ where: prismaArgs.where } as any);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage
    },
    data: result
  };
};

const getSingleInquiry = async (id: string) => {
  const result = await prisma.inquiry.findUnique({
    where: {
      id
    }
  });
  return result;
};

const updateInquiry = async (id: string, payload: Partial<Inquiry>) => {
  const result = await prisma.inquiry.update({
    where: {
      id
    },
    data: payload
  });
  return result;
};

const deleteInquiry = async (id: string) => {
  const result = await prisma.inquiry.delete({
    where: {
      id
    }
  });
  return result;
};

export const InquiryService = {
  createInquiry,
  getAllInquiries,
  getSingleInquiry,
  updateInquiry,
  deleteInquiry
};
