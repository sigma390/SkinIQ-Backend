import { Request } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
const skinImagesDir = path.join(uploadDir, 'skin-images');

// Ensure directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(skinImagesDir)) {
  fs.mkdirSync(skinImagesDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, skinImagesDir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `skin-${uniqueSuffix}${ext}`);
  },
});

// File filter to only allow images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

export default upload;
