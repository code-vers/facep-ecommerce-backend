import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CouponController } from './coupon.controller';
import { CouponValidation } from './coupon.validation';
import { Role } from '@prisma/client';

const router = Router();

// Public routes for gallery and cart validation
router.get('/public', CouponController.getPublicCoupons);
router.post(
  '/validate',
  validateRequest(CouponValidation.validateCouponSchema),
  CouponController.validateCoupon
);

// Admin Coupon Management routes (Protected)
router.get('/admin/stats', auth(Role.ADMIN), CouponController.getCouponStats);
router.get('/admin', auth(Role.ADMIN), CouponController.getAllCouponsAdmin);
router.get('/admin/:id', auth(Role.ADMIN), CouponController.getSingleCouponAdmin);

router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(CouponValidation.createCouponSchema),
  CouponController.createCoupon
);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(CouponValidation.updateCouponSchema),
  CouponController.updateCoupon
);

router.patch('/:id/toggle', auth(Role.ADMIN), CouponController.toggleCouponStatus);

router.delete('/:id', auth(Role.ADMIN), CouponController.deleteCoupon);

export const CouponRoutes = router;
