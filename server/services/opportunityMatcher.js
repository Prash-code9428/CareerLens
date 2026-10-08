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
    ...(candidate?.databases || []),
    ...(candidate?.tools || [])
  ].map((s) => s.toLowerCase().trim()).filter(Boolean);

  const oppText = `${opportunity?.title || ''} ${opportunity?.description || ''} ${opportunity?.company || ''}`.toLowerCase();
  
  const matchingSkills = [];
  for (const skill of allCandidateSkills) {
    if (skill.length < 2) continue;
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(oppText)) {
      const original = [
        ...(candidate?.skills || []),
        ...(candidate?.programmingLanguages || []),
        ...(candidate?.frameworks || []),
        ...(candidate?.databases || []),
        ...(candidate?.tools || [])
      ].find((s) => s.toLowerCase() === skill) || skill;
      matchingSkills.push(original);
    }
  }

  const uniqueMatchingSkills = Array.from(new Set(matchingSkills));

  // Role title alignment
  const preferredRoles = (candidate?.preferredRoles || []).map((r) => r.toLowerCase());
  const oppTitle = (opportunity?.title || '').toLowerCase();
  const roleMatches = preferredRoles.some((r) => oppTitle.includes(r) || r.includes(oppTitle) || (r.includes('frontend') && oppTitle.includes('frontend')) || (r.includes('backend') && oppTitle.includes('backend')) || (r.includes('software') && oppTitle.includes('software')));

  // Common high-demand skills to check for gaps if not present
  const commonTech = ['TypeScript', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Python', 'React', 'Node.js', 'PostgreSQL'];
  const missingSkills = [];
  for (const tech of commonTech) {
    const techLower = tech.toLowerCase();
    if (oppText.includes(techLower) && !allCandidateSkills.includes(techLower)) {
      missingSkills.push(tech);
    }
  }

  // Location/WorkMode alignment
  const locMatch = !candidate?.location || (opportunity?.location || '').toLowerCase().includes(candidate.location.toLowerCase());

  let score = 45; // base score for discovery
  if (roleMatches) score += 25;
  score += Math.min(25, uniqueMatchingSkills.length * 8);
  if (locMatch) score += 5;
  score = Math.min(96, Math.max(20, score));

  let recommendation = 'Low Match';
  if (score >= 85) recommendation = 'Strong Match';
  else if (score >= 70) recommendation = 'Good Match';
  else if (score >= 50) recommendation = 'Possible Match';

  return validateAndNormalizeMatch({
    matchScore: score,
    matchingSkills: uniqueMatchingSkills,
    missingSkills: Array.from(new Set(missingSkills)).slice(0, 3),
    reason: uniqueMatchingSkills.length > 0
      ? `Aligns with candidate's background in ${uniqueMatchingSkills.slice(0, 3).join(', ')} for the ${opportunity?.title || 'role'}.`
      : `General alignment with candidate's target preferences in ${opportunity?.title || 'the position'}.`,
    recommendation
  });
};

export const BATCH_OPPORTUNITY_MATCH_SCHEMA = {
  type: 'OBJECT',
  properties: {
    matches: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          index: { type: 'INTEGER', description: '0-based index of the opportunity in the input list' },
          company: { type: 'STRING', description: 'Real hiring company/organization name' },
          title: { type: 'STRING', description: 'Clean, accurate job or internship title' },
          matchScore: { type: 'INTEGER', description: 'Match score from 0 to 100 based on candidate skills vs opportunity' },
          matchingSkills: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Candidate skills that match this role' },
          missingSkills: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Important skills required by this role that candidate lacks' },
          reason: { type: 'STRING', description: '1-2 sentence factual explanation of match' },
          recommendation: { type: 'STRING', enum: ['Strong Match', 'Good Match', 'Possible Match', 'Low Match'] },
          jobType: { type: 'STRING', enum: ['Internship', 'Full-time', 'Part-time', 'Contract'] },
          workMode: { type: 'STRING', enum: ['Remote', 'Hybrid', 'On-site'] }
        },
        required: ['index', 'matchScore', 'matchingSkills', 'missingSkills', 'reason', 'recommendation']
      }
    }
  },
  required: ['matches']
};

/**
 * Match and rank multiple opportunities against a candidate profile.
 * Uses a single batch Vertex AI call to prevent rate limiting and provide high-quality curation.
 * 
 * @param {Object} candidate - Candidate profile details
 * @param {Array<Object>} opportunities - List of opportunities to evaluate
 * @returns {Promise<Array<Object>>} Ranked opportunities with attached match evaluations
 */
