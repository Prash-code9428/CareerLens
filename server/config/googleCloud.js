import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Google Cloud Vertex AI Configuration
 * 
 * Uses Application Default Credentials (ADC):
 * - Local development: gcloud auth application-default login
 * - Cloud Run production: Attached Service Account / Workload Identity
 */
export const googleCloudConfig = {
  get projectId() {
    return process.env.GOOGLE_CLOUD_PROJECT_ID || '';
  },
  get location() {
    return process.env.VERTEX_AI_LOCATION || 'us-central1';
  },
  get model() {
    return process.env.VERTEX_AI_MODEL || 'gemini-1.5-pro';
  }
};

/**
 * Verify if Google Cloud environment variables are configured
 * @returns {{ isConfigured: boolean, missing: string[] }}
 */
export const validateGoogleCloudConfig = () => {
  const missing = [];

  if (!googleCloudConfig.projectId) {
    missing.push('GOOGLE_CLOUD_PROJECT_ID');
  }

  return {
    isConfigured: missing.length === 0,
    missing,
    config: {
      projectId: googleCloudConfig.projectId ? `${googleCloudConfig.projectId.substring(0, 4)}***` : '(not set)',
      location: googleCloudConfig.location,
      model: googleCloudConfig.model
    }
  };
};

export default googleCloudConfig;
