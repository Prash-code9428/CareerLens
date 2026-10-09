import React, { useState } from 'react';
import opportunityService from '../services/opportunityService.js';
import {
  Compass,
  Sparkles,
  Search,
  ExternalLink,
  MapPin,
  Building2,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Tag,
  Award,
  Zap,
  Check,
  XCircle,
  HelpCircle
} from 'lucide-react';

export default function OpportunityDiscovery({ candidateProfile, userPreferences }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queries, setQueries] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleDiscover = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await opportunityService.searchOpportunities();
      if (response.success) {
        setQueries(response.queries || []);
        setOpportunities(response.opportunities || []);
        setSearched(true);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to reach backend server. Please check your internet connection.' : err.message) ||
        "We couldn't find opportunities at the moment. Please try again shortly.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const hasContext = Boolean(
    candidateProfile ||
    (userPreferences?.preferredRoles && userPreferences.preferredRoles.length > 0)
  );

  const getRecommendationBadge = (recommendation, score) => {
    switch (recommendation) {
      case 'Strong Match':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          indicator: 'bg-emerald-600'
        };
      case 'Good Match':
        return {
          bg: 'bg-teal-50 border-teal-200 text-teal-800',
          indicator: 'bg-teal-600'
        };
      case 'Possible Match':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          indicator: 'bg-amber-600'
        };
      case 'Low Match':
      default:
        return {
          bg: 'bg-stone-100 border-stone-200 text-slate-600',
          indicator: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Live Opportunity Discovery & AI Matching</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                Vertex AI + Context.dev
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Live web discovery scored and ranked against your candidate profile using Google Cloud Vertex AI.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDiscover}
          disabled={loading || !hasContext}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-700/15 shrink-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Matching Opportunities...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{searched ? 'Refresh Opportunities' : 'Discover & Match Opportunities'}</span>
            </>
          )}
        </button>
      </div>

      {!hasContext && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Upload and analyze your resume or set your target role preferences to trigger AI matching.</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Search Queries Indicator */}
      {queries.length > 0 && (
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Targeted Vertex AI Live Search Queries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {queries.map((q, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 text-slate-800 text-xs font-mono shadow-2xs"
              >
                <Tag className="w-3 h-3 text-emerald-600" />
                "{q}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="p-5 rounded-xl bg-white border border-stone-200 animate-pulse space-y-3 shadow-2xs"
            >
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
              <div className="h-3 bg-stone-100 rounded w-1/2"></div>
              <div className="h-14 bg-stone-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities List */}
      {!loading && searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Found {opportunities.length} live opportunities • Ranked by AI Match Score</span>
            <span className="text-[11px] text-slate-500">Deduplicated & Verified</span>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <Globe className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">No active postings returned</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Check that CONTEXT_API_KEY is configured or adjust your preferred roles and location.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map((opp, idx) => {
                const hasScore = typeof opp.matchScore === 'number';
                const badgeStyle = getRecommendationBadge(opp.recommendation, opp.matchScore);

                return (
                  <div
                    key={`${opp.url}-${idx}`}
                    className="group rounded-xl bg-white hover:border-emerald-300 border border-stone-200/90 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md hover:shadow-stone-200/60 shadow-2xs"
                  >
                    <div className="space-y-3">
                      {/* Top Header: Title, Source & Match Score */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-2">
                            {opp.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            {opp.company && (
                              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                {opp.company}
                              </span>
                            )}
                            {opp.location && (
                              <span className="inline-flex items-center gap-1 text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {opp.location}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        {hasScore && (
                          <div className="shrink-0 flex flex-col items-end">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 shadow-2xs">
                              <Zap className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-extrabold text-slate-900">
                                {opp.matchScore}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Match Recommendation & Reason */}
                      {opp.recommendation && (
                        <div className="p-3 rounded-xl bg-[#fafaf9] border border-stone-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyle.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle.indicator}`} />
                              {opp.recommendation}
                            </span>
                            {opp.source && (
                              <span className="text-[10px] font-medium text-slate-500">
                                via {opp.source}
                              </span>
                            )}
                          </div>

                          {opp.reason && (
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {opp.reason}
                            </p>
                          )}

                          {/* Matching Skills */}
                          {opp.matchingSkills && opp.matchingSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                Matching:
                              </span>
                              {opp.matchingSkills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium"
                                >
                                  <Check className="w-2.5 h-2.5" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Missing Skills */}
                          {opp.missingSkills && opp.missingSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                                Missing:
                              </span>
                              {opp.missingSkills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-medium"
                                >
                                  <XCircle className="w-2.5 h-2.5" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Description snippet */}
                      {opp.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {opp.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Live Web Posting</span>
                      <a
                        href={opp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors group-hover:translate-x-0.5 transform duration-150"
                      >
                        <span>Apply on {opp.source || 'Portal'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
