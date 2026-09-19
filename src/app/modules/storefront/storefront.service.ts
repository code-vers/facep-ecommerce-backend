import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import type { IVendorStorefront, IUpdateStorefrontPayload } from './storefront.interface';

const DEFAULT_BANNER =
  'https://images.unsplash.com/photo-1459156212016-c812468e2115?q=80&w=1400&auto=format&fit=crop';

const getStorefront = async (vendorId: string): Promise<IVendorStorefront> => {
  const vendor = await prisma.user.findUnique({
    where: { id: vendorId },
    select: {
      id: true,
      name: true,
      email: true,
      contactNumber: true,
      avatarUrl: true
    }
  });

  if (!vendor) {
    throw new AppError(404, 'Vendor not found');
  }

  const storefront = await prisma.vendorStorefront.findUnique({
    where: { vendorId }
  });

  return {
    id: storefront?.id,
    vendorId,
    storeName: storefront?.storeName || vendor.name || 'Store Name',
    storeLogo: storefront?.storeLogo || vendor.avatarUrl || null,
    storeBanner: storefront?.storeBanner || DEFAULT_BANNER,
    bannerHeadline: storefront?.bannerHeadline || 'Buy Your Favorite Plant',
    bannerSubheadline: storefront?.bannerSubheadline || `From ${vendor.name || 'Plant home'}`,
    storeDescription: storefront?.storeDescription || 'Brief product description',
    contactEmail: storefront?.contactEmail || vendor.email,
    contactPhone: storefront?.contactPhone || vendor.contactNumber || '+1 (555) 123-4567',
    returnPolicy:
      storefront?.returnPolicy ||
      '30-day return policy on unused and undamaged items in original packaging.',
    shippingPolicy:
      storefront?.shippingPolicy ||
      'Standard shipping takes 3-5 business days. Express shipping available at checkout.',
    warrantyInformation:
      storefront?.warrantyInformation || '1-year standard warranty on manufacturer defects.',
    createdAt: storefront?.createdAt ? new Date(storefront.createdAt).toISOString() : undefined,
    updatedAt: storefront?.updatedAt ? new Date(storefront.updatedAt).toISOString() : undefined
  };
};

const updateStorefront = async (
  vendorId: string,
  payload: IUpdateStorefrontPayload
): Promise<IVendorStorefront> => {
  const vendor = await prisma.user.findUnique({ where: { id: vendorId } });
  if (!vendor) {
    throw new AppError(404, 'Vendor not found');
  }

  const updatedStorefront = await prisma.vendorStorefront.upsert({
    where: { vendorId },
    update: {
      storeName: payload.storeName,
      storeLogo: payload.storeLogo,
      storeBanner: payload.storeBanner,
      bannerHeadline: payload.bannerHeadline,
      bannerSubheadline: payload.bannerSubheadline,
      storeDescription: payload.storeDescription,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      returnPolicy: payload.returnPolicy,
      shippingPolicy: payload.shippingPolicy,
      warrantyInformation: payload.warrantyInformation
    },
    create: {
      vendorId,
      storeName: payload.storeName || vendor.name,
      storeLogo: payload.storeLogo || vendor.avatarUrl,
      storeBanner: payload.storeBanner || DEFAULT_BANNER,
      bannerHeadline: payload.bannerHeadline || 'Buy Your Favorite Plant',
      bannerSubheadline: payload.bannerSubheadline || `From ${vendor.name || 'Plant home'}`,
      storeDescription: payload.storeDescription || 'Brief product description',
      contactEmail: payload.contactEmail || vendor.email,
      contactPhone: payload.contactPhone || vendor.contactNumber || '+1 (555) 123-4567',
      returnPolicy:
        payload.returnPolicy ||
        '30-day return policy on unused and undamaged items in original packaging.',
      shippingPolicy:
        payload.shippingPolicy ||
        'Standard shipping takes 3-5 business days. Express shipping available at checkout.',
      warrantyInformation:
        payload.warrantyInformation || '1-year standard warranty on manufacturer defects.'
    }
  });

  // Keep vendor User profile in sync
  const userUpdates: { name?: string; avatarUrl?: string; contactNumber?: string } = {};
  if (payload.storeName && payload.storeName !== vendor.name) {
    userUpdates.name = payload.storeName;
  }
  if (payload.storeLogo && payload.storeLogo !== vendor.avatarUrl) {
    userUpdates.avatarUrl = payload.storeLogo;
  }
  if (payload.contactPhone && payload.contactPhone !== vendor.contactNumber) {
    userUpdates.contactNumber = payload.contactPhone;
  }

  if (Object.keys(userUpdates).length > 0) {
    await prisma.user.update({
      where: { id: vendorId },
      data: userUpdates
    });
  }

  return {
    id: updatedStorefront.id,
    vendorId,
    storeName: updatedStorefront.storeName || vendor.name,
    storeLogo: updatedStorefront.storeLogo,
    storeBanner: updatedStorefront.storeBanner,
    bannerHeadline: updatedStorefront.bannerHeadline || '',
    bannerSubheadline: updatedStorefront.bannerSubheadline || '',
    storeDescription: updatedStorefront.storeDescription || '',
    contactEmail: updatedStorefront.contactEmail || vendor.email,
    contactPhone: updatedStorefront.contactPhone || '',
    returnPolicy: updatedStorefront.returnPolicy || '',
    shippingPolicy: updatedStorefront.shippingPolicy || '',
    warrantyInformation: updatedStorefront.warrantyInformation || '',
    createdAt: new Date(updatedStorefront.createdAt).toISOString(),
    updatedAt: new Date(updatedStorefront.updatedAt).toISOString()
  };
};

