export interface ICreateDealInput {
  title: string;
  bannerHeading?: string;
  bannerSubheading?: string;
  bannerImage?: string;
  bannerBgColor?: string;
  categoryIds?: string[];
  discountStartPercent?: number;
  discountEndPercent?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface IUpdateDealInput {
  title?: string;
  bannerHeading?: string;
  bannerSubheading?: string;
  bannerImage?: string;
  bannerBgColor?: string;
  categoryIds?: string[];
  discountStartPercent?: number;
  discountEndPercent?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