export const rankAndMatchOpportunities = async (candidate, opportunities = []) => {
  if (!Array.isArray(opportunities) || opportunities.length === 0) {
    return [];
  }

  // Cap to top 15 most relevant opportunities for high-speed inference
  const candidateSlice = opportunities.slice(0, 15);

  const candidateContext = `Candidate Information:
- Skills: ${(candidate?.skills || []).join(', ') || 'Software Development'}
- Programming Languages: ${(candidate?.programmingLanguages || []).join(', ') || 'JavaScript, Python'}
- Frameworks & Libraries: ${(candidate?.frameworks || []).join(', ') || 'React, Node.js'}
- Databases & Tools: ${[...(candidate?.databases || []), ...(candidate?.tools || [])].join(', ') || 'MongoDB, Git'}
- Experience Level: ${candidate?.experienceLevel || 'Student'}
- Preferred Roles: ${(candidate?.preferredRoles || []).join(', ') || 'Software Engineer Intern'}
- Target Location: ${candidate?.location || 'India'}
- Preferred Work Mode: ${candidate?.workMode || 'Any'}`;

  const oppsList = candidateSlice.map((opp, idx) => `[Index ${idx}]
Title: ${opp.title}
Company: ${opp.company || 'Unknown'}
URL: ${opp.url}
Location: ${opp.location || 'Remote'}
Description: ${opp.description || 'No description provided'}`).join('\n\n');

  const prompt = `${candidateContext}

Here is the list of discovered tech opportunities:

${oppsList}

For each opportunity (Index 0 to ${candidateSlice.length - 1}):
1. Identify the actual hiring company name (e.g. Google, Microsoft, Uber, Razorpay, Swiggy, Startup). Do NOT return generic words like "Hiring Organization".
2. Clean the job title.
3. Calculate an accurate matchScore (0-100) based strictly on candidate skills overlap.
4. Extract matchingSkills (skills candidate has that role needs).
5. Extract missingSkills (skills role requires that candidate does not possess).
6. Give a concise 1-2 sentence reason and categorical recommendation (Strong Match: 85-100, Good Match: 70-84, Possible Match: 50-69, Low Match: 0-49).
7. Determine jobType (Internship/Full-time) and workMode (Remote/Hybrid/On-site).`;

  try {
    const rawBatchResult = await generateStructuredContent({
      prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      responseSchema: BATCH_OPPORTUNITY_MATCH_SCHEMA
    });

    const evaluatedMatches = new Map();
    if (rawBatchResult?.matches && Array.isArray(rawBatchResult.matches)) {
      for (const m of rawBatchResult.matches) {
        if (typeof m.index === 'number') {
          evaluatedMatches.set(m.index, m);
        }
      }
    }

    const results = candidateSlice.map((opp, idx) => {
      const match = evaluatedMatches.get(idx);
      if (match) {
        const normalized = validateAndNormalizeMatch(match);
        return {
          ...opp,
          company: (match.company && match.company !== 'Hiring Organization') ? match.company : opp.company,
          title: match.title || opp.title,
          matchScore: normalized.matchScore,
          matchingSkills: normalized.matchingSkills,
          missingSkills: normalized.missingSkills,
          reason: normalized.reason,
          recommendation: normalized.recommendation,
          jobType: match.jobType || opp.jobType || 'Internship',
          workMode: match.workMode || opp.workMode || 'Hybrid'
        };
      } else {
        const fallback = evaluateMatchHeuristic(candidate, opp);
        return {
          ...opp,
          ...fallback
        };
      }
    });

    results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    return results;
  } catch (err) {
    console.warn('Batch Vertex AI opportunity matching fallback engaged:', err.message);
    const results = candidateSlice.map((opp) => {
      const fallback = evaluateMatchHeuristic(candidate, opp);
      return {
        ...opp,
        ...fallback
      };
    });
    results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    return results;
  }
};

export const matchOpportunityWithVertexAI = async (candidate, opportunity) => {
  if (!opportunity || !opportunity.title) {
    return validateAndNormalizeMatch(null);
  }
  return evaluateMatchHeuristic(candidate, opportunity);
};

export default {
  OPPORTUNITY_MATCH_SCHEMA,
  BATCH_OPPORTUNITY_MATCH_SCHEMA,
  validateAndNormalizeMatch,
  evaluateMatchHeuristic,
  matchOpportunityWithVertexAI,
  rankAndMatchOpportunities
};
