import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct: RequestHandler = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    ...(req.user?.role === 'VENDOR' ? { vendorId: req.user.userId } : {})
  };
  const result = await ProductService.createProduct(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: result
  });
});

const getAllProducts: RequestHandler = catchAsync(async (req, res) => {
  const filters = {
    ...req.query,
    ...(req.user?.role === 'VENDOR' ? { vendorId: req.user.userId } : {})
  };

  const result = await ProductService.getAllProducts(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getProductById: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.getProductById(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: result
  });
});

const deleteProduct: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.deleteProduct(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
    data: result
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct
};
