import express, { type Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { Role } from '@prisma/client';
import auth from '../../middlewares/auth';
import { UploadController } from './upload.controller';

const router = express.Router();

// Base uploads directory
const baseUploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(baseUploadsDir)) {
  fs.mkdirSync(baseUploadsDir, { recursive: true });
}

// Setup Multer Storage for local images supporting dynamic target folders
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    // Determine folder from query parameter (e.g. ?folder=deals) or route params
    const folder = (req.query.folder as string) || (req.params as any)?.folder || 'products';
    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'products';
    const targetDir = path.join(baseUploadsDir, safeFolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (_req, file, cb) => {
    let ext = path.extname(file.originalname || '').toLowerCase();

    // Fallback: If ext is empty or '.blob', infer extension strictly from mimetype
    if (!ext || ext === '' || ext === '.blob') {
      const mime = (file.mimetype || '').toLowerCase();
      if (mime.includes('jpeg') || mime.includes('jpg')) ext = '.jpg';
      else if (mime.includes('png')) ext = '.png';
      else if (mime.includes('webp')) ext = '.webp';
      else if (mime.includes('gif')) ext = '.gif';
      else ext = '.png';
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Validate mime types to allow images
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  }
});

// Endpoint accepts an array of files under key 'files' with optional ?folder=deals query
router.post(
  '/',
  auth(Role.VENDOR, Role.ADMIN),
  upload.array('files', 10),
  UploadController.uploadFiles
);

// Endpoint accepting folder as path parameter e.g. /api/v1/uploads/deals
router.post(
  '/:folder',
  auth(Role.VENDOR, Role.ADMIN),
  upload.array('files', 10),
  UploadController.uploadFiles
);

export const UploadRoutes = router;
