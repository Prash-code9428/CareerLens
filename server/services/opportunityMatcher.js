import { generateStructuredContent } from './vertexAI.js';

/**
 * OpenAPI / JSON Schema definition for Vertex AI opportunity matching
 */
export const OPPORTUNITY_MATCH_SCHEMA = {
  type: 'OBJECT',
  properties: {
    matchScore: {
      type: 'INTEGER',
      description: 'An integer match score from 0 to 100 based strictly on overlap of candidate skills, experience level, preferred roles, location, and work mode against explicitly stated opportunity criteria.'
    },
    matchingSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Skills explicitly stated in the opportunity description that the candidate possesses.'
    },
    missingSkills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Skills explicitly required or mentioned in the opportunity description that the candidate does NOT possess. Do NOT infer or hallucinate unmentioned skills.'
    },
    reason: {
      type: 'STRING',
      description: 'A concise factual 1-2 sentence explanation of the match score, citing specific skills or role alignment.'
    },
    recommendation: {
      type: 'STRING',
      enum: ['Strong Match', 'Good Match', 'Possible Match', 'Low Match'],
      description: 'Categorical recommendation string: Strong Match (85-100), Good Match (70-84), Possible Match (50-69), or Low Match (0-49).'
    },
    salary: {
      type: 'STRING',
      nullable: true,
      description: 'Compensation or stipend if explicitly stated in the opportunity description, otherwise null.'
    }
  },
  required: ['matchScore', 'matchingSkills', 'missingSkills', 'reason', 'recommendation']
};

const SYSTEM_INSTRUCTION = `You are the CareerLens Opportunity Intelligence and Match Engine.
Your task is to evaluate the alignment between a candidate profile and a specific job/internship opportunity.

CRITICAL MATCHING RULES:
1. Ground truth only: Use ONLY the provided candidate profile facts and the opportunity description.
2. DO NOT hallucinate requirements: If an opportunity description does not explicitly mention a skill or tool, do NOT claim it requires that skill or list it under missingSkills.
3. matchScore must be an integer between 0 and 100.
4. recommendation must be EXACTLY one of: 'Strong Match', 'Good Match', 'Possible Match', 'Low Match'.
   - 85–100: Strong Match
   - 70–84: Good Match
   - 50–69: Possible Match
   - 0–49: Low Match
5. If salary or compensation is not explicitly stated in the opportunity text, return null for salary.
6. Provide a concise, factual reason (1-2 sentences) explaining the alignment.
7. Return pure JSON conforming strictly to the requested schema.`;

/**
 * Validates and normalizes raw match response from Vertex AI
 * 
 * @param {Object} rawMatch - Raw output from model or fallback
 * @returns {Object} Normalized match evaluation adhering to exact output contract
 */
export const validateAndNormalizeMatch = (rawMatch) => {
  if (!rawMatch || typeof rawMatch !== 'object') {
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      reason: 'Unable to evaluate match score.',
      recommendation: 'Low Match'
    };
  }

  // Ensure matchScore is an integer between 0 and 100
  let matchScore = parseInt(rawMatch.matchScore, 10);
  if (isNaN(matchScore)) {
    matchScore = 0;
  }
  matchScore = Math.max(0, Math.min(100, matchScore));

  // Determine valid recommendation
  const validRecommendations = ['Strong Match', 'Good Match', 'Possible Match', 'Low Match'];
  let recommendation = rawMatch.recommendation?.trim();

  if (!validRecommendations.includes(recommendation)) {
    if (matchScore >= 85) recommendation = 'Strong Match';
    else if (matchScore >= 70) recommendation = 'Good Match';
    else if (matchScore >= 50) recommendation = 'Possible Match';
    else recommendation = 'Low Match';
  }

  const toStringArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return Array.from(
      new Set(
        arr
          .map((s) => (typeof s === 'string' ? s.trim() : ''))
          .filter((s) => s.length > 0)
      )
    );
  };

  const matchingSkills = toStringArray(rawMatch.matchingSkills);
  const missingSkills = toStringArray(rawMatch.missingSkills);

  const reason = (rawMatch.reason || '').trim() ||
    (matchingSkills.length > 0
      ? `Matches key candidate skills: ${matchingSkills.join(', ')}.`
      : 'General role alignment based on profile criteria.');

  return {
    matchScore,
    matchingSkills,
    missingSkills,
    reason,
    recommendation
  };
};

/**
 * Fallback heuristic matcher when Vertex AI is not configured or in test environments
 * 
 * @param {Object} candidate - Candidate profile
 * @param {Object} opportunity - Opportunity object
 * @returns {Object} Normalized match object
 */
