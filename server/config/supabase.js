import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load environment variables from server root and project workspace root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'resumes';

let supabaseInstance = null;

/**
 * Validates Supabase configuration
 */
export const validateSupabaseConfig = () => {
  const missing = [];
  if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');

  return {
    isConfigured: missing.length === 0,
    missing,
    bucket: process.env.SUPABASE_BUCKET || 'resumes'
  };
};

/**
 * Initializes and returns server-side Supabase client using Service Role Key
 * NEVER expose this client or key to the frontend
 */
export const getSupabaseClient = () => {
  const { isConfigured, missing } = validateSupabaseConfig();

  if (!isConfigured) {
    throw new Error(
      `Supabase storage error: Missing required environment variable(s): ${missing.join(', ')}`
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return supabaseInstance;
};

export default {
  getSupabaseClient,
  validateSupabaseConfig,
  SUPABASE_BUCKET
};
