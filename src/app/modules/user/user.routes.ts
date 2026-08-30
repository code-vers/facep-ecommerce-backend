import { Router } from 'express';

import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

const allRoles = auth('BUYER', 'ADMIN', 'VENDOR');
const buyerOnly = auth('BUYER');

router.get('/me', allRoles, UserController.getMe);
router.patch(
  '/me',
  allRoles,
  validateRequest(UserValidation.updateProfile),
  UserController.updateMe
);
router.delete(
  '/me',
  allRoles,
  validateRequest(UserValidation.deactivateAccount),
  UserController.deactivateMe
);

router.get('/me/addresses', buyerOnly, UserController.getAddresses);
router.post(
  '/me/addresses',
  buyerOnly,
  validateRequest(UserValidation.createAddress),
  UserController.createAddress
);
router.patch(
  '/me/addresses/:addressId',
  buyerOnly,
  validateRequest(UserValidation.updateAddress),
  UserController.updateAddress
);
router.patch('/me/addresses/:addressId/default', buyerOnly, UserController.setDefaultAddress);
router.delete('/me/addresses/:addressId', buyerOnly, UserController.deleteAddress);

router.get('/me/payment-methods', buyerOnly, UserController.getPaymentMethods);
router.post(
  '/me/payment-methods',
  buyerOnly,
  validateRequest(UserValidation.createPaymentMethod),
  UserController.createPaymentMethod
);
router.patch(
  '/me/payment-methods/:paymentMethodId',
  buyerOnly,
  validateRequest(UserValidation.updatePaymentMethod),
  UserController.updatePaymentMethod
);
router.patch(
  '/me/payment-methods/:paymentMethodId/default',
  buyerOnly,
  UserController.setDefaultPaymentMethod
);
router.delete(
  '/me/payment-methods/:paymentMethodId',
  buyerOnly,
  UserController.deletePaymentMethod
);
router.patch(
  '/me/payment-preference',
  buyerOnly,
  validateRequest(UserValidation.updatePaymentPreference),
  UserController.updatePaymentPreference
);

router.get('/platform-settings', auth('ADMIN'), UserController.getPlatformSettings);
router.patch(
  '/platform-settings',
  auth('ADMIN'),
  validateRequest(UserValidation.updatePlatformSettings),
  UserController.updatePlatformSettings
);
router.get('/', auth('ADMIN'), UserController.getAllUsers);
router.patch('/:id/reactivate', auth('ADMIN'), UserController.reactivateUser);
router.patch(
  '/:id/role',
  auth('ADMIN'),
  validateRequest(UserValidation.changeRole),
  UserController.changeRole
);

export const UserRoutes = router;
