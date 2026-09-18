import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import type {
  IVendorReviewsResponse,
  ICategoryReview,
  ICategoryReviewProduct,
  ITopRatedProduct,
  IReviewItem
} from './review.interface';

const ensureInitialReviews = async () => {
  const count = await prisma.review.count();
  if (count > 0) return;

  const products = await prisma.product.findMany({ take: 6 });
  if (products.length === 0) return;

  const demoReviews = [
    {
      name: 'Dianne Russell',
      rating: 5,
      comment: "Exactly what I needed. High quality, well packaged and exceeded my expectations!",
      avatar: 'https://i.pravatar.cc/150?u=1',
      reply: 'Thank you for your valuable feedback! We are thrilled you love it.'
    },
    {
      name: 'John Doe',
      rating: 5,
      comment: 'Super fast delivery and fantastic build quality. Will definitely order again.',
      avatar: 'https://i.pravatar.cc/150?u=2',
      reply: null
    },
    {
      name: 'Emma Johnson',
      rating: 4,
      comment: 'Really good product, works as advertised. Setup was very smooth.',
      avatar: 'https://i.pravatar.cc/150?u=3',
      reply: null
    },
    {
      name: 'Sophia Brown',
      rating: 5,
      comment: 'Exceptional craftsmanship! One of the best purchases I have made this year.',
      avatar: 'https://i.pravatar.cc/150?u=4',
      reply: 'Thanks a lot for supporting our store!'
    },
    {
      name: 'Michael Smith',
      rating: 4,
      comment: 'Good value for money. Minor delay in courier, but the product is solid.',
      avatar: 'https://i.pravatar.cc/150?u=5',
      reply: null
    },
    {
      name: 'Sarah Connor',
      rating: 5,
      comment: 'Loved the attention to detail. Highly recommend to everyone.',
      avatar: 'https://i.pravatar.cc/150?u=6',
      reply: null
    }
  ];

  for (let i = 0; i < demoReviews.length; i++) {
    const targetProduct = products[i % products.length];
    const item = demoReviews[i];
    await prisma.review.create({
      data: {
        productId: targetProduct.id,
        reviewerName: item.name,
        reviewerAvatar: item.avatar,
        rating: item.rating,
        comment: item.comment,
        replyText: item.reply,
        replyDate: item.reply ? new Date() : null
      }
    });
  }
};

