import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StorefrontService } from './storefront.service';

const getStorefront: RequestHandler = catchAsync(async (req, res) => {
  const result = await StorefrontService.getStorefront(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Storefront details retrieved successfully.',
    data: result
  });
});

const updateStorefront: RequestHandler = catchAsync(async (req, res) => {
  const result = await StorefrontService.updateStorefront(req.user!.userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Storefront updated successfully.',
    data: result
  });
});

export const StorefrontController = {
  getStorefront,
  updateStorefront
};
