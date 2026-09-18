import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardService } from './dashboard.service';

const getAdminOverview: RequestHandler = catchAsync(async (req, res) => {
  const result = await DashboardService.getAdminOverview();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin overview metrics retrieved successfully.',
    data: result
  });
});

export const DashboardController = {
  getAdminOverview
};
