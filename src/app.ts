import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type Application, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';

import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import sendResponse from './app/utils/sendResponse';

import { OrderController } from './app/modules/order/order.controller';

const app: Application = express();

const corsOptions: CorsOptions = {
  origin:
    config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',').map((origin) => origin.trim()),
  credentials: true
};

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));

// Stripe Webhook MUST be before express.json()
app.post(
  '/api/v1/checkout/webhook',
  express.raw({ type: 'application/json' }),
  OrderController.stripeWebhook
);

app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  '/api',
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.'
    }
  })
);

app.get('/health', (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Server is healthy.',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

app.use('/api/v1', router);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(notFound);
app.use(globalErrorHandler);

export default app;
