import express from 'express';
import { searchOpportunities, matchOpportunitiesController } from '../controllers/opportunityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/search', protect, searchOpportunities);
router.post('/match', protect, matchOpportunitiesController);

export default router;
