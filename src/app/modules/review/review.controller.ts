import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const getVendorReviews: RequestHandler = catchAsync(async (req, res) => {
  const result = await ReviewService.getVendorReviews(req.user!.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor reviews retrieved successfully.',
    data: result
  });
});

const replyToReview: RequestHandler = catchAsync(async (req, res) => {
  const { replyText } = req.body;
  const result = await ReviewService.replyToReview(
    req.user!.userId,
    req.params.id as string,
    replyText
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reply submitted successfully.',
    data: result
  });
});

const createReview: RequestHandler = catchAsync(async (req, res) => {
  const result = await ReviewService.createReview({
    ...req.body,
    userId: req.user?.userId
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Review created successfully.',
    data: result
  });
});

export const ReviewController = {
  getVendorReviews,
  replyToReview,
  createReview
};
