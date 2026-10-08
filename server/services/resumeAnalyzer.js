import { generateStructuredContent } from './vertexAI.js';

/**
 * OpenAPI / JSON Schema definition for Vertex AI candidate profile extraction
 */
export const CANDIDATE_PROFILE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: {
      type: 'STRING',
      description: 'A 2-3 sentence executive professional summary of the candidate based strictly on resume facts.'
    },
    skills: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'All technical and domain skills mentioned in the resume.'
    },
    programmingLanguages: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Programming and scripting languages (e.g. JavaScript, Python, Java, C++, TypeScript, SQL).'
    },
    frameworks: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Frameworks and libraries (e.g. React, Node.js, Express, Tailwind CSS, Django, Spring Boot).'
    },
    databases: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Databases and storage systems (e.g. MongoDB, PostgreSQL, MySQL, Redis, Supabase).'
    },
    tools: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Developer tools, cloud platforms, and DevOps utilities (e.g. Git, Docker, GCP, AWS, Postman, Linux).'
    },
    projects: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          description: { type: 'STRING' },
          technologies: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          }
        },
        required: ['name', 'description']
      },
      description: 'Academic and personal software engineering projects extracted from the resume.'
    },
    experience: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          role: { type: 'STRING' },
          company: { type: 'STRING' },
          duration: { type: 'STRING' },
          description: { type: 'STRING' }
        },
        required: ['role', 'company']
      },
      description: 'Internships, employment, or teaching assistant positions.'
    },
    education: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          institution: { type: 'STRING' },
          degree: { type: 'STRING' },
          major: { type: 'STRING' },
          graduationYear: { type: 'STRING' }
        },
        required: ['institution', 'degree']
      },
      description: 'Degrees, universities, and academic institutions.'
    },
    certifications: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Verified professional certifications and course completions.'
    },
    preferredRoles: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Conservative target roles that closely match candidate demonstrated skills (e.g. Software Engineer Intern, Frontend Developer, Backend Developer).'
    },
    experienceLevel: {
      type: 'STRING',
      enum: ['Student', 'Fresher', '0–1 years', '1–3 years'],
      description: 'Classified candidate experience level based strictly on resume timeline.'
    }
  },
  required: [
    'summary',
    'skills',
    'programmingLanguages',
    'frameworks',
    'databases',
    'tools',
    'projects',
    'experience',
    'education',
    'certifications',
    'preferredRoles',
    'experienceLevel'
  ]
};

const SYSTEM_INSTRUCTION = `You are the CareerLens Resume Intelligence Engine.
Your role is to analyze a student's resume and extract a high-fidelity, structured candidate profile.

CRITICAL EXTRACTION RULES:
1. ONLY extract information that is explicitly stated in or directly inferred from the resume text.
2. Do NOT hallucinate, invent, or extrapolate projects, skills, or employment history.
3. Categorize technical skills accurately into: programmingLanguages, frameworks, databases, and tools.
4. For projects, extract the project title, a concise factual description, and the tech stack used.
5. Classify the candidate's experienceLevel into one of: 'Student', 'Fresher', '0–1 years', or '1–3 years'.
6. Recommend 2 to 5 conservative preferredRoles based strictly on demonstrated project and internship skills.
7. Return ONLY clean JSON adhering to the specified schema. Do not include markdown codeblocks or commentary.`;

/**
 * Validates and normalizes raw AI candidate profile output
 * @param {Object} rawProfile - Raw JSON object from Vertex AI
 * @returns {Object} Cleaned, validated candidate profile
 */
export const normalizeCandidateProfile = (rawProfile) => {
  if (!rawProfile || typeof rawProfile !== 'object') {
    throw new Error('Invalid candidate profile structure returned from model.');
  }

  const toStringArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return Array.from(
      new Set(
        arr
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter((item) => item.length > 0)
      )
    );
  };

  const cleanProjects = (projects) => {
    if (!Array.isArray(projects)) return [];
    return projects
      .filter((p) => p && (p.name || p.title))
      .map((p) => ({
        name: (p.name || p.title || 'Untitled Project').trim(),
        description: (p.description || '').trim(),
        technologies: toStringArray(p.technologies || p.techStack || [])
      }));
  };

  const cleanExperience = (exp) => {
    if (!Array.isArray(exp)) return [];
    return exp
      .filter((e) => e && (e.role || e.company))
      .map((e) => ({
        role: (e.role || 'Contributor').trim(),
        company: (e.company || 'Organization').trim(),
        duration: (e.duration || '').trim(),
        description: (e.description || '').trim()
      }));
  };

  const cleanEducation = (edu) => {
    if (!Array.isArray(edu)) return [];
    return edu
      .filter((e) => e && (e.institution || e.university || e.degree))
      .map((e) => ({
        institution: (e.institution || e.university || '').trim(),
        degree: (e.degree || '').trim(),
        major: (e.major || e.field || '').trim(),
        graduationYear: (e.graduationYear || e.year || '').toString().trim()
      }));
  };

  const validExperienceLevels = ['Student', 'Fresher', '0–1 years', '1–3 years'];
  let experienceLevel = rawProfile.experienceLevel?.trim() || 'Student';
  if (!validExperienceLevels.includes(experienceLevel)) {
    experienceLevel = 'Student';
  }

  return {
    summary: (rawProfile.summary || '').trim(),
    skills: toStringArray(rawProfile.skills),
    programmingLanguages: toStringArray(rawProfile.programmingLanguages),
    frameworks: toStringArray(rawProfile.frameworks),
    databases: toStringArray(rawProfile.databases),
    tools: toStringArray(rawProfile.tools),
    projects: cleanProjects(rawProfile.projects),
    experience: cleanExperience(rawProfile.experience),
    education: cleanEducation(rawProfile.education),
    certifications: toStringArray(rawProfile.certifications),
    preferredRoles: toStringArray(rawProfile.preferredRoles),
    experienceLevel,
    analyzedAt: new Date().toISOString()
  };
};

/**
 * Execute resume analysis using Google Cloud Vertex AI
 * 
 * @param {string} resumeText - Extracted resume text content
 * @returns {Promise<Object>} Normalized candidate profile
 */
export const analyzeResumeWithVertexAI = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 20) {
    throw new Error('Resume text is insufficient for AI analysis.');
  }

  const prompt = `Here is the candidate's resume text:

--- RESUME CONTENT BEGIN ---
${resumeText}
--- RESUME CONTENT END ---

Extract the complete structured candidate profile according to the provided schema.`;

  const rawResult = await generateStructuredContent({
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION,
    responseSchema: CANDIDATE_PROFILE_SCHEMA
  });

  return normalizeCandidateProfile(rawResult);
};

export default {
  analyzeResumeWithVertexAI,
  normalizeCandidateProfile,
  CANDIDATE_PROFILE_SCHEMA
};
