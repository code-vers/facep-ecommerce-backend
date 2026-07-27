import prisma from '../../utils/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createDeal = async (payload: any) => {
  const { startDate, endDate, discountStartPercent, discountEndPercent, ...rest } = payload;

  const dealData: any = {
    ...rest,
    ...(discountStartPercent !== undefined && { discountStartPercent }),
    ...(discountEndPercent !== undefined && { discountEndPercent }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) })
  };

  const result = await prisma.deal.create({
    data: dealData
  });

  return result;
};

const getAllDeals = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query)
    .search(['title', 'bannerHeading'])
    .filter()
    .sort()
    .paginate();
  const prismaArgs = queryBuilder.build();

  const result = await prisma.deal.findMany(prismaArgs as any);
  const total = await prisma.deal.count({ where: prismaArgs.where } as any);
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

const getActiveDeal = async () => {
  const activeDeal = await prisma.deal.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: 'desc' }
  });
  return activeDeal;
};

const getSingleDeal = async (id: string) => {
  const result = await prisma.deal.findUnique({
    where: { id }
  });
  return result;
};

const updateDeal = async (id: string, payload: any) => {
  const { startDate, endDate, discountStartPercent, discountEndPercent, ...rest } = payload;

  const dealData: any = {
    ...rest,
    ...(discountStartPercent !== undefined && { discountStartPercent }),
    ...(discountEndPercent !== undefined && { discountEndPercent }),
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) })
  };

  const result = await prisma.deal.update({
    where: { id },
    data: dealData
  });

  return result;
};

const deleteDeal = async (id: string) => {
  const result = await prisma.deal.delete({
    where: { id }
  });
  return result;
};

export const DealService = {
  createDeal,
  getAllDeals,
  getActiveDeal,
  getSingleDeal,
  updateDeal,
  deleteDeal
};
