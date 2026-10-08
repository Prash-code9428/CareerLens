import { VertexAI } from '@google-cloud/vertexai';
import { googleCloudConfig, validateGoogleCloudConfig } from '../config/googleCloud.js';

let vertexAIInstance = null;

/**
 * Get or initialize singleton VertexAI client
 * Relies exclusively on Application Default Credentials (ADC)
 */
export const getVertexAIClient = () => {
  const { isConfigured, missing } = validateGoogleCloudConfig();

  if (!isConfigured) {
    throw new Error(
      `Vertex AI configuration error: Missing required environment variable(s): ${missing.join(', ')}`
    );
  }

  if (!vertexAIInstance) {
    try {
      vertexAIInstance = new VertexAI({
        project: googleCloudConfig.projectId,
        location: googleCloudConfig.location
      });
    } catch (error) {
      console.error('Failed to initialize Google Cloud Vertex AI client:', error.message);
      throw new Error(`Vertex AI Initialization Failed: ${error.message}`);
    }
  }

  return vertexAIInstance;
};

/**
 * Get a configured generative model instance
 * @param {Object} options - Optional overrides for model name or generationConfig
 */
export const getGenerativeModel = (options = {}) => {
  const vertexAI = getVertexAIClient();
  const modelName = options.model || googleCloudConfig.model;

  return vertexAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: options.temperature ?? 0.2,
      maxOutputTokens: options.maxOutputTokens ?? 4096,
      responseMimeType: options.responseMimeType || 'application/json',
      ...(options.responseSchema && { responseSchema: options.responseSchema }),
      ...options.generationConfig
    },
    ...(options.systemInstruction && { systemInstruction: options.systemInstruction }),
    ...options
  });
};

/**
 * Clean abstraction function for executing future structured model prompts
 * (Handles error formatting, token sanitization, and structured JSON parsing)
 * 
 * @param {Object} params
 * @param {string} params.prompt - Prompt instruction
 * @param {string} [params.systemInstruction] - System guidance
 * @param {Object} [params.responseSchema] - Optional OpenAPI/JSON schema for response
 * @param {string} [params.model] - Optional model override
 * @returns {Promise<Object>} Parsed structured JSON result
 */
export const generateStructuredContent = async ({
  prompt,
  systemInstruction,
  responseSchema,
  model
}) => {
  if (!prompt) {
    throw new Error('Prompt is required for Vertex AI generation');
  }

  try {
    const generativeModel = getGenerativeModel({
      model,
      systemInstruction,
      responseSchema,
      responseMimeType: 'application/json'
    });

    const response = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const candidate = response.response?.candidates?.[0];
    if (!candidate) {
      throw new Error('No candidate response returned from Vertex AI');
    }

    const text = candidate.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Empty text content received from Vertex AI');
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.warn('Vertex AI response was not valid JSON, returning raw text payload.');
      return { raw: text };
    }
  } catch (error) {
    // Sanitize error reporting: never log raw resume content or authorization credentials
    console.error('Vertex AI Service Error:', error.message);
    throw new Error(`AI Analysis Service Error: ${error.message}`);
  }
};

/**
 * Non-invasive health/configuration check for Vertex AI
 */
export const checkVertexAIHealth = () => {
  const status = validateGoogleCloudConfig();
  return {
    ready: status.isConfigured,
    projectId: status.config.projectId,
    location: status.config.location,
    model: status.config.model,
    missing: status.missing
  };
};

export default {
  getVertexAIClient,
  getGenerativeModel,
  generateStructuredContent,
  checkVertexAIHealth
};
