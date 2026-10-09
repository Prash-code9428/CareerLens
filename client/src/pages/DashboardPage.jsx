import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import ResumeUploader from '../components/ResumeUploader.jsx';
import CandidateProfileView from '../components/CandidateProfileView.jsx';
import MatchScore from '../components/opportunities/MatchScore.jsx';
import OpportunityCard from '../components/opportunities/OpportunityCard.jsx';
import resumeService from '../services/resumeService.js';
import opportunityService from '../services/opportunityService.js';
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
  ArrowRight,
  Zap,
  Target,
  Layers,
  ChevronRight,
  Award,
  Globe,
  Check,
  Clock,
  ShieldCheck
} from 'lucide-react';

import InlineAlert from '../components/common/InlineAlert.jsx';
import DashboardSkeleton from '../components/common/DashboardSkeleton.jsx';

export default function DashboardPage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [analysisSuccess, setAnalysisSuccess] = useState('');

  // Opportunities state from session storage or quick fetch
  const [topOpportunities, setTopOpportunities] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);

  useEffect(() => {
    // Load cached opportunities from sessionStorage if available
    try {
      const cached = sessionStorage.getItem('careerlens_opportunities');
      if (cached) {
        const list = JSON.parse(cached);
        if (Array.isArray(list) && list.length > 0) {
          // Sort descending by matchScore
          const sorted = [...list].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
          setTopOpportunities(sorted.slice(0, 3));
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

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
        (err.code === 'ERR_NETWORK' ? 'Unable to reach backend server. Please check your connection.' : err.message) ||
        "We couldn't analyze your resume right now. Please try again.";
      setAnalysisError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const hasResume = Boolean(user?.resumePath);
  const candidateProfile = user?.candidateProfile;

  // 1. Calculate real profile completion percentage based on actual fields
  const calculateProfileCompletion = () => {
    let score = 0;
    const totalWeights = 5;

    if (user?.name) score += 1;
    if (user?.education?.university || user?.education?.degree) score += 1;
    if (user?.location) score += 1;
    if (user?.preferredRoles && user.preferredRoles.length > 0) score += 1;
    if (hasResume) score += 1;

    return Math.round((score / totalWeights) * 100);
  };

  const completionPercent = calculateProfileCompletion();

  // Extract top skills and recommended roles from real profile data
  const topSkills = candidateProfile?.skills?.slice(0, 10) || [
    ...(candidateProfile?.programmingLanguages || []),
    ...(candidateProfile?.frameworks || [])
  ].slice(0, 8);

  const recommendedRoles = candidateProfile?.preferredRoles?.length > 0
    ? candidateProfile.preferredRoles
    : user?.preferredRoles || [];

  const strongestOpportunity = topOpportunities[0] || null;

  // Guided Setup Pipeline Steps
  const setupSteps = [
    {
      id: 'profile',
      title: 'Complete your profile',
      description: 'Set your education, target roles, and location preferences.',
      completed: Boolean(user?.location && user?.preferredRoles?.length > 0),
      link: '/profile',
      linkText: 'Edit Profile'
    },
    {
      id: 'upload',
      title: 'Upload your resume',
      description: 'Upload your PDF resume to secure Supabase cloud storage.',
      completed: hasResume,
      action: null
    },
    {
      id: 'analyze',
      title: 'Analyze your resume',
      description: 'Run Vertex AI skill extraction & candidate intelligence.',
      completed: Boolean(candidateProfile),
      action: hasResume && !candidateProfile ? handleAnalyzeResume : null,
      actionText: 'Analyze Now'
    },
    {
      id: 'opportunities',
      title: 'Find opportunities',
      description: 'Discover live matching jobs and internships on Context.dev.',
      completed: topOpportunities.length > 0,
      link: '/opportunities',
      linkText: 'Explore Opportunities'
    }
  ];

  const allSetupCompleted = setupSteps.every((s) => s.completed);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-stone-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:bg-emerald-100 transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">CareerLens</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 border border-stone-200 text-slate-600">
              Command Center
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/opportunities"
              className="text-xs font-semibold text-emerald-800 hover:bg-emerald-100 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 transition-colors"
            >
              Opportunities
            </Link>

            <Link
              to="/profile"
              className="text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 px-3 py-1.5 rounded-lg bg-white border border-stone-200 shadow-2xs transition-colors"
            >
              My Profile
            </Link>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 shadow-2xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Hero Banner */}
        <div className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{candidateProfile ? 'Vertex AI Intelligence Active' : 'Career Readiness Center'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {candidateProfile
                ? 'Your AI candidate profile is live. Explore matched opportunities ranked with real-time Vertex AI fit scoring.'
                : hasResume
                ? 'Resume uploaded to Supabase Storage. Run Vertex AI intelligence analysis to unlock automated placement scoring.'
                : 'Complete candidate onboarding by uploading your resume PDF to begin live placement discovery.'}
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md shadow-emerald-700/15"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Background Glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Global Feedback Banners */}
        {analysisSuccess && (
          <InlineAlert
            type="success"
            message={analysisSuccess}
            onClose={() => setAnalysisSuccess('')}
          />
        )}

        {analysisError && (
          <InlineAlert
            type="error"
            message={analysisError}
            onRetry={hasResume ? handleAnalyzeResume : undefined}
            onClose={() => setAnalysisError('')}
          />
        )}

        {/* 4 Core Metric Command Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Profile Completion */}
          <div className="rounded-2xl bg-white border border-stone-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Profile Completion</span>
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">{completionPercent}%</span>
                <Link to="/profile" className="text-[11px] font-semibold text-emerald-700 hover:underline">
                  {completionPercent === 100 ? 'Review' : 'Complete'}
                </Link>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. Resume Status */}
          <div className="rounded-2xl bg-white border border-stone-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Resume Status</span>
              <FileText className="w-4 h-4 text-teal-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {hasResume ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Uploaded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Missing Resume
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {hasResume ? 'Stored in Supabase bucket' : 'Upload PDF to begin'}
              </p>
            </div>
          </div>

          {/* 3. AI Profile Status */}
          <div className="rounded-2xl bg-white border border-stone-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>AI Profile Status</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                {candidateProfile ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Vertex AI Active
                  </span>
                ) : hasResume ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    Ready for Analysis
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-slate-600 border border-stone-200">
                    Awaiting Resume
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {candidateProfile?.analyzedAt ? `Analyzed ${new Date(candidateProfile.analyzedAt).toLocaleDateString()}` : 'Google Cloud Vertex AI'}
              </p>
            </div>
          </div>

          {/* 4. Strongest Match Indicator */}
          <div className="rounded-2xl bg-white border border-stone-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Strongest Match</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="space-y-1">
              {strongestOpportunity && typeof strongestOpportunity.matchScore === 'number' ? (
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-emerald-700">
                      {strongestOpportunity.matchScore}%
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate">
                      {strongestOpportunity.company || 'Top Role'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {strongestOpportunity.title}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {candidateProfile ? 'Ready to Search' : 'Setup Incomplete'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {candidateProfile ? 'Run opportunity discovery' : 'Complete steps below'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guided Setup Pipeline (Always shown when setup is incomplete) */}
        {!allSetupCompleted && (
          <div className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Career Readiness Pipeline</h2>
                  <p className="text-xs text-slate-500">Follow these steps to unlock live AI placement matching</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-slate-700 border border-stone-200 self-start sm:self-auto">
                {setupSteps.filter(s => s.completed).length} of 4 Complete
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {setupSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    step.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-[#fafaf9] border-stone-200 text-slate-600'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Step 0{idx + 1}
                      </span>
                      {step.completed ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-stone-200 text-slate-600 text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-sm font-bold ${step.completed ? 'text-slate-900' : 'text-slate-700'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    {step.link && !step.completed && (
                      <Link
                        to={step.link}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <span>{step.linkText}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {step.action && !step.completed && (
                      <button
                        type="button"
                        onClick={step.action}
                        disabled={analyzing}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50 cursor-pointer"
                      >
                        {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        <span>{step.actionText}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {step.completed && (
                      <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Complete
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Grid: Profile Snapshot & Opportunities Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Candidate Overview & Skills Snapshot */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Candidate Summary Box */}
            <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Candidate Overview
                </h2>
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Email</p>
                    <p className="text-slate-800 text-xs font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</p>
                    <p className="text-slate-800 text-xs font-medium">{user?.location || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <GraduationCap className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Education</p>
                    <p className="text-slate-800 text-xs font-medium">
                      {user?.education?.degree ? `${user.education.degree} in ${user.education.major || 'Field'}` : 'Undergraduate Student'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                  <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Preferences</p>
                    <p className="text-slate-800 text-xs font-medium capitalize">
                      {user?.workMode || 'Any'} work mode • {user?.experienceLevel || 'Student'} level
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Skills Matrix (Real skills extracted or selected) */}
            <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Top Technical Skills</h3>
                </div>
                {candidateProfile && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    AI Verified
                  </span>
                )}
              </div>

              {topSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {topSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 border border-stone-200 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
                  <p className="text-xs text-slate-600">No skills extracted yet</p>
                  <p className="text-[11px] text-slate-500">Upload your resume to extract technical competencies</p>
                </div>
              )}
            </div>

            {/* Recommended Roles */}
            <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recommended Roles</h3>
                </div>
              </div>

              {recommendedRoles.length > 0 ? (
                <div className="space-y-2">
                  {recommendedRoles.map((role, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-slate-800"
                    >
                      <span>{role}</span>
                      <Link
                        to="/opportunities"
                        className="text-[11px] text-emerald-700 font-semibold hover:text-emerald-800"
                      >
                        Explore →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-1">
                  <p className="text-xs text-slate-600">No recommended roles</p>
                  <Link to="/profile" className="text-[11px] text-emerald-700 font-semibold hover:underline">
                    Add preferred roles in profile
                  </Link>
                </div>
              )}
            </div>

            {/* Resume Upload Box */}
            <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Resume Document</h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-slate-600 border border-stone-200">
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

          {/* Right Column: AI Profile View or Analysis CTA + Top Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* If Resume is uploaded but NOT analyzed yet */}
            {hasResume && !candidateProfile && (
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-8 text-center space-y-5 shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-slate-900">
                    Extract Candidate Intelligence
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Google Cloud Vertex AI will parse your resume into categorized skills, verified projects, and recommended role alignments.
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleAnalyzeResume}
                    disabled={analyzing}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 transition-all shadow-md shadow-emerald-700/15 cursor-pointer"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Analyzing with Vertex AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-white" />
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

            {/* Top / Recent Opportunities Showcase */}
            <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Top Matched Opportunities
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time opportunities scored by Google Cloud Vertex AI
                    </p>
                  </div>
                </div>

                <Link
                  to="/opportunities"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors shrink-0"
                >
                  <span>View All Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Opportunities List or Empty State */}
              {topOpportunities.length > 0 ? (
                <div className="space-y-4">
                  {topOpportunities.map((opp, idx) => (
                    <OpportunityCard
                      key={`${opp.url}-${idx}`}
                      opportunity={opp}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#fafaf9] border border-stone-200 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-white border border-stone-200 flex items-center justify-center text-slate-500 shadow-2xs">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-sm font-bold text-slate-900">No Opportunities Discovered Yet</h3>
                    <p className="text-xs text-slate-500">
                      Run live opportunity discovery to search active web postings matching your candidate profile.
                    </p>
                  </div>
                  <div>
                    <Link
                      to="/opportunities"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-700/15"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Launch Opportunity Discovery</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
