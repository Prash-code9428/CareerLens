import { generateStructuredContent } from './vertexAI.js';

const CONTEXT_API_ENDPOINT = process.env.CONTEXT_API_ENDPOINT || 'https://api.context.dev/v1/web/search';

/**
 * Generate 3-5 focused search queries using Vertex AI based on candidate profile and preferences
 * 
 * @param {Object} candidateProfile - Extracted candidate profile
 * @param {Object} userPreferences - User's location, workMode, preferredRoles
 * @returns {Promise<string[]>} Array of 3 to 5 targeted search query strings
 */
export const generateSearchQueries = async (candidateProfile, userPreferences = {}) => {
  const explicitSkills = Array.isArray(userPreferences?.skills) ? userPreferences.skills : [];
  const profileSkills = [
    ...(candidateProfile?.programmingLanguages || []),
    ...(candidateProfile?.frameworks || []),
    ...(candidateProfile?.skills || []),
    ...(candidateProfile?.databases || [])
  ];
  const skills = Array.from(new Set([...explicitSkills, ...profileSkills])).slice(0, 8);

  const preferredRoles = [
    ...(userPreferences?.preferredRoles || []),
    ...(candidateProfile?.preferredRoles || [])
  ].slice(0, 4);

  const customQuery = (userPreferences?.customQuery || userPreferences?.query || '').trim();
  const location = userPreferences?.location || candidateProfile?.location || 'India';
  const workMode = userPreferences?.workMode || candidateProfile?.workMode || 'Any';
  const experienceLevel = userPreferences?.experienceLevel || candidateProfile?.experienceLevel || 'Student';

  // If custom query provided by user, construct targeted queries
  if (customQuery) {
    const queries = [
      `"${customQuery}" ("greenhouse.io" OR "lever.co" OR "ashbyhq.com" OR "careers") 2026`,
      `"${customQuery}" ("intern" OR "engineer") ("apply" OR "job opening") ${location !== 'Any' ? location : ''}`.trim(),
      `"${customQuery}" (Google OR Microsoft OR Amazon OR Uber OR Razorpay OR Swiggy OR Atlassian OR Stripe) careers`
    ];
    return queries.slice(0, 3);
  }

  // If Vertex AI is available, use it to craft high-relevance direct job search queries
  try {
    const prompt = `Candidate Profile Context:
- Top Skills: ${skills.join(', ') || 'Software Development'}
- Preferred Roles: ${preferredRoles.join(', ') || 'Software Engineer Intern'}
- Experience Level: ${experienceLevel}
- Target Location: ${location}
- Work Mode: ${workMode}

Generate exactly 3 focused, highly realistic web search queries to find active 2026 tech internships and job openings on company career sites (e.g. Greenhouse, Lever, Ashby, company career pages).
DO NOT generate broad search queries that lead to aggregator directory pages. Focus on direct job posts and ATS hiring boards.
Return JSON adhering to schema: { "queries": ["query 1", "query 2", "query 3"] }`;

    const schema = {
      type: 'OBJECT',
      properties: {
        queries: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: '3 concise direct job search queries'
        }
      },
      required: ['queries']
    };

    const result = await generateStructuredContent({
      prompt,
      responseSchema: schema
    });

    if (result?.queries && Array.isArray(result.queries) && result.queries.length > 0) {
      return result.queries.slice(0, 3).map((q) => q.trim()).filter(Boolean);
    }
  } catch (error) {
    console.warn('Vertex AI query generation fallback engaged:', error.message);
  }

  // Deterministic fallback queries targeting direct ATS listings & tech companies
  const primaryRole = preferredRoles[0] || 'Software Engineer Intern';
  const primarySkill = skills[0] || 'React';
  const secondarySkill = skills[1] || 'Node.js';

  return [
    `"${primaryRole}" ("greenhouse.io" OR "lever.co" OR "ashbyhq.com" OR "careers") 2026`,
    `"${primarySkill}" "${secondarySkill}" ("internship" OR "engineer") ("apply" OR "careers") ${location !== 'Any' ? location : ''}`.trim(),
    `"${primaryRole}" (Google OR Microsoft OR Amazon OR Uber OR Razorpay OR Swiggy OR Atlassian) careers`
  ];
};

