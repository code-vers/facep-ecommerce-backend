import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export const OrderController = {
  createCheckoutSession: catchAsync(async (req: Request, res: Response) => {
    // Check if authenticated
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    const result = await OrderService.createCheckoutSession(req.body, userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Checkout session created successfully',
      data: result
    });
  }),

  stripeWebhook: catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    await OrderService.handleWebhook(req.body, signature);
    res.json({ received: true });
  })
};
