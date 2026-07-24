import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourierValidation } from './courier.validation';
import { CourierController } from './courier.controller';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', auth(Role.ADMIN), CourierController.getAllCouriers);

router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(CourierValidation.createCourierSchema),
  CourierController.createCourier
);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(CourierValidation.updateCourierSchema),
  CourierController.updateCourier
);

router.delete('/:id', auth(Role.ADMIN), CourierController.deleteCourier);

export const CourierRoutes = router;
