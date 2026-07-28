import { Prisma, Product } from '@prisma/client';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';

interface IVariant {
  sku: string;
  image?: string;
  color?: string;
  size?: string;
  material?: string;
  storage?: string;
  price: number;
  stock: number;
}

interface ISpecification {
  name: string;
  value: string;
}

interface IProductPayload {
  variants?: IVariant[];
  specifications?: ISpecification[];
  tags?: string[];
  availableColors?: string[];
  previewImages?: string[];
  [key: string]: unknown;
}

export interface IProductQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  vendorId?: string;
  status?: string;
}

const createProduct = async (payload: IProductPayload): Promise<Product> => {
  const { variants, specifications, tags, availableColors, previewImages, ...productData } =
    payload;

  // Check if sku exists
  const isExist = await prisma.product.findUnique({
    where: { sku: productData.sku as string }
  });

  if (isExist) {
    throw new AppError(400, 'Product with this SKU already exists');
  }

  // Use a transaction
  const result = await prisma.$transaction(async (transactionClient: Prisma.TransactionClient) => {
    // Create the product
    const product = await transactionClient.product.create({
      data: {
        ...(productData as unknown as Prisma.ProductCreateInput),
        tags: tags || [],
        availableColors: availableColors || [],
        previewImages: previewImages || [],

        // Setup relations natively if there are any
        ...(variants &&
          variants.length > 0 && {
            variants: {
              create: variants.map((variant: IVariant) => ({
                sku: variant.sku,
                image: variant.image,
                color: variant.color,
                size: variant.size,
                material: variant.material,
                storage: variant.storage,
                price: variant.price,
                stock: variant.stock
              }))
            }
          }),

        ...(specifications &&
          specifications.length > 0 && {
            specifications: {
              create: specifications.map((spec: ISpecification) => ({
                name: spec.name,
                value: spec.value
              }))
            }
          })
      },
      include: {
        variants: true,
        specifications: true,
        category: true,
        subcategory: true,
        shippingZone: true,
        courier: true
      }
    });

    return product;
  });

  return result;
};

const getAllProducts = async (query: IProductQueryParams = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions: Prisma.ProductWhereInput[] = [];

  // Search Term Sanitization & Filter
  if (
    query.searchTerm &&
    query.searchTerm !== 'undefined' &&
    query.searchTerm !== 'null' &&
    query.searchTerm.trim() !== ''
  ) {
    const term = query.searchTerm.trim();
    whereConditions.push({
      OR: [
        { brand: { contains: term, mode: 'insensitive' } },
        { shortDescription: { contains: term, mode: 'insensitive' } },
        { sku: { contains: term, mode: 'insensitive' } },
        { keyFeatures: { contains: term, mode: 'insensitive' } },
        { productType: { contains: term, mode: 'insensitive' } },
        { detailedDescription: { contains: term, mode: 'insensitive' } },
        { category: { name: { contains: term, mode: 'insensitive' } } }
      ]
    });
  }

  // Category Filter
  if (
    query.categoryId &&
    query.categoryId !== 'undefined' &&
    query.categoryId !== 'null' &&
    query.categoryId.trim() !== ''
  ) {
    whereConditions.push({ categoryId: query.categoryId.trim() });
  }

  // Vendor Filter
  if (
    query.vendorId &&
    query.vendorId !== 'undefined' &&
    query.vendorId !== 'null' &&
    query.vendorId.trim() !== ''
  ) {
    whereConditions.push({
      OR: [
        { vendorId: query.vendorId.trim() },
        { vendorId: null }
      ]
    });
  }

  // Status Filter
  if (
    query.status &&
    query.status !== 'All' &&
    query.status !== 'undefined' &&
    query.status !== 'null' &&
    query.status.trim() !== ''
  ) {
    const statusLower = query.status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'available') {
      whereConditions.push({ stockStatus: 'AVAILABLE' });
    } else if (statusLower === 'out of stock' || statusLower === 'out_of_stock') {
      whereConditions.push({ stockStatus: 'OUT_OF_STOCK' });
    }
  }

  const where: Prisma.ProductWhereInput =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
        subcategory: true,
        vendor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        variants: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.product.count({ where })
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit) || 1
    },
    data: products
  };
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      subcategory: true,
      vendor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      variants: true,
      specifications: true
    }
  });

  if (!product) {
    throw new AppError(404, 'Product not found');
  }

  return product;
};

const deleteProduct = async (id: string) => {
  const isExist = await prisma.product.findUnique({ where: { id } });

  if (!isExist) {
    throw new AppError(404, 'Product not found');
  }

  const result = await prisma.product.delete({ where: { id } });
  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct
};
