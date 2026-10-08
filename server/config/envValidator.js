/**
 * Backend Environment Variable Validation & Audit Utility
 * 
 * Validates environment variable presence for core server operations
 * and external service integrations (MongoDB, JWT, Supabase, Context.dev, Vertex AI).
 * 
 * SECURITY RULES:
 * - NEVER log or expose secret values.
 * - Only log missing variable NAMES.
 * - Non-fatal warnings for external integrations to allow partial local development.
 */

export const validateEnvironment = () => {
  const missingCore = [];
  const missingSupabase = [];
  const missingContext = [];
  const missingVertexAI = [];

  // 1. Core Server & Database Requirements
  if (!process.env.MONGODB_URI) missingCore.push('MONGODB_URI');
  if (!process.env.JWT_SECRET) missingCore.push('JWT_SECRET');

  // 2. Supabase Storage Requirements
  if (!process.env.SUPABASE_URL) missingSupabase.push('SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missingSupabase.push('SUPABASE_SERVICE_ROLE_KEY');

  // 3. Context.dev Live Search Requirements
  if (!process.env.CONTEXT_API_KEY) missingContext.push('CONTEXT_API_KEY');

  // 4. Google Cloud / Vertex AI Requirements
  if (!process.env.GOOGLE_CLOUD_PROJECT_ID) missingVertexAI.push('GOOGLE_CLOUD_PROJECT_ID');

  const report = {
    isCoreReady: missingCore.length === 0,
    isSupabaseReady: missingSupabase.length === 0,
    isContextReady: missingContext.length === 0,
    isVertexAIReady: missingVertexAI.length === 0,
    missing: {
      core: missingCore,
      supabase: missingSupabase,
      context: missingContext,
      vertexAI: missingVertexAI
    }
  };

  if (!report.isCoreReady) {
    console.warn(`⚠️ Warning: Missing core environment variable(s): ${missingCore.join(', ')}`);
  }

  if (!report.isSupabaseReady) {
    console.info(`ℹ️ Supabase Storage: Missing environment variable(s): ${missingSupabase.join(', ')}`);
  }

  if (!report.isContextReady) {
    console.info(`ℹ️ Context.dev Web Search: Missing environment variable(s): ${missingContext.join(', ')}`);
  }

  if (!report.isVertexAIReady) {
    console.info(`ℹ️ Vertex AI Intelligence: Missing environment variable(s): ${missingVertexAI.join(', ')}`);
  }

  return report;
};

export default validateEnvironment;
