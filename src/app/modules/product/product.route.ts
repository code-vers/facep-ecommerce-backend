import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(ProductValidation.createProductValidationSchema),
  ProductController.createProduct
);

router.get('/', ProductController.getAllProducts);

export const ProductRoutes = router;
