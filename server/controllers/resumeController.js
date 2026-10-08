import User from '../models/User.js';
import { getSupabaseClient, validateSupabaseConfig, SUPABASE_BUCKET } from '../config/supabase.js';

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
