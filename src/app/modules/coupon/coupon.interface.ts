import { CouponDiscountType, CouponScope } from '@prisma/client';

export interface ICreateCouponInput {
  code: string;
  title: string;
  description?: string | null;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  minOrderAmount?: number;
  scope?: CouponScope;
  categoryIds?: string[];
  productIds?: string[];
  usageLimit?: number | null;
  userUsageLimit?: number;
  startDate?: string | Date;
  endDate: string | Date;
  isActive?: boolean;
  isPublic?: boolean;
  badgeText?: string | null;
}

export interface IUpdateCouponInput extends Partial<ICreateCouponInput> {}

export interface ICouponQueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isPublic?: boolean;
  scope?: CouponScope;
  discountType?: CouponDiscountType;
  sortBy?: string;
}

export interface ICartItemValidation {
  productId: string;
  price: number;
  quantity: number;
  categoryId?: string;
}

export interface IValidateCouponInput {
  code: string;
  cartItems?: ICartItemValidation[];
  subtotal: number;
}
