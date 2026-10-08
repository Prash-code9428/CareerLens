import express from 'express';
import { searchOpportunities } from '../controllers/opportunityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/search', protect, searchOpportunities);

export default router;
