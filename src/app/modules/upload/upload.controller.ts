import type { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const uploadFiles = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'No files were uploaded',
      data: null
    });
  }

  // Determine target folder for response URL
  const folder = (req.query.folder as string) || (req.params as any)?.folder || 'products';
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'products';

  // Construct local static URLs (e.g., /uploads/deals/filename.jpg)
  const fileUrls = files.map((file) => `/uploads/${safeFolder}/${file.filename}`);

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
