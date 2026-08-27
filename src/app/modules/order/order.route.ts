import { Router } from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';

const router = Router();

// Allow guests or logged in users for checkout
router.post('/create-session', OrderController.createCheckoutSession);

// Fetch logged in user orders
router.get('/my-orders', auth('BUYER', 'ADMIN', 'VENDOR'), OrderController.getMyOrders);

// Vendor routes
router.get('/vendor-orders', auth('VENDOR', 'ADMIN'), OrderController.getVendorOrders);
router.patch(
  '/vendor-orders/:orderId/status',
  auth('VENDOR', 'ADMIN'),
  OrderController.updateOrderStatus
);
router.delete('/vendor-orders/:orderId', auth('VENDOR', 'ADMIN'), OrderController.deleteOrder);

export const OrderRoutes = router;
