import prisma from '../../utils/prisma';
import { ShippingZone } from '@prisma/client';

const createShippingZone = async (payload: Partial<ShippingZone>) => {
  const result = await prisma.shippingZone.create({
    data: payload as ShippingZone
  });
  return result;
};

const getAllShippingZones = async () => {
  const result = await prisma.shippingZone.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return result;
};

const updateShippingZone = async (id: string, payload: Partial<ShippingZone>) => {
  const result = await prisma.shippingZone.update({
    where: {
      id
    },
    data: payload
  });
  return result;
};

const deleteShippingZone = async (id: string) => {
  const result = await prisma.shippingZone.delete({
    where: {
      id
    }
  });
  return result;
};

export const ShippingZoneService = {
  createShippingZone,
  getAllShippingZones,
  updateShippingZone,
  deleteShippingZone
};
