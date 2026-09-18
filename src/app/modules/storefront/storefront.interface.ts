export interface IVendorStorefront {
  id?: string;
  vendorId: string;
  storeName: string;
  storeLogo: string | null;
  storeBanner: string | null;
  bannerHeadline: string;
  bannerSubheadline: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  returnPolicy: string;
  shippingPolicy: string;
  warrantyInformation: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUpdateStorefrontPayload {
  storeName?: string;
  storeLogo?: string;
  storeBanner?: string;
  bannerHeadline?: string;
  bannerSubheadline?: string;
  storeDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  returnPolicy?: string;
  shippingPolicy?: string;
  warrantyInformation?: string;
}
