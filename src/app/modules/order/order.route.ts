import { Router } from 'express';
import { OrderController } from './order.controller';

const router = Router();

// Allow guests or logged in users
router.post('/create-session', OrderController.createCheckoutSession);

export const OrderRoutes = router;
