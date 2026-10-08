import User from '../models/User.js';
import { getSupabaseClient, validateSupabaseConfig, SUPABASE_BUCKET } from '../config/supabase.js';
import { downloadResumeBuffer, extractTextFromBuffer } from '../services/resumeParser.js';

/**
 * @desc    Upload or replace resume PDF in Supabase Storage
 * @route   POST /api/resume/upload
 * @access  Private (JWT Protected)
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided'
      });
    }

    const { isConfigured, missing } = validateSupabaseConfig();
    if (!isConfigured) {
      return res.status(500).json({
        success: false,
        message: `Supabase Storage is not configured on server. Missing: ${missing.join(', ')}`
      });
    }

    const supabase = getSupabaseClient();
    const userId = req.user._id.toString();
    const filePath = `${userId}/resume.pdf`;

    // Upload to Supabase Storage with upsert to allow seamless resume replacement
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Upload Error:', error.message);
      return res.status(500).json({
        success: false,
        message: `Failed to upload resume to storage: ${error.message}`
      });
    }

    const storedPath = `${SUPABASE_BUCKET}/${filePath}`;

    // Update user record in MongoDB with storage path reference (never storing binary in DB)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.resumePath = storedPath;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Resume PDF uploaded successfully',
      resumePath: user.resumePath,
      user: user.toSafeObject()
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Extract text from the authenticated user's uploaded resume PDF
 * @route   POST /api/resume/extract
 * @access  Private (JWT Protected)
 */
export const extractResumeText = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.resumePath) {
      return res.status(400).json({
        success: false,
        message: 'No resume document found. Please upload your resume PDF first.'
      });
    }

    // Retrieve PDF buffer from Supabase Storage
    let pdfBuffer;
    try {
      pdfBuffer = await downloadResumeBuffer(user.resumePath);
    } catch (storageErr) {
      return res.status(404).json({
        success: false,
        message: storageErr.message || 'Unable to retrieve resume from storage.'
      });
    }

    // Extract text from buffer
    try {
      const extractionResult = await extractTextFromBuffer(pdfBuffer);

      return res.status(200).json({
        success: true,
        message: 'Resume text extracted successfully',
        numPages: extractionResult.numPages,
        charCount: extractionResult.charCount,
        text: extractionResult.text
      });
    } catch (parseErr) {
      if (parseErr.code === 'NO_TEXT_FOUND') {
        return res.status(422).json({
          success: false,
          code: 'IMAGE_ONLY_PDF',
          message: parseErr.message
        });
      }

      if (parseErr.code === 'INVALID_PDF_HEADER' || parseErr.code === 'PDF_PARSE_FAILED') {
        return res.status(400).json({
          success: false,
          code: 'CORRUPTED_PDF',
          message: parseErr.message
        });
      }

      return res.status(500).json({
        success: false,
        message: `PDF extraction failed: ${parseErr.message}`
      });
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Get current user resume status
 * @route   GET /api/resume/status
 * @access  Private (JWT Protected)
 */
export const getResumeStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      hasResume: !!user?.resumePath,
      resumePath: user?.resumePath || null
    });
  } catch (error) {
    return next(error);
  }
};
