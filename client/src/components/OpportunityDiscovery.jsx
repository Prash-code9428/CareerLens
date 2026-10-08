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
        (err.code === 'ERR_NETWORK' ? 'Unable to reach backend server.' : err.message) ||
        'Failed to discover live opportunities.';
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
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          indicator: 'bg-emerald-400'
        };
      case 'Good Match':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
          indicator: 'bg-cyan-400'
        };
      case 'Possible Match':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          indicator: 'bg-amber-400'
        };
      case 'Low Match':
      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-400',
          indicator: 'bg-slate-500'
        };
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Live Opportunity Discovery & AI Matching</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Vertex AI + Context.dev
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live web discovery scored and ranked against your candidate profile using Google Cloud Vertex AI.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDiscover}
          disabled={loading || !hasContext}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 active:from-cyan-600 active:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 shrink-0"
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
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Upload and analyze your resume or set your target role preferences to trigger AI matching.</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* AI Search Queries Indicator */}
      {queries.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Targeted Vertex AI Live Search Queries:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {queries.map((q, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono"
              >
                <Tag className="w-3 h-3 text-cyan-400/70" />
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
              className="p-5 rounded-xl bg-slate-950/40 border border-slate-800/80 animate-pulse space-y-3"
            >
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
              <div className="h-14 bg-slate-800/40 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities List */}
      {!loading && searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Found {opportunities.length} live opportunities • Ranked by AI Match Score</span>
            <span className="text-[11px] text-slate-500">Deduplicated & Verified</span>
          </div>

          {opportunities.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
              <Globe className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No active postings returned</p>
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
                    className="group rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-lg hover:shadow-emerald-500/5"
                  >
                    <div className="space-y-3">
                      {/* Top Header: Title, Source & Match Score */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors line-clamp-2">
                            {opp.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                            {opp.company && (
                              <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                {opp.company}
                              </span>
                            )}
                            {opp.location && (
                              <span className="inline-flex items-center gap-1 text-slate-400">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                {opp.location}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        {hasScore && (
                          <div className="shrink-0 flex flex-col items-end">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                              <Zap className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-xs font-extrabold text-white">
                                {opp.matchScore}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Match Recommendation & Reason */}
                      {opp.recommendation && (
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
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
                            <p className="text-xs text-slate-300 leading-relaxed">
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
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-medium"
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
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                Missing:
                              </span>
                              {opp.missingSkills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-medium"
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
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {opp.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Live Web Posting</span>
                      <a
                        href={opp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group-hover:translate-x-0.5 transform duration-150"
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
