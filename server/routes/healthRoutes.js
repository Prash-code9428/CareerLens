import express from 'express';

const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CareerLens API is running'
  });
});

export default router;
