import prisma from '../../utils/prisma';
import { Courier } from '@prisma/client';

const createCourier = async (payload: Partial<Courier>) => {
  const result = await prisma.courier.create({
    data: payload as Courier,
  });
  return result;
};

const getAllCouriers = async () => {
  const result = await prisma.courier.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return result;
};

const updateCourier = async (id: string, payload: Partial<Courier>) => {
  const result = await prisma.courier.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteCourier = async (id: string) => {
  const result = await prisma.courier.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CourierService = {
  createCourier,
  getAllCouriers,
  updateCourier,
  deleteCourier,
};
