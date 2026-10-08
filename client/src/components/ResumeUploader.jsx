import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import resumeService from '../services/resumeService.js';
import useAuth from '../hooks/useAuth.js';

export default function ResumeUploader({ onUploadSuccess }) {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const hasExistingResume = Boolean(user?.resumePath);

  const validateFile = (file) => {
    if (!file) return 'Please select a file';

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      return 'Only PDF files (.pdf) are supported.';
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      return 'File size exceeds 5 MB limit. Please select a smaller PDF.';
    }

    return null;
  };

  const handleFile = (file) => {
    setErrorMessage('');
    setStatusMessage('');

    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    // Automatically trigger upload once file is validated
    uploadFile(file);
  };

  const uploadFile = async (fileToUpload) => {
    const file = fileToUpload || selectedFile;
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setErrorMessage('');
    setStatusMessage('');

    try {
      const data = await resumeService.uploadResume(file, (percent) => {
        setProgress(percent);
      });

      if (data.success && data.user) {
        setUser(data.user);
        setStatusMessage(
          hasExistingResume
            ? 'Resume replaced and stored securely in Supabase Storage.'
            : 'Resume uploaded and stored securely in Supabase Storage.'
        );
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(data);
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Backend server unavailable.' : err.message) ||
        'Failed to upload resume.';
      setErrorMessage(message);
    } finally {
      setUploading(false);
    }
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-4 text-left">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload resume PDF"
      />

      {/* Existing Resume Active State Banner */}
      {hasExistingResume && !uploading && (
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white">Active Resume PDF</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  Stored in Supabase
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-xs sm:max-w-md">
                {user.resumePath}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBrowseClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Replace PDF</span>
          </button>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? handleBrowseClick : undefined}
        className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-emerald-400 bg-emerald-500/10'
            : hasExistingResume
            ? 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
            : 'border-slate-700 hover:border-emerald-500/60 bg-slate-900/50 hover:bg-slate-900'
        } ${uploading ? 'cursor-not-allowed opacity-80' : ''}`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            {uploading ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {uploading
                ? 'Uploading to Supabase Storage...'
                : hasExistingResume
                ? 'Drop a new PDF here to replace your resume'
                : 'Click to upload or drag & drop your resume PDF'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports standard PDF documents up to 5 MB
            </p>
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="w-full max-w-xs space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected file preview (before or during upload) */}
      {selectedFile && !uploading && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200 font-medium">{selectedFile.name}</span>
            <span className="text-slate-500">({formatFileSize(selectedFile.size)})</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedFile(null)}
            className="text-slate-400 hover:text-rose-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Feedback Messages */}
      {statusMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
