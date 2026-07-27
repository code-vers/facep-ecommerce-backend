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

const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  return products;
};

export const ProductService = {
  createProduct,
  getAllProducts
};