const getPublicStorefront = async (
  identifier: string
): Promise<IVendorStorefront & { productCount: number }> => {
  let vendor: {
    id: string;
    name: string;
    email: string;
    contactNumber: string | null;
    avatarUrl: string | null;
  } | null = null;

  if (identifier === '1' || identifier === 'default') {
    vendor = await prisma.user.findFirst({
      where: {
        role: 'VENDOR',
        storefront: { isNot: null }
      },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        avatarUrl: true
      }
    });

    if (!vendor) {
      vendor = await prisma.user.findFirst({
        where: { role: 'VENDOR' },
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          avatarUrl: true
        }
      });
    }
  } else {
    // 1. Try by User ID (vendor ID)
    vendor = await prisma.user.findUnique({
      where: { id: identifier },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        avatarUrl: true
      }
    });

    // 2. Try by Storefront ID
    if (!vendor) {
      const sf = await prisma.vendorStorefront.findUnique({
        where: { id: identifier },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
              avatarUrl: true
            }
          }
        }
      });
      if (sf?.vendor) {
        vendor = sf.vendor;
      }
    }

    // 3. Try by Store Name or User Name (case-insensitive)
    if (!vendor) {
      const cleanName = identifier.replace(/[-_]/g, ' ').trim();
      const sf = await prisma.vendorStorefront.findFirst({
        where: {
          storeName: { contains: cleanName, mode: 'insensitive' }
        },
        include: {
          vendor: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
              avatarUrl: true
            }
          }
        }
      });
      if (sf?.vendor) {
        vendor = sf.vendor;
      } else {
        vendor = await prisma.user.findFirst({
          where: {
            name: { contains: cleanName, mode: 'insensitive' },
            role: 'VENDOR'
          },
          select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
            avatarUrl: true
          }
        });
      }
    }
  }

  // Fallback if not found at all but any vendor exists
  if (!vendor) {
    vendor = await prisma.user.findFirst({
      where: { role: 'VENDOR' },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        avatarUrl: true
      }
    });
  }

  if (!vendor) {
    throw new AppError(404, 'Storefront not found');
  }

  const storefront = await prisma.vendorStorefront.findUnique({
    where: { vendorId: vendor.id }
  });

  const productCount = await prisma.product.count({
    where: { vendorId: vendor.id, isActive: true }
  });

  return {
    id: storefront?.id,
    vendorId: vendor.id,
    storeName: storefront?.storeName || vendor.name || 'Store Name',
    storeLogo: storefront?.storeLogo || vendor.avatarUrl || null,
    storeBanner: storefront?.storeBanner || DEFAULT_BANNER,
    bannerHeadline: storefront?.bannerHeadline || 'Buy Your Favorite Products',
    bannerSubheadline:
      storefront?.bannerSubheadline || `From ${storefront?.storeName || vendor.name}`,
    storeDescription: storefront?.storeDescription || 'Welcome to our official store on Facep.',
    contactEmail: storefront?.contactEmail || vendor.email,
    contactPhone: storefront?.contactPhone || vendor.contactNumber || '+1 (555) 123-4567',
    returnPolicy:
      storefront?.returnPolicy ||
      '30-day return policy on unused and undamaged items in original packaging.',
    shippingPolicy:
      storefront?.shippingPolicy ||
      'Standard shipping takes 3-5 business days. Express shipping available at checkout.',
    warrantyInformation:
      storefront?.warrantyInformation || '1-year standard warranty on manufacturer defects.',
    createdAt: storefront?.createdAt ? new Date(storefront.createdAt).toISOString() : undefined,
    updatedAt: storefront?.updatedAt ? new Date(storefront.updatedAt).toISOString() : undefined,
    productCount
  };
};

export const StorefrontService = {
  getStorefront,
  updateStorefront,
  getPublicStorefront
};