const getVendorReviews = async (vendorId: string): Promise<IVendorReviewsResponse> => {
  await ensureInitialReviews();

  // Find vendor products, or if vendor has none, fetch active products so the vendor can see categories
  let products = await prisma.product.findMany({
    where: { vendorId },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (products.length === 0) {
    products = await prisma.product.findMany({
      take: 12,
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  // Get units sold per product
  const productIds = products.map((p) => p.id);
  const salesGroup =
    productIds.length > 0
      ? await prisma.orderItem.groupBy({
          by: ['productId'],
          where: { productId: { in: productIds } },
          _sum: { quantity: true }
        })
      : [];

  const salesMap = new Map<string, number>();
  salesGroup.forEach((g) => {
    salesMap.set(g.productId, g._sum.quantity || 0);
  });

  // Group products by category
  const categoryMap = new Map<
    string,
    {
      categoryId: string;
      categoryName: string;
      categoryImage: string | null;
      products: ICategoryReviewProduct[];
    }
  >();

  const allReviewsList: { rating: number }[] = [];

  const productReviewStats: ITopRatedProduct[] = [];

  for (const product of products) {
    const catId = product.category?.id || 'general';
    const catName = product.category?.name || 'General';
    const catImage = product.category?.imageUrl || null;

    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, {
        categoryId: catId,
        categoryName: catName,
        categoryImage: catImage,
        products: []
      });
    }

    const reviews = product.reviews || [];
    const totalReviews = reviews.length;
    const ratingSum = reviews.reduce((sum, r) => sum + r.rating, 0);
    const overallRating =
      totalReviews > 0 ? Math.round((ratingSum / totalReviews) * 10) / 10 : 0;

    reviews.forEach((r) => allReviewsList.push({ rating: r.rating }));

    const formattedReviews: IReviewItem[] = reviews.map((r) => ({
      id: r.id,
      reviewerName: r.reviewerName,
      reviewerAvatar: r.reviewerAvatar,
      rating: r.rating,
      comment: r.comment,
      replyText: r.replyText,
      replyDate: r.replyDate ? new Date(r.replyDate).toISOString().split('T')[0] : null,
      createdAt: new Date(r.createdAt).toISOString().split('T')[0]
    }));

    const unitsSold = salesMap.get(product.id) || 0;

    const catProduct: ICategoryReviewProduct = {
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      basePrice: Number(product.basePrice),
      totalReviews,
      overallRating,
      unitsSold,
      reviews: formattedReviews
    };

    categoryMap.get(catId)!.products.push(catProduct);

    productReviewStats.push({
      id: product.id,
      name: product.name,
      image: product.thumbnail,
      unitsSold,
      rating: overallRating || 4.5,
      price: Number(product.basePrice),
      reviewsCount: totalReviews
    });
  }

  // Build category reviews array
  const categoryReviews: ICategoryReview[] = Array.from(categoryMap.values()).map((cat) => {
    const catTotalReviews = cat.products.reduce((sum, p) => sum + p.totalReviews, 0);
    const catRatingSum = cat.products.reduce((sum, p) => sum + p.overallRating * p.totalReviews, 0);
    const catAverageRating =
      catTotalReviews > 0 ? Math.round((catRatingSum / catTotalReviews) * 10) / 10 : 4.5;

    return {
      categoryId: cat.categoryId,
      categoryName: cat.categoryName,
      categoryImage: cat.categoryImage,
      totalReviews: catTotalReviews,
      averageRating: catAverageRating,
      productsCount: cat.products.length,
      products: cat.products
    };
  });

  // Sort categories by total reviews descending
  categoryReviews.sort((a, b) => b.totalReviews - a.totalReviews);

  // Summary Stats
  const totalReviews = allReviewsList.length;
  const ratingSumAll = allReviewsList.reduce((sum, r) => sum + r.rating, 0);
  const averageRating =
    totalReviews > 0 ? Math.round((ratingSumAll / totalReviews) * 10) / 10 : 4.8;
  const positiveReviews = allReviewsList.filter((r) => r.rating >= 4).length;
  const negativeReviews = allReviewsList.filter((r) => r.rating <= 2).length;

  // Top Rated Products (sorted by rating descending, then reviews count)
  productReviewStats.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  const topRatedProducts = productReviewStats.slice(0, 5);

  return {
    stats: {
      averageRating,
      totalReviews,
      positiveReviews,
      negativeReviews
    },
    topRatedProducts,
    categoryReviews
  };
};

const replyToReview = async (vendorId: string, reviewId: string, replyText: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: { product: true }
  });

  if (!review) {
    throw new AppError(404, 'Review not found');
  }

  if (review.product.vendorId && review.product.vendorId !== vendorId) {
    throw new AppError(403, 'You can only reply to reviews on your own products');
  }

  return prisma.review.update({
    where: { id: reviewId },
    data: {
      replyText,
      replyDate: new Date()
    }
  });
};

const createReview = async (data: {
  productId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatar?: string;
  userId?: string;
}) => {
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product) throw new AppError(404, 'Product not found');

  return prisma.review.create({
    data: {
      productId: data.productId,
      userId: data.userId,
      rating: data.rating,
      comment: data.comment,
      reviewerName: data.reviewerName,
      reviewerAvatar: data.reviewerAvatar
    }
  });
};

export const ReviewService = {
  getVendorReviews,
  replyToReview,
  createReview
};
