import type { RequestHandler } from 'express';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WishlistService } from './wishlist.service';

const toggleWishlist: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, 'You are not authorized.');
  }

  const { productId } = req.body;
  if (!productId) {
    throw new AppError(400, 'Product ID is required.');
  }

  const result = await WishlistService.toggleWishlist(req.user.userId, productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result
  });
});

const addToWishlist: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, 'You are not authorized.');
  }

  const { productId } = req.body;
  if (!productId) {
    throw new AppError(400, 'Product ID is required.');
  }

  const result = await WishlistService.addToWishlist(req.user.userId, productId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: result.message,
    data: result
  });
});

const removeFromWishlist: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, 'You are not authorized.');
  }

  const { productId } = req.params;
  if (!productId) {
    throw new AppError(400, 'Product ID is required.');
  }

  const result = await WishlistService.removeFromWishlist(req.user.userId, productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result
  });
});

const checkWishlistStatus: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, 'You are not authorized.');
  }

  const { productId } = req.params;
  if (!productId) {
    throw new AppError(400, 'Product ID is required.');
  }

  const result = await WishlistService.checkWishlistStatus(req.user.userId, productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wishlist status retrieved successfully.',
    data: result
  });
});

const getUserWishlist: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, 'You are not authorized.');
  }

  const result = await WishlistService.getUserWishlist(req.user.userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wishlist items retrieved successfully.',
    meta: result.meta,
    data: result.data
  });
});

const getUserWishlistedProductIds: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, 'You are not authorized.');
  }

  const result = await WishlistService.getUserWishlistedProductIds(req.user.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Wishlisted product IDs retrieved successfully.',
    data: result
  });
});

export const WishlistController = {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus,
  getUserWishlist,
  getUserWishlistedProductIds
};
