import { Request, Response } from 'express';
import { OrderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import jwt from 'jsonwebtoken';
import config from '../../config';

export const OrderController = {
  createCheckoutSession: catchAsync(async (req: Request, res: Response) => {
    // Check if authenticated
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, config.jwt.accessSecret) as { userId: string };
        userId = decoded.userId;
      } catch (error) {
        // Ignore invalid tokens for checkout (fallback to guest)
      }
    }

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
  }),

  getMyOrders: catchAsync(async (req: Request, res: Response) => {
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await OrderService.getMyOrders(userId, { page, limit, search, status });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Orders retrieved successfully',
      meta: result.meta,
      data: result.data
    });
  }),

  getVendorOrders: catchAsync(async (req: Request, res: Response) => {
    const user = (req as Request & { user: { userId: string; role: string } }).user;
    const vendorId = user.userId;
    const role = user.role;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await OrderService.getVendorOrders(vendorId, role, {
      page,
      limit,
      search,
      status
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Vendor orders retrieved successfully',
      meta: result.meta,
      data: result.data
    });
  }),

  updateOrderStatus: catchAsync(async (req: Request, res: Response) => {
    const user = (req as Request & { user: { userId: string; role: string } }).user;
    const vendorId = user.userId;
    const role = user.role;
    const orderId = req.params.orderId as string;
    const { status } = req.body;

    const result = await OrderService.updateOrderStatus(
      orderId,
      status,
      role === 'ADMIN' ? 'ADMIN_BYPASS' : vendorId
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order status updated successfully',
      data: result
    });
  }),

  deleteOrder: catchAsync(async (req: Request, res: Response) => {
    const user = (req as Request & { user: { userId: string; role: string } }).user;
    const vendorId = user.userId;
    const role = user.role;
    const orderId = req.params.orderId as string;

    await OrderService.deleteOrder(orderId, role === 'ADMIN' ? 'ADMIN_BYPASS' : vendorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Order deleted successfully',
      data: null
    });
  })
};
