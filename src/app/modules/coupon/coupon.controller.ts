import { Request, Response } from 'express';
import { CouponService } from './coupon.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export const CouponController = {
  createCoupon: catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.createCoupon(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Coupon created successfully.',
      data: result
    });
  }),

  getAllCouponsAdmin: catchAsync(async (req: Request, res: Response) => {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 15,
      search: req.query.search as string | undefined,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      isPublic: req.query.isPublic !== undefined ? req.query.isPublic === 'true' : undefined,
      scope: req.query.scope as any,
      discountType: req.query.discountType as any,
      sortBy: req.query.sortBy as string | undefined
    };

    const result = await CouponService.getAllCouponsAdmin(filters);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Coupons retrieved successfully.',
      meta: result.meta,
      data: result.data
    });
  }),

  getCouponStats: catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.getCouponStats();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Coupon statistics retrieved successfully.',
      data: result
    });
  }),

  getSingleCouponAdmin: catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.getSingleCouponAdmin(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Coupon retrieved successfully.',
      data: result
    });
  }),

  updateCoupon: catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.updateCoupon(req.params.id as string, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Coupon updated successfully.',
      data: result
    });
  }),

  toggleCouponStatus: catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.toggleCouponStatus(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Coupon status toggled to ${result.isActive ? 'Active' : 'Inactive'}.`,
      data: result
    });
  }),

  deleteCoupon: catchAsync(async (req: Request, res: Response) => {
    const result = await CouponService.deleteCoupon(req.params.id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null
    });
  }),

  getPublicCoupons: catchAsync(async (req: Request, res: Response) => {
    const filters = {
      search: req.query.search as string | undefined,
      categoryId: req.query.categoryId as string | undefined
    };

    const result = await CouponService.getPublicCoupons(filters);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Public coupons retrieved successfully.',
      data: result
    });
  }),

  validateCoupon: catchAsync(async (req: Request, res: Response) => {
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    const result = await CouponService.validateCoupon(req.body, userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: result
    });
  })
};
