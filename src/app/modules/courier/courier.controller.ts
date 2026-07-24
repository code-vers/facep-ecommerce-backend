import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourierService } from './courier.service';

const createCourier: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourierService.createCourier(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Courier created successfully!',
    data: result
  });
});

const getAllCouriers: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourierService.getAllCouriers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Couriers retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

const updateCourier: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CourierService.updateCourier(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Courier updated successfully!',
    data: result
  });
});

const deleteCourier: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await CourierService.deleteCourier(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Courier deleted successfully!',
    data: result
  });
});

export const CourierController = {
  createCourier,
  getAllCouriers,
  updateCourier,
  deleteCourier
};