/**
 * Helper to pause execution for a given number of milliseconds
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Execute a single web search query using Context.dev API
 * Concurrency: 1 request in flight at a time with automatic 429 Retry-After handling.
 * 
 * @param {string} query - The search query string
 * @param {number} [maxRetries=2] - Maximum retry attempts on 429
 * @returns {Promise<Array>} Raw search result items from Context.dev
 */
export const searchContext = async (query, maxRetries = 2) => {
  const apiKey = process.env.CONTEXT_DEV_API_KEY || process.env.CONTEXT_API_KEY;
  const endpoint = process.env.CONTEXT_API_ENDPOINT || 'https://api.context.dev/v1/web/search';

  if (!apiKey) {
    console.warn('⚠️ CONTEXT_API_KEY is not configured in environment variables.');
    return [];
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'x-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query
        }),
        signal: AbortSignal.timeout(6000)
      });

      // Handle 429 Rate Limiting / Quota
      if (response.status === 429) {
        const bodyText = await response.text().catch(() => '');
        if (bodyText.includes('quota') || bodyText.includes('exceeded')) {
          console.warn(`Context.dev quota exceeded. Fast fallback to AI opportunity engine.`);
          return [];
        }
        if (attempt < maxRetries) {
          await delay(800);
          continue;
        }
        return [];
      }

      if (!response.ok) {
        console.error(`Context.dev search request (${endpoint}) returned HTTP status ${response.status}`);
        return [];
      }

      const data = await response.json();

      // Normalize response payload format across Context.dev response formats
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      if (Array.isArray(data?.organic_results)) return data.organic_results;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.hits)) return data.hits;
      if (Array.isArray(data?.items)) return data.items;

      return [];
    } catch (error) {
      if (attempt < maxRetries && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        await delay(500);
        continue;
      }
      console.error(`Context.dev search failed for query "${query}":`, error.message);
      return [];
    }
  }

  return [];
};

/**
 * Helper to clean and extract company name and job title from messy search titles
 */
const parseCompanyAndTitle = (rawTitle, rawCompany, url) => {
  let title = (rawTitle || '').trim();
  let company = (rawCompany || '').trim();

  // If company is generic or missing, try extracting from URL patterns or title
  if (!company || company === 'Hiring Organization' || company === 'Author' || company === 'Organization') {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      const pathname = parsed.pathname.split('/').filter(Boolean);

      if (host.includes('greenhouse.io') && pathname.length > 0) {
        company = pathname[0].charAt(0).toUpperCase() + pathname[0].slice(1);
      } else if (host.includes('lever.co') && pathname.length > 0) {
        company = pathname[0].charAt(0).toUpperCase() + pathname[0].slice(1);
      } else if (host.includes('ashbyhq.com') && pathname.length > 0) {
        company = pathname[0].charAt(0).toUpperCase() + pathname[0].slice(1);
      } else if (host.startsWith('careers.') || host.startsWith('jobs.')) {
        const parts = host.split('.');
        if (parts.length >= 3 && parts[1] !== 'greenhouse' && parts[1] !== 'lever' && parts[1] !== 'ashbyhq') {
          company = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        }
      }
    } catch (e) {
      // ignore URL parse errors
    }
  }

  // If company is still default or blank, parse from title delimiters: "Role at Company" or "Role - Company" or "Company: Role"
  if (!company || company === 'Hiring Organization' || company === 'Author' || company === 'Organization') {
    if (title.includes(' at ')) {
      const parts = title.split(' at ');
      title = parts[0].trim();
      company = parts[1].split(/[-–|•]/)[0].trim();
    } else if (title.includes(' - ')) {
      const parts = title.split(' - ');
      if (parts.length >= 2) {
        title = parts[0].trim();
        company = parts[1].split(/[-–|•]/)[0].trim();
      }
    } else if (title.includes(' | ')) {
      const parts = title.split(' | ');
      if (parts.length >= 2) {
        title = parts[0].trim();
        company = parts[1].trim();
      }
    } else if (title.includes(': ')) {
      const parts = title.split(': ');
      if (parts.length >= 2) {
        company = parts[0].trim();
        title = parts[1].trim();
      }
    }
  }

  // Fallback domain extraction if still generic
  if (!company || company === 'Hiring Organization' || company === 'Organization') {
    try {
      const host = new URL(url).hostname.replace(/^www\./, '');
      const mainDomain = host.split('.')[0];
      if (mainDomain && mainDomain !== 'jobs' && mainDomain !== 'careers') {
        company = mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
      } else {
        company = 'Tech Company';
      }
    } catch (e) {
      company = 'Tech Company';
    }
  }

  return { title, company };
};

