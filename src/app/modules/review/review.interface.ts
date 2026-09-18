export interface IReviewItem {
  id: string;
  reviewerName: string;
  reviewerAvatar: string | null;
  rating: number;
  comment: string;
  replyText: string | null;
  replyDate: string | null;
  createdAt: string;
}

export interface ICategoryReviewProduct {
  id: string;
  name: string;
  thumbnail: string;
  basePrice: number;
  totalReviews: number;
  overallRating: number;
  unitsSold: number;
  reviews: IReviewItem[];
}

export interface ICategoryReview {
  categoryId: string;
  categoryName: string;
  categoryImage: string | null;
  totalReviews: number;
  averageRating: number;
  productsCount: number;
  products: ICategoryReviewProduct[];
}

export interface ITopRatedProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  rating: number;
  price: number;
  reviewsCount: number;
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;
}

export interface IVendorReviewsResponse {
  stats: IReviewStats;
  topRatedProducts: ITopRatedProduct[];
  categoryReviews: ICategoryReview[];
}
