import { generateStructuredContent } from './vertexAI.js';

const CONTEXT_API_ENDPOINT = process.env.CONTEXT_API_ENDPOINT || 'https://api.context.dev/v1/search';

/**
 * Generate 3-5 focused search queries using Vertex AI based on candidate profile and preferences
 * 
 * @param {Object} candidateProfile - Extracted candidate profile
 * @param {Object} userPreferences - User's location, workMode, preferredRoles
 * @returns {Promise<string[]>} Array of 3 to 5 targeted search query strings
 */
export const generateSearchQueries = async (candidateProfile, userPreferences = {}) => {
  const skills = [
    ...(candidateProfile?.programmingLanguages || []),
    ...(candidateProfile?.frameworks || []),
    ...(candidateProfile?.skills || [])
  ].slice(0, 8);

  const preferredRoles = [
    ...(userPreferences?.preferredRoles || []),
    ...(candidateProfile?.preferredRoles || [])
  ].slice(0, 4);

  const location = userPreferences?.location || candidateProfile?.location || 'India';
  const workMode = userPreferences?.workMode || candidateProfile?.workMode || 'Any';
  const experienceLevel = userPreferences?.experienceLevel || candidateProfile?.experienceLevel || 'Student';

  // If Vertex AI is available, use it to craft high-relevance live search queries
  try {
    const prompt = `Candidate Profile Context:
- Top Skills: ${skills.join(', ') || 'Software Development'}
- Preferred Roles: ${preferredRoles.join(', ') || 'Software Engineer Intern'}
- Experience Level: ${experienceLevel}
- Target Location: ${location}
- Work Mode: ${workMode}

Generate exactly 3 to 5 focused, highly realistic web search queries to find active 2026 internships and entry-level job postings on company career sites and tech job boards.
Return JSON adhering to schema: { "queries": ["query 1", "query 2", "query 3"] }`;

    const schema = {
      type: 'OBJECT',
      properties: {
        queries: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: '3 to 5 concise search queries for hiring portals'
        }
      },
      required: ['queries']
    };

    const result = await generateStructuredContent({
      prompt,
      responseSchema: schema
    });

    if (result?.queries && Array.isArray(result.queries) && result.queries.length > 0) {
      return result.queries.slice(0, 5).map((q) => q.trim()).filter(Boolean);
    }
  } catch (error) {
    console.warn('Vertex AI query generation fallback engaged:', error.message);
  }

  // Deterministic fallback queries if AI query generation is unavailable
  const fallbackQueries = [];
  const primaryRole = preferredRoles[0] || 'Software Engineer Intern';
  const primarySkill = skills[0] || 'React';
  const secondarySkill = skills[1] || 'Node.js';

  fallbackQueries.push(`${primaryRole} ${location} 2026`);
  fallbackQueries.push(`${primarySkill} ${secondarySkill} internship ${workMode !== 'Any' ? workMode : ''}`.trim());
  fallbackQueries.push(`${primaryRole} ${experienceLevel.toLowerCase()} hiring`);

  if (preferredRoles[1]) {
    fallbackQueries.push(`${preferredRoles[1]} ${location} job opening`);
  }

  return fallbackQueries.slice(0, 5);
};

/**
 * Execute a single web search query using Context.dev API
 * 
 * @param {string} query - The search query string
 * @returns {Promise<Array>} Raw search result items from Context.dev
 */
export const searchContext = async (query) => {
  const apiKey = process.env.CONTEXT_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ CONTEXT_API_KEY is not configured in environment variables.');
    return [];
  }

  try {
    const response = await fetch(CONTEXT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        limit: 10
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!response.ok) {
      console.error(`Context.dev search request returned HTTP status ${response.status}`);
      return [];
    }

    const data = await response.json();

    // Normalize response payload format across Context.dev response formats
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.hits)) return data.hits;

    return [];
  } catch (error) {
    console.error(`Context.dev search failed for query "${query}":`, error.message);
    return [];
  }
};

