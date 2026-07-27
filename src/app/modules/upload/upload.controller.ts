import type { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const uploadFiles = catchAsync(async (req: Request, res: Response) => {
  // multer puts the array of files in req.files
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'No files were uploaded',
      data: null
    });
  }

  // Construct the local URLs (e.g., /uploads/products/filename.jpg)
  // Assumes we will serve the /uploads folder statically in app.ts
  const fileUrls = files.map((file) => `/uploads/products/${file.filename}`);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Files uploaded successfully',
    data: fileUrls
  });
});

export const UploadController = {
  uploadFiles
};
