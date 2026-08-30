import type { RequestHandler } from 'express';

import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const getMe: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new AppError(401, 'You are not authorized.');
  }

  const userId = req.user.userId;
  const result = await UserService.getMe(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully.',
    data: result
  });
});

const updateMe: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(401, 'You are not authorized.');
  const result = await UserService.updateMe(req.user.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully.',
    data: result
  });
});

const deactivateMe: RequestHandler = catchAsync(async (req, res) => {
  if (!req.user) throw new AppError(401, 'You are not authorized.');
  const result = await UserService.deactivateMe(req.user.userId, req.body);
  res.clearCookie('refreshToken');
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account deactivated successfully.',
    data: result
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully.',
    meta: result.meta,
    data: result.data
  });
});

const changeRole: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.changeRole(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User role updated successfully.',
    data: result
  });
});

const reactivateUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserService.reactivateUser(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User account reactivated successfully.',
    data: result
  });
});

const getAddresses: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.getAddresses(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Addresses retrieved successfully.',
    data
  });
});

const createAddress: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.createAddress(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Address created successfully.',
    data
  });
});

const updateAddress: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.updateAddress(
    req.user!.userId,
    req.params.addressId as string,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Address updated successfully.',
    data
  });
});

const setDefaultAddress: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.setDefaultAddress(
    req.user!.userId,
    req.params.addressId as string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Default address updated successfully.',
    data
  });
});

const deleteAddress: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.deleteAddress(req.user!.userId, req.params.addressId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Address deleted successfully.',
    data
  });
});

const getPaymentMethods: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.getPaymentMethods(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment methods retrieved successfully.',
    data
  });
});

const createPaymentMethod: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.createPaymentMethod(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment method created successfully.',
    data
  });
});

const updatePaymentMethod: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.updatePaymentMethod(
    req.user!.userId,
    req.params.paymentMethodId as string,
    req.body
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment method updated successfully.',
    data
  });
});

const setDefaultPaymentMethod: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.setDefaultPaymentMethod(
    req.user!.userId,
    req.params.paymentMethodId as string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Default payment method updated successfully.',
    data
  });
});

const deletePaymentMethod: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.deletePaymentMethod(
    req.user!.userId,
    req.params.paymentMethodId as string
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment method deleted successfully.',
    data
  });
});

const updatePaymentPreference: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.updatePaymentPreference(req.user!.userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment preference updated successfully.',
    data
  });
});

const getPlatformSettings: RequestHandler = catchAsync(async (_req, res) => {
  const data = await UserService.getPlatformSettings();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Platform settings retrieved successfully.',
    data
  });
});

const updatePlatformSettings: RequestHandler = catchAsync(async (req, res) => {
  const data = await UserService.updatePlatformSettings(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Platform settings updated successfully.',
    data
  });
});

export const UserController = {
  getMe,
  updateMe,
  deactivateMe,
  getAllUsers,
  changeRole,
  reactivateUser,
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  updatePaymentPreference,
  getPlatformSettings,
  updatePlatformSettings
};
