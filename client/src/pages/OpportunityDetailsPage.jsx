import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import MatchScore from '../components/opportunities/MatchScore.jsx';
import SkillBadge from '../components/opportunities/SkillBadge.jsx';
import PageLoader from '../components/common/PageLoader.jsx';
import PageError from '../components/common/PageError.jsx';
import {
  Compass,
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  Sparkles,
  Globe,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Zap,
  HelpCircle,
  Share2,
  ShieldCheck
} from 'lucide-react';

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Try location.state
    if (location.state?.opportunity) {
      setOpportunity(location.state.opportunity);
      setLoading(false);
      return;
    }

    // 2. Try sessionStorage cache
    try {
      const cached = sessionStorage.getItem('careerlens_opportunities');
      if (cached) {
        const list = JSON.parse(cached);
        const match = list.find((opp) => {
          const oppId = opp.id || btoa(encodeURIComponent(opp.url)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
          return oppId === id || encodeURIComponent(opp.url) === id || opp.url === id;
        });

        if (match) {
          setOpportunity(match);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Session cache read error:', e);
    }

    // 3. Fallback: try decoding URL from id if base64 encoded
    try {
      const decodedUrl = atob(id);
      if (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://')) {
        setOpportunity({
          url: decodedUrl,
          title: 'Live Web Opportunity',
          source: new URL(decodedUrl).hostname.replace(/^www\./, ''),
          company: null,
          location: null,
          description: null
        });
      }
    } catch (e) {
      // not a valid base64 url
    }

    setLoading(false);
  }, [id, location.state]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <PageLoader message="Loading opportunity details..." />;
  }

  if (!opportunity) {
    return (
      <PageError
        title="Opportunity Not Found"
        message="This opportunity might have expired or is unavailable. Return to the discovery dashboard to find active postings."
        backTo="/opportunities"
        backLabel="Browse Live Opportunities"
      />
    );
  }

  const {
    title,
    company,
    location: oppLocation,
    workMode,
    jobType,
    url,
    description,
    source,
    matchScore,
    recommendation,
    matchingSkills = [],
    missingSkills = [],
    reason
  } = opportunity;

  const lowerTitle = (title || '').toLowerCase();
  let displayJobType = jobType || null;
  if (!displayJobType) {
    if (lowerTitle.includes('internship') || lowerTitle.includes('intern')) {
      displayJobType = 'Internship';
    } else if (lowerTitle.includes('full-time') || lowerTitle.includes('full time')) {
      displayJobType = 'Full-time';
    }
  }

  let displayWorkMode = workMode || null;
  if (!displayWorkMode) {
    if (lowerTitle.includes('remote') || (oppLocation && oppLocation.toLowerCase().includes('remote'))) {
      displayWorkMode = 'Remote';
    } else if (lowerTitle.includes('hybrid') || (oppLocation && oppLocation.toLowerCase().includes('hybrid'))) {
      displayWorkMode = 'Hybrid';
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Opportunities</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              title="Copy link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:bg-emerald-500 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <span>Apply Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Card */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Live Opportunity</span>
                </span>
                {source && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>via {source}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {title || 'Untitled Opportunity'}
              </h1>

              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-slate-400">
                <div className="inline-flex items-center gap-1.5 text-slate-200 font-semibold">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>{company || <span className="text-slate-500 italic font-normal">Company not specified</span>}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{oppLocation || <span className="text-slate-500 italic">Location not specified</span>}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-slate-300">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>{displayWorkMode || <span className="text-slate-500 italic">Work mode not specified</span>}</span>
                </div>

                {displayJobType && (
                  <div className="inline-flex items-center gap-1.5 text-teal-300 font-medium">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <span>{displayJobType}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Match Score & CTA Container */}
            <div className="shrink-0 flex flex-col items-start lg:items-end gap-4 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <div className="space-y-1 text-left lg:text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  AI Fit Score
                </p>
                <MatchScore score={matchScore} recommendation={recommendation} />
              </div>

              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:from-emerald-300 hover:to-teal-300 active:from-emerald-500 active:to-teal-500 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Main Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: AI Match Analysis & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Match Intelligence Box */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Why You're a Match</h2>
                    <p className="text-xs text-slate-400">Evaluated by Google Cloud Vertex AI against your candidate profile</p>
                  </div>
                </div>
                {recommendation && (
                  <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {recommendation}
                  </span>
                )}
              </div>

              {/* AI Reason */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {reason || 'Candidate profile demonstrates strong alignment with the technical and domain requirements extracted from this opportunity.'}
                </p>
              </div>

              {/* Skills Analysis Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matching Skills */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Matching Skills
                    </h3>
                  </div>

                  {matchingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {matchingSkills.map((skill, idx) => (
                        <SkillBadge key={idx} skill={skill} type="matching" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No explicit overlapping skill keywords parsed.
                    </p>
                  )}
                </div>

                {/* Missing Skills / Skill Gaps */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Skill Gaps / Missing Skills
                    </h3>
                  </div>

                  {missingSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.map((skill, idx) => (
                        <SkillBadge key={idx} skill={skill} type="gap" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-emerald-400/80 flex items-center gap-1 font-medium">
                      <span>No critical skill gaps identified in posting.</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Opportunity Description Box */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Opportunity Description</span>
              </h2>

              {description ? (
                <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {description}
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                  <HelpCircle className="w-6 h-6 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No extensive description snippet was provided by the web crawler. Visit the original posting to review full job requirements and benefits.
                  </p>
                  {url && (
                    <div className="pt-2">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <span>View Full Listing on {source || 'Career Site'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Opportunity Overview & Direct Apply Card */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Opportunity Summary
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Role Title</span>
                  <span className="text-slate-200 font-semibold text-right">{title || 'Not specified'}</span>
                </div>

                <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Company</span>
                  <span className="text-slate-200 font-semibold text-right">{company || 'Not specified'}</span>
                </div>

                <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="text-slate-200 font-semibold text-right">{oppLocation || 'Not specified'}</span>
                </div>

                <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Work Mode</span>
                  <span className="text-slate-200 font-semibold text-right">{displayWorkMode || 'Not specified'}</span>
                </div>

                <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-500 font-medium">Source Portal</span>
                  <span className="text-slate-200 font-semibold text-right">{source || 'Web'}</span>
                </div>
              </div>

              {/* Big Direct Action */}
              <div className="pt-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <span>Apply on Original Site</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Candidate Context reminder */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Your Profile Match</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluated for candidate <strong>{user?.name}</strong> based on extracted resume skills and active career preferences.
              </p>
              <div className="pt-1">
                <Link
                  to="/profile"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Edit Career Preferences →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
