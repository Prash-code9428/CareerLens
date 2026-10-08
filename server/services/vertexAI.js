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
  const modelName = options.model || googleCloudConfig.model || 'gemini-1.5-flash';

  const {
    model: _unusedModel,
    temperature,
    maxOutputTokens,
    responseMimeType,
    responseSchema,
    generationConfig,
    systemInstruction,
    ...restOptions
  } = options;

  return vertexAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: temperature ?? 0.2,
      maxOutputTokens: maxOutputTokens ?? 4096,
      responseMimeType: responseMimeType || 'application/json',
      ...(responseSchema && { responseSchema }),
      ...generationConfig
    },
    ...(systemInstruction && { systemInstruction }),
    ...restOptions
  });
};

/**
 * Executes structured model prompts with Gemini API Key (Direct API) or Vertex AI (ADC)
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

  const activeModel = model || googleCloudConfig.model || 'gemini-1.5-flash';
  const apiKey = googleCloudConfig.apiKey;

  // 1. Direct Google Gemini Developer API (if API Key provided)
  if (apiKey) {
    const candidateModels = [
      activeModel,
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-flash-latest'
    ].filter((v, i, a) => a.indexOf(v) === i);

    let lastError = null;
    for (const m of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
        const payload = {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            ...(responseSchema && { responseSchema })
          },
          ...(systemInstruction && {
            systemInstruction: { parts: [{ text: systemInstruction }] }
          })
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`[GeminiAPI.Error]: got status: ${res.status} - ${errBody}`);
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('Empty text content received from Gemini API');
        }

        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.warn('Gemini API response was not valid JSON, returning raw text payload.');
          return { raw: text };
        }
      } catch (err) {
        lastError = err;
        console.warn(`Gemini model ${m} attempt: ${err.message.substring(0, 120)}`);
      }
    }
    console.error('Gemini API Service Error after all model attempts:', lastError?.message);
    throw new Error(`AI Analysis Service Error: ${lastError?.message}`);
  }

  // 2. Vertex AI (ADC / Cloud Run Service Account)
  try {
    const generativeModel = getGenerativeModel({
      model: activeModel,
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
    console.error('Vertex AI Service Error:', error.message);
    throw new Error(`AI Analysis Service Error: ${error.message}`);
  }
};

/**
 * Non-invasive health/configuration check for Vertex AI & Gemini
 */
export const checkVertexAIHealth = () => {
  const status = validateGoogleCloudConfig();
  return {
    ready: status.isConfigured || Boolean(googleCloudConfig.apiKey),
    hasApiKey: Boolean(googleCloudConfig.apiKey),
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
