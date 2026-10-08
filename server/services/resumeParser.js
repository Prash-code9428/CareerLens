import { createRequire } from 'module';
import { getSupabaseClient, SUPABASE_BUCKET } from '../config/supabase.js';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

/**
 * Clean and normalize extracted PDF text
 * @param {string} rawText - Raw text extracted from PDF
 * @returns {string} Cleaned and normalized text
 */
export const cleanExtractedText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  return rawText
    // Remove page markers like "-- 1 of 2 --"
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
    // Replace null bytes or non-printable ASCII (excluding standard whitespace)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Clean each line
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    // Collapse 3+ consecutive newlines to 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Extract selectable text from a PDF Buffer
 * 
 * @param {Buffer} pdfBuffer - In-memory PDF buffer
 * @returns {Promise<{ text: string, numPages: number, charCount: number }>}
 */
export const extractTextFromBuffer = async (pdfBuffer) => {
  if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    throw new Error('Invalid or empty PDF buffer provided for extraction.');
  }

  // Basic PDF header verification
  const header = pdfBuffer.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF-')) {
    const error = new Error('File does not appear to be a valid PDF document header.');
    error.code = 'INVALID_PDF_HEADER';
    throw error;
  }

  let parseResult;
  try {
    const parser = new PDFParse({ data: pdfBuffer });
    parseResult = await parser.getText();
  } catch (error) {
    const parseError = new Error(
      `Failed to parse PDF document. The file may be corrupted or password-protected: ${error.message}`
    );
    parseError.code = 'PDF_PARSE_FAILED';
    throw parseError;
  }

  const rawText = parseResult?.text || '';
  const cleanedText = cleanExtractedText(rawText);

  // Check for image-only or empty scanned PDFs
  if (!cleanedText || cleanedText.length < 20) {
    const emptyError = new Error(
      'No readable text could be extracted from this PDF. It appears to be an image-only or scanned document without selectable text. Please upload a text-based PDF.'
    );
    emptyError.code = 'NO_TEXT_FOUND';
    emptyError.numPages = parseResult?.total || 1;
    throw emptyError;
  }

  return {
    text: cleanedText,
    numPages: parseResult?.total || 1,
    charCount: cleanedText.length
  };
};

/**
 * Download authenticated user's resume PDF buffer from Supabase Storage
 * 
 * @param {string} resumePath - Stored path (e.g. "resumes/userId/resume.pdf")
 * @returns {Promise<Buffer>} PDF file buffer
 */
export const downloadResumeBuffer = async (resumePath) => {
  if (!resumePath) {
    throw new Error('No resume path specified for download.');
  }

  let relativePath = resumePath;
  if (relativePath.startsWith(`${SUPABASE_BUCKET}/`)) {
    relativePath = relativePath.replace(`${SUPABASE_BUCKET}/`, '');
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .download(relativePath);

  if (error || !data) {
    const downloadError = new Error(
      `Failed to retrieve resume from storage: ${error?.message || 'File not found'}`
    );
    downloadError.code = 'STORAGE_RETRIEVAL_FAILED';
    throw downloadError;
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export default {
  extractTextFromBuffer,
  cleanExtractedText,
  downloadResumeBuffer
};
