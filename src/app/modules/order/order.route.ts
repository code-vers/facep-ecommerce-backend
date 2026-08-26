import { Router } from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';

const router = Router();

// Allow guests or logged in users for checkout
router.post('/create-session', OrderController.createCheckoutSession);

// Fetch logged in user orders
router.get('/my-orders', auth('BUYER', 'ADMIN', 'VENDOR'), OrderController.getMyOrders);

export const OrderRoutes = router;
