import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductService } from './product.service';

const createProduct: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.createProduct(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully',
    data: result
  });
});

const getPublicProducts: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.getPublicProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getPublicFacets: RequestHandler = catchAsync(async (_req, res) => {
  const result = await ProductService.getPublicFacets();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product filters retrieved successfully',
    data: result
  });
});

const getPublicProductBySlug: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.getPublicProductBySlug(req.params.slug as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: result
  });
});

const getRelatedProducts: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.getRelatedProducts(req.params.slug as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Related products retrieved successfully',
    data: result
  });
});

const getVendorProducts: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.getVendorProducts(req.user!.userId, req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vendor products retrieved successfully',
    meta: result.meta,
    data: result.data
  });
});

const getVendorStats: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.getVendorStats(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product statistics retrieved successfully',
    data: result
  });
});

const getVendorProductById: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.getVendorProductById(
    req.user!.userId,
    req.params.id as string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully',
    data: result
  });
});

const updateProduct: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.updateProduct(
    req.user!.userId,
    req.params.id as string,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully',
    data: result
  });
});

const updateProductStatus: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.updateProductStatus(
    req.user!.userId,
    req.params.id as string,
    req.body.isActive
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Product ${req.body.isActive ? 'activated' : 'deactivated'} successfully`,
    data: result
  });
});

const deleteProduct: RequestHandler = catchAsync(async (req, res) => {
  const result = await ProductService.deleteProduct(req.user!.userId, req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully',
    data: result
  });
});

export const ProductController = {
  createProduct,
  getPublicProducts,
  getPublicFacets,
  getPublicProductBySlug,
  getRelatedProducts,
  getVendorProducts,
  getVendorStats,
  getVendorProductById,
  updateProduct,
  updateProductStatus,
  deleteProduct
};
