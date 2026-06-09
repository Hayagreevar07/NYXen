/**
 * Image Analysis Routes
 * POST /api/analysis/upload  — Upload images (multer)
 * POST /api/analysis/analyze — Analyze uploaded images
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ENV from '../config/env';
import {
  analyzeConstructionElements,
  generateMeasurements,
} from '../services/imageAnalysisService';

const router = Router();

// Configure multer for image uploads
const uploadDir = path.join(process.cwd(), ENV.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: ENV.MAX_UPLOAD_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
});

// Store uploaded file references in memory (would be DB in production)
const uploadedFiles: Map<string, { id: string; path: string; originalName: string; size: number }> = new Map();

/**
 * POST /api/analysis/upload
 * Multipart form: images[]
 */
router.post('/upload', upload.array('images', 10), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No images uploaded' });
      return;
    }

    const results = files.map((file) => {
      const id = path.parse(file.filename).name;
      const entry = {
        id,
        path: file.path,
        originalName: file.originalname,
        size: file.size,
      };
      uploadedFiles.set(id, entry);
      return {
        id,
        originalName: file.originalname,
        size: file.size,
      };
    });

    res.json({ uploaded: results });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

/**
 * POST /api/analysis/analyze
 * Body: { imageIds: string[] }
 * Analyzes uploaded images and returns detected elements + measurements
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { imageIds } = req.body;

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      res.status(400).json({ message: 'imageIds array is required' });
      return;
    }

    const results = [];

    for (const imageId of imageIds) {
      let buffer: Buffer;
      let originalName: string;

      if (typeof imageId === 'string' && imageId.startsWith('demo-')) {
        // 1x1 transparent PNG
        buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        originalName = imageId === 'demo-foundation'
          ? 'foundation_excavation.jpg'
          : imageId === 'demo-framework'
          ? 'concrete_columns.jpg'
          : 'brick_masonry_wall.jpg';
      } else {
        const fileEntry = uploadedFiles.get(imageId);
        if (!fileEntry) {
          results.push({ imageId, error: 'File not found' });
          continue;
        }
        buffer = fs.readFileSync(fileEntry.path);
        originalName = fileEntry.originalName;
      }

      // Run analysis
      const analysis = await analyzeConstructionElements(buffer, imageId);
      const measurements = generateMeasurements(analysis);

      results.push({
        imageId,
        originalName,
        analysis,
        measurements,
      });
    }

    res.json({ results });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ message: 'Analysis failed' });
  }
});

export default router;
