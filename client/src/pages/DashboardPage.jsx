import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
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
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              Active Placement Profile
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || 'Student'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Your profile is registered and ready. Next, upload your resume to generate structured AI skills analysis and discover personalized opportunities.
            </p>
          </div>
        </div>

        {/* Profile Details & Next Step Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Candidate Profile Summary */}
          <div className="lg:col-span-1 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Candidate Profile
            </h2>

            <div className="space-y-3.5 text-sm">
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
                    {user?.workMode || 'Any'} work mode • {user?.experienceLevel || 'Internship'} level
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Workflow Pipeline Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Resume Upload Placeholder */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Resume Parsing & Intelligence</h3>
                    <p className="text-xs text-slate-400">Powered by Google Cloud Vertex AI & Supabase Storage</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Phase 2 Next
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Resume upload with automatic skill extraction, experience modeling, and project evaluation will be enabled in the resume processing phase.
              </p>
            </div>

            {/* Step 2: Live Opportunity Research & Matching Placeholder */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Live Opportunity Discovery & Matching</h3>
                    <p className="text-xs text-slate-400">Powered by Context.dev & Vertex AI Fit Analysis</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Phase 3 Next
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Live opportunity search across web sources and automated match-scoring will be activated once your profile has an attached resume.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
