import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import type { IWishlistQueryParams } from './wishlist.interface';

const toggleWishlist = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError(404, 'Product not found.');
  }

  const existingWishlist = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (existingWishlist) {
    await prisma.wishlist.delete({
      where: {
        id: existingWishlist.id
      }
    });

    return {
      isWishlisted: false,
      message: 'Product removed from wishlist.'
    };
  }

  const newWishlist = await prisma.wishlist.create({
    data: {
      userId,
      productId
    },
    include: {
      product: {
        include: {
          category: true,
          subcategory: true,
          vendor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  return {
    isWishlisted: true,
    wishlistId: newWishlist.id,
    data: newWishlist,
    message: 'Product added to wishlist.'
  };
};

const addToWishlist = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new AppError(404, 'Product not found.');
  }

  const wishlist = await prisma.wishlist.upsert({
    where: {
      userId_productId: {
        userId,
        productId
      }
    },
    create: {
      userId,
      productId
    },
    update: {},
    include: {
      product: {
        include: {
          category: true,
          subcategory: true,
          vendor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  return {
    isWishlisted: true,
    wishlistId: wishlist.id,
    data: wishlist,
    message: 'Product added to wishlist.'
  };
};

const removeFromWishlist = async (userId: string, productId: string) => {
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: {
        id: existing.id
      }
    });
  }

  return {
    isWishlisted: false,
    message: 'Product removed from wishlist.'
  };
};

const checkWishlistStatus = async (userId: string, productId: string) => {
  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  return {
    isWishlisted: Boolean(wishlist),
    wishlistId: wishlist?.id || null
  };
};

const getUserWishlist = async (userId: string, query: IWishlistQueryParams) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereClause: Record<string, unknown> = {
    userId
  };

  if (query.search) {
    whereClause.product = {
      name: {
        contains: query.search,
        mode: 'insensitive'
      }
    };
  }

  const [total, data] = await Promise.all([
    prisma.wishlist.count({ where: whereClause }),
    prisma.wishlist.findMany({
      where: whereClause,
      include: {
        product: {
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};

const getUserWishlistedProductIds = async (userId: string) => {
  const wishlists = await prisma.wishlist.findMany({
    where: { userId },
    select: { productId: true }
  });

  return wishlists.map((w) => w.productId);
};

export const WishlistService = {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  getUserWishlist,
  getUserWishlistedProductIds
};
