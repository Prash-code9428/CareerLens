import User from '../models/User.js';

/**
 * @desc    Get authenticated candidate profile
 * @route   GET /api/profile
 * @access  Private (Protected by JWT)
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * @desc    Update authenticated candidate profile
 * @route   PUT /api/profile
 * @access  Private (Protected by JWT)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      education,
      location,
      preferredRoles,
      workMode,
      experienceLevel
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Validate name if provided
    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Full name cannot be empty'
        });
      }
      user.name = name.trim();
    }

    // Update location
    if (location !== undefined) {
      user.location = location ? location.trim() : '';
    }

    // Update education object or fields
    if (education !== undefined) {
      if (typeof education === 'object' && education !== null) {
        user.education = {
          university: education.university !== undefined ? education.university.trim() : user.education?.university || '',
          degree: education.degree !== undefined ? education.degree.trim() : user.education?.degree || '',
          major: education.major !== undefined ? education.major.trim() : user.education?.major || '',
          graduationYear: education.graduationYear !== undefined ? education.graduationYear.trim() : user.education?.graduationYear || ''
        };
      }
    }

    // Update preferred roles array
    if (preferredRoles !== undefined) {
      if (Array.isArray(preferredRoles)) {
        user.preferredRoles = preferredRoles
          .map((role) => (typeof role === 'string' ? role.trim() : ''))
          .filter((role) => role.length > 0);
      }
    }

    // Update work mode
    if (workMode !== undefined) {
      user.workMode = workMode;
    }

    // Update experience level
    if (experienceLevel !== undefined) {
      user.experienceLevel = experienceLevel;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toSafeObject()
    });
  } catch (error) {
    return next(error);
  }
};
