import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PayoutService } from './payout.service';

export const PayoutController = {
  getWallet: catchAsync(async (req: Request, res: Response) => {
    const user = (req as Request & { user: { userId: string } }).user;
    const result = await PayoutService.getWallet(user.userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Wallet retrieved successfully',
      data: result
    });
  }),

  requestPayout: catchAsync(async (req: Request, res: Response) => {
    const user = (req as Request & { user: { userId: string } }).user;
    const { amount, paymentMethod, accountDetails } = req.body;

    const result = await PayoutService.requestPayout(user.userId, {
      amount: Number(amount),
      paymentMethod,
      accountDetails
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Payout requested successfully',
      data: result
    });
  }),

  getVendorPayouts: catchAsync(async (req: Request, res: Response) => {
    const user = (req as Request & { user: { userId: string } }).user;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await PayoutService.getVendorPayouts(user.userId, page, limit);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Vendor payouts retrieved successfully',
      data: result.data,
      meta: result.meta
    });
  }),

  getAllPayouts: catchAsync(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await PayoutService.getAllPayouts(page, limit);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All payouts retrieved successfully',
      data: result.data,
      meta: result.meta
    });
  }),

  updatePayoutStatus: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status, adminNotes } = req.body;

    const result = await PayoutService.updatePayoutStatus(id, status, adminNotes);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Payout status updated successfully',
      data: result
    });
  })
};
