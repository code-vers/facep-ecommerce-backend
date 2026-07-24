import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ShippingZoneValidation } from './shippingZone.validation';
import { ShippingZoneController } from './shippingZone.controller';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', auth(Role.ADMIN), ShippingZoneController.getAllShippingZones);

router.post(
  '/',
  auth(Role.ADMIN),
  validateRequest(ShippingZoneValidation.createShippingZoneSchema),
  ShippingZoneController.createShippingZone
);

router.patch(
  '/:id',
  auth(Role.ADMIN),
  validateRequest(ShippingZoneValidation.updateShippingZoneSchema),
  ShippingZoneController.updateShippingZone
);

router.delete('/:id', auth(Role.ADMIN), ShippingZoneController.deleteShippingZone);

export const ShippingZoneRoutes = router;
