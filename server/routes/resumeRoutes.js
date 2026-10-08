import express from 'express';
import { uploadResume, getResumeStatus } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleResumeUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, handleResumeUpload, uploadResume);
router.get('/status', protect, getResumeStatus);

export default router;
