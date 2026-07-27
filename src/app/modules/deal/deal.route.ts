import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DealController } from './deal.controller';
import { DealValidation } from './deal.validation';
import { Role } from '@prisma/client';

const router = Router();

// Public routes
router.get('/active', DealController.getActiveDeal);
router.get('/', DealController.getAllDeals);
router.get('/:id', DealController.getSingleDeal);

// Admin protected routes
router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(DealValidation.createDealSchema),
  DealController.createDeal
);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(DealValidation.updateDealSchema),
  DealController.updateDeal
);

router.delete('/:id', auth(Role.ADMIN), DealController.deleteDeal);

export const DealRoutes = router;