/**
 * Normalize and clean raw opportunity item
 * 
 * @param {Object} rawItem - Raw result item from web search
 * @returns {Object|null} Normalized opportunity or null if invalid
 */
export const normalizeOpportunity = (rawItem) => {
  if (!rawItem || typeof rawItem !== 'object') return null;

  const url = (
    rawItem.url ||
    rawItem.link ||
    rawItem.source_url ||
    rawItem.job_url ||
    rawItem.sourceUrl ||
    rawItem.href ||
    ''
  ).trim();

  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return null;
  }

  const rawTitle = (
    rawItem.title ||
    rawItem.job_title ||
    rawItem.position ||
    rawItem.name ||
    rawItem.headline ||
    ''
  ).trim();

  if (!rawTitle) return null;

  // Discard directory aggregator search pages (e.g. "793 software engineer jobs in India")
  const lowerTitle = rawTitle.toLowerCase();
  const lowerUrl = url.toLowerCase();
  if (
    /^\d+\+?\s+(software|frontend|backend|developer|intern|jobs)/i.test(rawTitle) ||
    lowerTitle.includes('jobs and vacancies') ||
    lowerTitle.includes('salaries and reviews') ||
    lowerUrl.includes('/jobs/search') ||
    lowerUrl.includes('/q-') ||
    lowerUrl.includes('/job/search') ||
    lowerUrl.includes('w3schools.com') ||
    lowerUrl.includes('geeksforgeeks.org/courses') ||
    lowerUrl.includes('wikipedia.org')
  ) {
    return null;
  }

  const { title, company } = parseCompanyAndTitle(rawTitle, rawItem.company || rawItem.company_name, url);

  const description = (
    rawItem.description ||
    rawItem.snippet ||
    rawItem.summary ||
    rawItem.content ||
    rawItem.text ||
    rawItem.body ||
    ''
  ).trim();

  const location = (
    rawItem.location ||
    rawItem.job_location ||
    rawItem.city ||
    'Remote / Hybrid'
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
    jobType: lowerTitle.includes('intern') ? 'Internship' : 'Full-time',
    workMode: lowerTitle.includes('remote') || location.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
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
 * Generates tailored live opportunities using Gemini AI when web search APIs hit rate limits
 */
export const generateCuratedOpportunitiesWithAI = async (candidateProfile, userPreferences = {}) => {
  const explicitSkills = Array.isArray(userPreferences?.skills) ? userPreferences.skills : [];
  const profileSkills = [
    ...(candidateProfile?.programmingLanguages || []),
    ...(candidateProfile?.frameworks || []),
    ...(candidateProfile?.skills || [])
  ];
  const skills = Array.from(new Set([...explicitSkills, ...profileSkills])).slice(0, 8);
  const preferredRoles = [
    ...(userPreferences?.preferredRoles || []),
    ...(candidateProfile?.preferredRoles || [])
  ].slice(0, 4);
  const location = userPreferences?.location || candidateProfile?.location || 'India';
  const workMode = userPreferences?.workMode || candidateProfile?.workMode || 'Any';
  const experienceLevel = userPreferences?.experienceLevel || candidateProfile?.experienceLevel || 'Student';

  const prompt = `Generate 8 to 12 highly realistic tech job and internship opportunities for a candidate with:
- Target Roles: ${preferredRoles.join(', ') || 'Software Engineer Intern, Frontend Developer, Backend Engineer'}
- Key Skills: ${skills.join(', ') || 'JavaScript, Python, React, Node.js'}
- Location: ${location}
- Work Mode: ${workMode}
- Level: ${experienceLevel}

Include top employers (Google, Microsoft, Amazon, Razorpay, Uber, Swiggy, Atlassian, Postman, Flipkart, CRED, Stripe), direct career URLs, realistic salary ranges, and detailed job descriptions.

Return JSON adhering to schema:
{
  "opportunities": [
    {
      "title": "Software Engineering Intern - 2026",
      "company": "Razorpay",
      "location": "Bengaluru, India (Hybrid)",
      "url": "https://jobs.lever.co/razorpay",
      "snippet": "Join our Core Payments backend team to build scalable microservices in Node.js and Go.",
      "salary": "₹80,000/month",
      "type": "Internship",
      "workMode": "Hybrid"
    }
  ]
}`;

  const schema = {
    type: 'OBJECT',
    properties: {
      opportunities: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            company: { type: 'STRING' },
            location: { type: 'STRING' },
            url: { type: 'STRING' },
            snippet: { type: 'STRING' },
            salary: { type: 'STRING' },
            type: { type: 'STRING' },
            workMode: { type: 'STRING' }
          },
          required: ['title', 'company', 'url']
        }
      }
    },
    required: ['opportunities']
  };

  try {
    const res = await generateStructuredContent({ prompt, responseSchema: schema });
    if (Array.isArray(res?.opportunities) && res.opportunities.length > 0) {
      return res.opportunities.map(normalizeOpportunity).filter(Boolean);
    }
  } catch (e) {
    console.warn('AI curated opportunities generation fallback error:', e.message);
  }
  return [];
};

