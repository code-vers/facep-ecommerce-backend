import prisma from '../../utils/prisma';
import { Inquiry } from '@prisma/client';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { sendInquiryEmail } from '../../utils/email';
import config from '../../config';

const createInquiry = async (payload: Partial<Inquiry>) => {
  const result = await prisma.inquiry.create({
    data: payload as Inquiry
  });

  const recipientEmail = config.smtp.user || config.admin.email;
  if (recipientEmail) {
    void sendInquiryEmail(recipientEmail, {
      name: result.name,
      email: result.email,
      contactNumber: result.contactNumber,
      message: result.message,
      createdAt: result.createdAt
    });
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