export const evaluateMatchHeuristic = (candidate, opportunity) => {
  const allCandidateSkills = [
    ...(candidate?.skills || []),
    ...(candidate?.programmingLanguages || []),
    ...(candidate?.frameworks || []),
    ...(candidate?.databases || [])
  ].map((s) => s.toLowerCase().trim()).filter(Boolean);

  const oppText = `${opportunity?.title || ''} ${opportunity?.description || ''}`.toLowerCase();
  
  const matchingSkills = [];
  for (const skill of allCandidateSkills) {
    // Check whole-word or simple substring containment in opportunity text
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(oppText)) {
      // Find original casing if available
      const original = (candidate?.skills || candidate?.programmingLanguages || candidate?.frameworks || []).find(
        (s) => s.toLowerCase() === skill
      ) || skill;
      matchingSkills.push(original);
    }
  }

  const uniqueMatchingSkills = Array.from(new Set(matchingSkills));

  // Role title alignment
  const preferredRoles = (candidate?.preferredRoles || []).map((r) => r.toLowerCase());
  const oppTitle = (opportunity?.title || '').toLowerCase();
  const roleMatches = preferredRoles.some((r) => oppTitle.includes(r) || r.includes(oppTitle));

  // Location/WorkMode alignment
  const locMatch = !candidate?.location || (opportunity?.location || '').toLowerCase().includes(candidate.location.toLowerCase());

  let score = 30; // base score for discovery
  if (roleMatches) score += 30;
  score += Math.min(30, uniqueMatchingSkills.length * 10);
  if (locMatch) score += 10;
  score = Math.min(100, Math.max(0, score));

  let recommendation = 'Low Match';
  if (score >= 85) recommendation = 'Strong Match';
  else if (score >= 70) recommendation = 'Good Match';
  else if (score >= 50) recommendation = 'Possible Match';

  return validateAndNormalizeMatch({
    matchScore: score,
    matchingSkills: uniqueMatchingSkills,
    missingSkills: [], // Do not hallucinate missing requirements if text doesn't specify
    reason: uniqueMatchingSkills.length > 0
      ? `Matches ${uniqueMatchingSkills.length} of candidate's skills (${uniqueMatchingSkills.join(', ')}) with ${opportunity?.title || 'role'}.`
      : `General alignment with ${opportunity?.title || 'the position'}.`,
    recommendation
  });
};

/**
 * Match a single opportunity against a candidate profile using Vertex AI
 * 
 * @param {Object} candidate - Candidate profile details
 * @param {Object} opportunity - Opportunity object { title, company, description, location, source, url }
 * @returns {Promise<Object>} Match result { matchScore, matchingSkills, missingSkills, reason, recommendation }
 */
export const matchOpportunityWithVertexAI = async (candidate, opportunity) => {
  if (!opportunity || !opportunity.title) {
    return validateAndNormalizeMatch(null);
  }

  const candidateContext = `Candidate Information:
- Skills: ${(candidate?.skills || []).join(', ') || 'None specified'}
- Programming Languages: ${(candidate?.programmingLanguages || []).join(', ') || 'None'}
- Frameworks & Libraries: ${(candidate?.frameworks || []).join(', ') || 'None'}
- Databases: ${(candidate?.databases || []).join(', ') || 'None'}
- Experience Level: ${candidate?.experienceLevel || 'Student'}
- Education: ${Array.isArray(candidate?.education) ? candidate.education.map(e => `${e.degree || ''} in ${e.major || ''} at ${e.institution || ''}`).join('; ') : 'Undergraduate'}
- Preferred Roles: ${(candidate?.preferredRoles || []).join(', ') || 'Software Engineer Intern'}
- Target Location: ${candidate?.location || 'India'}
- Preferred Work Mode: ${candidate?.workMode || 'Any'}`;

  const opportunityContext = `Opportunity Information:
- Title: ${opportunity.title || 'Untitled'}
- Company: ${opportunity.company || 'Unknown Company'}
- Location: ${opportunity.location || 'Not specified'}
- Source: ${opportunity.source || 'Web'}
- Description: ${opportunity.description || 'No detailed description provided.'}`;

  const prompt = `${candidateContext}

${opportunityContext}

Evaluate this opportunity against the candidate's profile strictly according to the rules and schema.`;

  try {
    const rawResult = await generateStructuredContent({
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      responseSchema: OPPORTUNITY_MATCH_SCHEMA
    });

    return validateAndNormalizeMatch(rawResult);
  } catch (error) {
    console.warn('Vertex AI opportunity match failed, engaging heuristic evaluation fallback:', error.message);
    return evaluateMatchHeuristic(candidate, opportunity);
  }
};

/**
 * Match and rank multiple opportunities against a candidate profile.
 * Sorts all evaluated opportunities by matchScore in descending order.
 * 
 * @param {Object} candidate - Candidate profile details
 * @param {Array<Object>} opportunities - List of opportunities to evaluate
 * @returns {Promise<Array<Object>>} Ranked opportunities with attached match evaluations
 */
export const rankAndMatchOpportunities = async (candidate, opportunities = []) => {
  if (!Array.isArray(opportunities) || opportunities.length === 0) {
    return [];
  }

  // Execute matching in parallel with safe concurrency
  const matchPromises = opportunities.map(async (opp) => {
    try {
      const match = await matchOpportunityWithVertexAI(candidate, opp);
      return {
        ...opp,
        matchScore: match.matchScore,
        matchingSkills: match.matchingSkills,
        missingSkills: match.missingSkills,
        reason: match.reason,
        recommendation: match.recommendation
      };
    } catch (e) {
      const fallback = evaluateMatchHeuristic(candidate, opp);
      return {
        ...opp,
        ...fallback
      };
    }
  });

  const rankedResults = await Promise.all(matchPromises);

  // Sort descending by matchScore (highest match first)
  rankedResults.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return rankedResults;
};

export default {
  OPPORTUNITY_MATCH_SCHEMA,
  validateAndNormalizeMatch,
  evaluateMatchHeuristic,
  matchOpportunityWithVertexAI,
  rankAndMatchOpportunities
};
