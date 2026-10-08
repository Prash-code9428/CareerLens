import User from '../models/User.js';
import { discoverOpportunities } from '../services/contextSearch.js';
import { rankAndMatchOpportunities, matchOpportunityWithVertexAI } from '../services/opportunityMatcher.js';

/**
 * Helper to construct unified candidate context object from DB User document
 */
const buildCandidateContext = (user) => {
  return {
    skills: user.candidateProfile?.skills || [],
    programmingLanguages: user.candidateProfile?.programmingLanguages || [],
    frameworks: user.candidateProfile?.frameworks || [],
    databases: user.candidateProfile?.databases || [],
    tools: user.candidateProfile?.tools || [],
    experience: user.candidateProfile?.experience || [],
    education: user.candidateProfile?.education || (user.education ? [user.education] : []),
    preferredRoles: user.preferredRoles?.length ? user.preferredRoles : (user.candidateProfile?.preferredRoles || []),
    location: user.location || user.candidateProfile?.location || 'India',
    workMode: user.workMode || user.candidateProfile?.workMode || 'Any',
    experienceLevel: user.experienceLevel || user.candidateProfile?.experienceLevel || 'Student'
  };
};

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
    const candidate = buildCandidateContext(user);

    // AI-powered matching & ranking if candidate profile exists
    let rankedOpportunities = discoveryResult.opportunities;
    if (discoveryResult.opportunities.length > 0 && candidateProfile) {
      rankedOpportunities = await rankAndMatchOpportunities(candidate, discoveryResult.opportunities);
    }

    return res.status(200).json({
      success: true,
      message: 'Opportunities discovered and matched successfully',
      count: rankedOpportunities.length,
      queries: discoveryResult.queries,
      opportunities: rankedOpportunities
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Evaluate and rank opportunities against candidate profile using Vertex AI
 * @route   POST /api/opportunities/match
 * @access  Private (JWT Protected)
 */
export const matchOpportunitiesController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    const candidate = buildCandidateContext(user);
    const { opportunities, opportunity } = req.body;

    if (opportunity) {
      const matchResult = await matchOpportunityWithVertexAI(candidate, opportunity);
      return res.status(200).json({
        success: true,
        opportunity: {
          ...opportunity,
          ...matchResult
        }
      });
    }

    const opportunityList = Array.isArray(opportunities) ? opportunities : [];
    if (opportunityList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a list of opportunities to match.'
      });
    }

    const ranked = await rankAndMatchOpportunities(candidate, opportunityList);

    return res.status(200).json({
      success: true,
      count: ranked.length,
      opportunities: ranked
    });
  } catch (error) {
    return next(error);
  }
};

