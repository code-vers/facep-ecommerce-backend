import { Router } from 'express';
import auth from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get('/admin/overview', auth('ADMIN'), DashboardController.getAdminOverview);
router.get('/vendor/overview', auth('VENDOR'), DashboardController.getVendorOverview);

export const DashboardRoutes = router;
