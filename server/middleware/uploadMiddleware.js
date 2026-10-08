import multer from 'multer';
import path from 'path';

// Store uploaded file in memory buffer for immediate Supabase upload
const storage = multer.memoryStorage();

// Validate PDF format only
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = ext === '.pdf';

  if (isPdfMime && isPdfExt) {
    return cb(null, true);
  }

  const error = new Error('Invalid file type. Only PDF documents (.pdf) are allowed.');
  error.code = 'INVALID_FILE_TYPE';
  return cb(error, false);
};

// 5 MB maximum file size limit
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB in bytes
  },
  fileFilter
});

/**
 * Middleware wrapper to cleanly handle Multer upload errors
 */
export const handleResumeUpload = (req, res, next) => {
  const singleUpload = upload.single('resume');

  singleUpload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File is too large. Maximum allowed size is 5 MB.'
        });
      }

      if (err.code === 'INVALID_FILE_TYPE' || err.message?.includes('PDF')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Please upload a valid PDF document.'
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error occurred.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume PDF file to upload.'
      });
    }

    next();
  });
};
