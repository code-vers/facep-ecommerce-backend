import { Router } from 'express';
import { PayoutController } from './payout.controller';
import auth from '../../middlewares/auth';

const router = Router();

// Vendor routes
router.get('/wallet', auth('VENDOR'), PayoutController.getWallet);
router.post('/request', auth('VENDOR'), PayoutController.requestPayout);
router.get('/vendor-payouts', auth('VENDOR'), PayoutController.getVendorPayouts);

// Admin routes
router.get('/all-payouts', auth('ADMIN'), PayoutController.getAllPayouts);
router.patch('/:id/status', auth('ADMIN'), PayoutController.updatePayoutStatus);

export const PayoutRoutes = router;
