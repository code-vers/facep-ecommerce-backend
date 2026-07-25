import prisma from '../../utils/prisma';
import { Inquiry } from '@prisma/client';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createInquiry = async (payload: Partial<Inquiry>) => {
  const result = await prisma.inquiry.create({
    data: payload as Inquiry
  });
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
