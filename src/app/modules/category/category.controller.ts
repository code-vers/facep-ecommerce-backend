import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryService } from './category.service';

const createCategory: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Category created successfully!',
    data: result
  });
});

const getAllCategories: RequestHandler = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategories(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

const updateCategory: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CategoryService.updateCategory(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully!',
    data: result
  });
});

const deleteCategory: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CategoryService.deleteCategory(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Category deleted successfully!',
    data: result
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};
