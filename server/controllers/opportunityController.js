import User from '../models/User.js';
import { discoverOpportunities } from '../services/contextSearch.js';

/**
 * @desc    Discover live job and internship opportunities using Vertex AI queries and Context.dev web search
 * @route   POST /api/opportunities/search
 * @access  Private (JWT Protected)
 */
export const searchOpportunities = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const candidateProfile = user.candidateProfile || req.body?.candidateProfile || null;

    if (!candidateProfile && (!user.preferredRoles || user.preferredRoles.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile or upload and analyze your resume first to discover matching opportunities.'
      });
    }

    const userPreferences = {
      preferredRoles: user.preferredRoles || [],
      location: user.location || 'India',
      workMode: user.workMode || 'Any',
      experienceLevel: user.experienceLevel || 'Student'
    };

    const discoveryResult = await discoverOpportunities(candidateProfile, userPreferences);

    return res.status(200).json({
      success: true,
      message: 'Opportunities discovered successfully',
      count: discoveryResult.count,
      queries: discoveryResult.queries,
      opportunities: discoveryResult.opportunities
    });
  } catch (error) {
    return next(error);
  }
};
