import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import ResumeUploader from '../components/ResumeUploader.jsx';
import CandidateProfileView from '../components/CandidateProfileView.jsx';
import resumeService from '../services/resumeService.js';
import {
  Compass,
  LogOut,
  User,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisSuccess, setAnalysisSuccess] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAnalyzeResume = async () => {
    setAnalyzing(true);
    setAnalysisError('');
    setAnalysisSuccess('');

    try {
      const data = await resumeService.analyzeResume();
      if (data.success && data.user) {
        setUser(data.user);
        setAnalysisSuccess('Resume successfully analyzed with Google Cloud Vertex AI!');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to reach backend server.' : err.message) ||
        'Failed to analyze resume with Vertex AI.';
      setAnalysisError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const hasResume = Boolean(user?.resumePath);
  const candidateProfile = user?.candidateProfile;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">CareerLens</span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 border border-slate-800 text-slate-400">
              Student Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-xs font-semibold text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            >
              My Profile
            </Link>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/60 border border-slate-800 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              {candidateProfile ? 'AI Profile Active' : 'Placement Profile'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || 'Student'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {candidateProfile
                ? 'Your resume has been processed by Google Cloud Vertex AI into a structured candidate profile. Review your skills and recommended roles below.'
                : hasResume
                ? 'Resume uploaded! Run Vertex AI analysis to extract your technical stack, projects, and target role alignments.'
                : 'Upload your resume PDF to begin automated AI skill extraction and placement matching.'}
            </p>
          </div>
        </div>

        {/* Global Feedback Banners */}
        {analysisSuccess && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{analysisSuccess}</span>
          </div>
        )}

        {analysisError && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{analysisError}</span>
          </div>
        )}

        {/* Main Grid: Profile & Workflow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Candidate Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  Candidate Info
                </h2>
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Mail className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</p>
                    <p className="text-slate-200 text-xs font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</p>
                    <p className="text-slate-200 text-xs font-medium">{user?.location || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <GraduationCap className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Education</p>
                    <p className="text-slate-200 text-xs font-medium">
                      {user?.education?.degree ? `${user.education.degree} in ${user.education.major || 'Field'}` : 'Undergraduate Student'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <Briefcase className="w-4 h-4 text-slate-500 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Preferences</p>
                    <p className="text-slate-200 text-xs font-medium capitalize">
                      {user?.workMode || 'Any'} work mode • {user?.experienceLevel || 'Student'} level
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Upload Module */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Resume Document</h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Supabase Storage
                </span>
              </div>

              <ResumeUploader
                onUploadSuccess={() => {
                  setAnalysisSuccess('');
                  setAnalysisError('');
                }}
              />
            </div>
          </div>

          {/* Column 2 & 3: AI Resume Intelligence Section & Discovery */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* If Resume is uploaded but NOT analyzed yet */}
            {hasResume && !candidateProfile && (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 p-8 text-center space-y-5">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-white">
                    Extract Candidate Intelligence
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Google Cloud Vertex AI will parse your resume into categorized skills, verified projects, and recommended role alignments.
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleAnalyzeResume}
                    disabled={analyzing}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing with Vertex AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Analyze my resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* If Candidate Profile is available: Render full AI-assisted Profile */}
            {candidateProfile && (
              <CandidateProfileView
                profile={candidateProfile}
                onReanalyze={handleAnalyzeResume}
                isAnalyzing={analyzing}
              />
            )}

            {/* If NO Resume has been uploaded yet */}
            {!hasResume && (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-white">No Resume Uploaded Yet</h3>
                  <p className="text-xs text-slate-400">
                    Upload your resume PDF in the left panel to unlock AI skill extraction and live opportunity matching.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Live Opportunity Research Teaser */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Live Opportunity Discovery & Matching</h3>
                    <p className="text-xs text-slate-400">Powered by Context.dev Web Research & Vertex AI</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Phase 3 Next
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Live opportunity research will cross-reference your AI-assisted candidate profile against active placement opportunities on the web.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
