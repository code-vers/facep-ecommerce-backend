import prisma from '../../utils/prisma';
import { Courier } from '@prisma/client';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createCourier = async (payload: Partial<Courier>) => {
  const result = await prisma.courier.create({
    data: payload as Courier
  });
  return result;
};

const getAllCouriers = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query).search(['name']).filter().sort().paginate();
  const prismaArgs = queryBuilder.build();

  const result = await prisma.courier.findMany(prismaArgs as any);
  const total = await prisma.courier.count({ where: prismaArgs.where } as any);
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

const updateCourier = async (id: string, payload: Partial<Courier>) => {
  const result = await prisma.courier.update({
    where: {
      id
    },
    data: payload
  });
  return result;
};

const deleteCourier = async (id: string) => {
  const result = await prisma.courier.delete({
    where: {
      id
    }
  });
  return result;
};

export const CourierService = {
  createCourier,
  getAllCouriers,
  updateCourier,
  deleteCourier
};