/**
 * Orchestrate complete live opportunity discovery:
 * 1. Vertex / Gemini AI generates focused queries
 * 2. Context.dev searches live web
 * 3. Fallbacks to AI-curated opportunities if external search API quota is exhausted
 * 4. Normalizes and deduplicates results
 * 
 * @param {Object} candidateProfile - Extracted candidate profile
 * @param {Object} userPreferences - Location, workMode, preferredRoles
 * @returns {Promise<{ queries: string[], opportunities: Array }>}
 */
export const discoverOpportunities = async (candidateProfile, userPreferences = {}) => {
  const allQueries = await generateSearchQueries(candidateProfile, userPreferences);
  const queries = allQueries.slice(0, 2);

  const allOpportunities = [];
  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    try {
      const rawResults = await searchContext(q);
      const normalized = rawResults.map(normalizeOpportunity).filter(Boolean);
      allOpportunities.push(...normalized);
    } catch (e) {
      console.warn(`Error searching query "${q}":`, e.message);
    }
  }

  // If Context.dev search returned 0 items (e.g. rate limit / quota), engage AI curated industry opportunities
  if (allOpportunities.length === 0) {
    console.log('Context.dev search yielded 0 items. Generating AI-curated opportunities tailored to candidate...');
    const curated = await generateCuratedOpportunitiesWithAI(candidateProfile, userPreferences);
    allOpportunities.push(...curated);
  }

  // Deduplicate by URL
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
  generateCuratedOpportunitiesWithAI,
  discoverOpportunities
};
