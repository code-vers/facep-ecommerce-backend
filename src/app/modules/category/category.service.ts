import { Category, Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';

const createCategory = async (payload: {
  name: string;
  isActive: boolean;
  subcategories: string[];
}) => {
  const result = await prisma.category.create({
    data: {
      name: payload.name,
      isActive: payload.isActive,
      subcategories: {
        create: payload.subcategories.map((name) => ({ name }))
      }
    },
    include: {
      subcategories: true
    }
  });
  return result;
};

const getAllCategories = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(query).search(['name']).filter().sort().paginate();
  const prismaArgs = queryBuilder.build();

  // We need to fetch subcategories count as well

  const result = await prisma.category.findMany({
    ...(prismaArgs as unknown as Prisma.CategoryFindManyArgs),
    include: {
      _count: {
        select: { subcategories: true }
      }
    }
  });

  const total = await prisma.category.count({
    where: prismaArgs.where as unknown as Prisma.CategoryWhereInput
  });
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const totalPage = Math.ceil(total / limit);

  type CategoryWithCount = Category & { _count: { subcategories: number } };

  // Map to match frontend structure (mocking products, orders, sales for now)
  const mappedData = result.map((cat: CategoryWithCount) => ({
    id: cat.id,
    name: cat.name,
    subcategories: cat._count.subcategories,
    products: 0,
    orders: 0,
    sales: '$ 0',
    status: cat.isActive ? 'Active' : 'Disable',
    createdAt: cat.createdAt,
    updatedAt: cat.updatedAt,
    isActive: cat.isActive
  }));

  return {
    meta: {
      page,
      limit,
      total,
      totalPage
    },
    data: mappedData
  };
};

const updateCategory = async (
  id: string,
  payload: { name?: string; isActive?: boolean; subcategories?: string[] }
) => {
  return await prisma.$transaction(async (tx) => {
    // Basic category fields
    const dataToUpdate: Prisma.CategoryUpdateInput = {};
    if (payload.name !== undefined) dataToUpdate.name = payload.name;
    if (payload.isActive !== undefined) dataToUpdate.isActive = payload.isActive;

    await tx.category.update({
      where: { id },
      data: dataToUpdate
    });

    // Handle subcategories
    if (payload.subcategories) {
      // Delete existing subcategories
      await tx.subcategory.deleteMany({
        where: { categoryId: id }
      });
      // Insert new ones
      if (payload.subcategories.length > 0) {
        await tx.subcategory.createMany({
          data: payload.subcategories.map((name) => ({
            name,
            categoryId: id
          }))
        });
      }
    }

    return await tx.category.findUnique({
      where: { id },
      include: {
        subcategories: true
      }
    });
  });
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id
    }
  });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
