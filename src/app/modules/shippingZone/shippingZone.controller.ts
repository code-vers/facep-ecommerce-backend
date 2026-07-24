import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ShippingZoneService } from './shippingZone.service';

const createShippingZone: RequestHandler = catchAsync(async (req, res) => {
  const result = await ShippingZoneService.createShippingZone(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Shipping zone created successfully!',
    data: result,
  });
});

const getAllShippingZones: RequestHandler = catchAsync(async (req, res) => {
  const result = await ShippingZoneService.getAllShippingZones();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping zones retrieved successfully!',
    data: result,
  });
});

const updateShippingZone: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await ShippingZoneService.updateShippingZone(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping zone updated successfully!',
    data: result,
  });
});

const deleteShippingZone: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await ShippingZoneService.deleteShippingZone(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shipping zone deleted successfully!',
    data: result,
  });
});

export const ShippingZoneController = {
  createShippingZone,
  getAllShippingZones,
  updateShippingZone,
  deleteShippingZone,
};
