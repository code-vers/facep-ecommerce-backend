import { Router } from 'express';
import auth from '../../middlewares/auth';
import { StorefrontController } from './storefront.controller';

const router = Router();

router.get('/vendor', auth('VENDOR'), StorefrontController.getStorefront);
router.patch('/vendor', auth('VENDOR'), StorefrontController.updateStorefront);
router.get('/:vendorId', StorefrontController.getPublicStorefront);

export const StorefrontRoutes = router;