/**
 * Normalize and clean raw opportunity item
 * 
 * @param {Object} rawItem - Raw result item from web search
 * @returns {Object|null} Normalized opportunity or null if invalid
 */
export const normalizeOpportunity = (rawItem) => {
  if (!rawItem || typeof rawItem !== 'object') return null;

  const url = (rawItem.url || rawItem.link || rawItem.source_url || rawItem.job_url || '').trim();
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return null;
  }

  const title = (rawItem.title || rawItem.job_title || rawItem.position || rawItem.name || '').trim();
  if (!title) return null;

  const company = (
    rawItem.company ||
    rawItem.company_name ||
    rawItem.organization ||
    rawItem.employer ||
    'Company'
  ).trim();

  const description = (
    rawItem.description ||
    rawItem.snippet ||
    rawItem.summary ||
    rawItem.content ||
    ''
  ).trim();

  const location = (
    rawItem.location ||
    rawItem.job_location ||
    rawItem.city ||
    'Remote / Multiple Locations'
  ).trim();

  // Extract source domain name
  let source = 'Web';
  try {
    const parsedUrl = new URL(url);
    source = parsedUrl.hostname.replace(/^www\./, '');
  } catch (e) {
    source = rawItem.source || 'Context.dev';
  }

  return {
    title,
    company,
    url,
    description: description || null,
    location: location || null,
    source
  };
};

/**
 * Deduplicate opportunity items by normalized URL
 * 
 * @param {Array} opportunities - Array of normalized opportunities
 * @returns {Array} Unique opportunities list
 */
export const deduplicateOpportunities = (opportunities) => {
  if (!Array.isArray(opportunities)) return [];

  const seenUrls = new Set();
  const uniqueList = [];

  for (const opp of opportunities) {
    if (!opp || !opp.url) continue;

    // Normalize URL for deduplication (strip trailing slashes & tracking params)
    let cleanUrl = opp.url.trim().toLowerCase();
    try {
      const u = new URL(opp.url);
      cleanUrl = `${u.origin}${u.pathname}`.replace(/\/+$/, '');
    } catch (e) {
      cleanUrl = opp.url.trim().toLowerCase().replace(/\/+$/, '');
    }

    if (!seenUrls.has(cleanUrl)) {
      seenUrls.add(cleanUrl);
      uniqueList.push(opp);
    }
  }

  return uniqueList;
};

/**
 * Orchestrate complete live opportunity discovery:
 * 1. Vertex AI generates 3-5 queries
 * 2. Context.dev searches live web
 * 3. Normalizes and deduplicates results
 * 
 * @param {Object} candidateProfile - Extracted candidate profile
 * @param {Object} userPreferences - Location, workMode, preferredRoles
 * @returns {Promise<{ queries: string[], opportunities: Array }>}
 */
export const discoverOpportunities = async (candidateProfile, userPreferences = {}) => {
  // Step 1: Generate focused queries
  const queries = await generateSearchQueries(candidateProfile, userPreferences);

  // Step 2: Search Context.dev for each query in parallel
  const searchPromises = queries.map(async (q) => {
    try {
      const rawResults = await searchContext(q);
      return rawResults.map(normalizeOpportunity).filter(Boolean);
    } catch (e) {
      return [];
    }
  });

  const settledResults = await Promise.allSettled(searchPromises);

  const allOpportunities = settledResults
    .filter((res) => res.status === 'fulfilled')
    .flatMap((res) => res.value);

  // Step 3: Deduplicate by URL
  const uniqueOpportunities = deduplicateOpportunities(allOpportunities);

  return {
    queries,
    count: uniqueOpportunities.length,
    opportunities: uniqueOpportunities
  };
};

export default {
  generateSearchQueries,
  searchContext,
  normalizeOpportunity,
  deduplicateOpportunities,
  discoverOpportunities
};
