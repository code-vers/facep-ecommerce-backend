import type { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { InquiryService } from './inquiry.service';

const createInquiry: RequestHandler = catchAsync(async (req, res) => {
  const result = await InquiryService.createInquiry(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Inquiry submitted successfully!',
    data: result
  });
});

const getAllInquiries: RequestHandler = catchAsync(async (req, res) => {
  const result = await InquiryService.getAllInquiries(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Inquiries retrieved successfully!',
    meta: result.meta,
    data: result.data
  });
});

const getSingleInquiry: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await InquiryService.getSingleInquiry(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Inquiry retrieved successfully!',
    data: result
  });
});

const updateInquiry: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await InquiryService.updateInquiry(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Inquiry updated successfully!',
    data: result
  });
});

const deleteInquiry: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id as string;
  const result = await InquiryService.deleteInquiry(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Inquiry deleted successfully!',
    data: result
  });
});

export const InquiryController = {
  createInquiry,
  getAllInquiries,
  getSingleInquiry,
  updateInquiry,
  deleteInquiry
};
