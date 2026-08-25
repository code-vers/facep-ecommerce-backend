import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { DealController } from './deal.controller';
import { DealValidation } from './deal.validation';
import { Role } from '@prisma/client';

const router = Router();

// Only platform (admin) deals are returned to the public storefront.
router.get('/active', DealController.getActiveDeal);
router.get(
  '/category-availability',
  auth(Role.ADMIN, Role.VENDOR),
  DealController.getUnavailableCategoryIds
);
router.get('/', auth(Role.ADMIN, Role.VENDOR), DealController.getAllDeals);
router.get('/:id', auth(Role.ADMIN, Role.VENDOR), DealController.getSingleDeal);

// Admins and vendors both create deals. Vendors can only manage their own.
router.post(
  '/',
  auth(Role.ADMIN, Role.VENDOR),
  validateRequest(DealValidation.createDealSchema),
  DealController.createDeal
);

router.patch(
  '/:id',
  auth(Role.ADMIN, Role.VENDOR),
  validateRequest(DealValidation.updateDealSchema),
  DealController.updateDeal
);

router.delete('/:id', auth(Role.ADMIN, Role.VENDOR), DealController.deleteDeal);

export const DealRoutes = router;
