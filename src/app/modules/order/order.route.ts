import { Router } from 'express';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

// Allow guests or logged in users for checkout
router.post('/create-session', OrderController.createCheckoutSession);

// Fetch logged in user orders
router.get(
  '/my-orders',
  auth('BUYER', 'ADMIN', 'VENDOR'),
  validateRequest(OrderValidation.getMyOrdersQuerySchema),
  OrderController.getMyOrders
);
router.get('/my-orders/:orderId', auth('BUYER', 'ADMIN', 'VENDOR'), OrderController.getMyOrderById);
router.patch(
  '/my-orders/:orderId/cancel',
  auth('BUYER', 'ADMIN', 'VENDOR'),
  validateRequest(OrderValidation.cancelOrderSchema),
  OrderController.cancelUserOrder
);

// Vendor routes
router.get('/vendor-orders', auth('VENDOR', 'ADMIN'), OrderController.getVendorOrders);
router.patch(
  '/vendor-orders/:orderId/status',
  auth('VENDOR', 'ADMIN'),
  OrderController.updateOrderStatus
);
router.delete('/vendor-orders/:orderId', auth('VENDOR', 'ADMIN'), OrderController.deleteOrder);

export const OrderRoutes = router;
