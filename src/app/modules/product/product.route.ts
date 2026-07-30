import { Role } from '@prisma/client';
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.get('/', ProductController.getPublicProducts);
router.get('/facets', ProductController.getPublicFacets);
router.get('/admin', auth(Role.ADMIN), ProductController.getAdminProducts);
router.get('/vendor/mine', auth(Role.VENDOR), ProductController.getVendorProducts);
router.get('/vendor/stats', auth(Role.VENDOR, Role.ADMIN), ProductController.getVendorStats);
router.get('/vendor/:id', auth(Role.VENDOR), ProductController.getVendorProductById);

router.post(
  '/',
  auth(Role.VENDOR),
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct
);
router.patch(
  '/:id',
  auth(Role.VENDOR),
  validateRequest(ProductValidation.updateProductValidationSchema),
  ProductController.updateProduct
);
router.patch(
  '/:id/status',
  auth(Role.VENDOR),
  validateRequest(ProductValidation.updateStatusValidationSchema),
  ProductController.updateProductStatus
);
router.delete('/:id', auth(Role.VENDOR), ProductController.deleteProduct);
router.get('/:slug', ProductController.getPublicProductBySlug);
router.get('/:slug/related', ProductController.getRelatedProducts);

export const ProductRoutes = router;
