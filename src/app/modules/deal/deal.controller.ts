import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DealService } from './deal.service';

const createDeal: RequestHandler = catchAsync(async (req, res) => {
  const result = await DealService.createDeal(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Deal created successfully!',
    data: result
  });
});

const getAllDeals: RequestHandler = catchAsync(async (req, res) => {
  const result = await DealService.getAllDeals(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deals retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

const getActiveDeal: RequestHandler = catchAsync(async (_req, res) => {
  const result = await DealService.getActiveDeal();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Active deal retrieved successfully!',
    data: result
  });
});

const getSingleDeal: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DealService.getSingleDeal(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deal retrieved successfully!',
    data: result
  });
});

const updateDeal: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DealService.updateDeal(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deal updated successfully!',
    data: result
  });
});

const deleteDeal: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await DealService.deleteDeal(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Deal deleted successfully!',
    data: result
  });
});

export const DealController = {
  createDeal,
  getAllDeals,
  getActiveDeal,
  getSingleDeal,
  updateDeal,
  deleteDeal
};
