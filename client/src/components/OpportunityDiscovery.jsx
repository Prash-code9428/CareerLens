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
  Tag
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

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Live Opportunity Discovery</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Context.dev + Vertex AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live web discovery matching your skills, target roles, location, and work preferences.
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
              <span>Searching Live Web...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>{searched ? 'Refresh Opportunities' : 'Discover Opportunities'}</span>
            </>
          )}
        </button>
      </div>

      {!hasContext && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Upload and analyze your resume or fill out your candidate profile preferences to trigger live discovery.</span>
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
            <span>Vertex AI Search Queries:</span>
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
              <div className="h-12 bg-slate-800/40 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunities List */}
      {!loading && searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Found {opportunities.length} live opportunities</span>
            <span className="text-[11px] text-slate-500">Deduplicated by URL</span>
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
              {opportunities.map((opp, idx) => (
                <div
                  key={`${opp.url}-${idx}`}
                  className="group rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {opp.title}
                      </h3>
                      {opp.source && (
                        <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {opp.source}
                        </span>
                      )}
                    </div>

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

                    {opp.description && (
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {opp.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Live Web Result</span>
                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5 transform duration-150"
                    >
                      <span>View & Apply</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
