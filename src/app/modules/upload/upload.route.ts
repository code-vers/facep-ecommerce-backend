import express, { type Request } from 'express';
import multer from 'multer';
import path from 'path';
import { UploadController } from './upload.controller';

const router = express.Router();

// Setup Multer Storage for local product images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to backend's root uploads/products folder
    cb(null, path.join(process.cwd(), 'uploads', 'products'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename (timestamp + random string + original ext)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// We can validate mime types to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

// Endpoint accepts an array of files under the key 'files' (e.g. from FormData)
router.post(
  '/',
  upload.array('files', 10), // Max 10 images at once
  UploadController.uploadFiles
);

export const UploadRoutes = router;
