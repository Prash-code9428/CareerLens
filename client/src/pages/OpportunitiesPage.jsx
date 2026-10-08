import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import opportunityService from '../services/opportunityService.js';
import OpportunityCard from '../components/opportunities/OpportunityCard.jsx';
import OpportunitySkeleton from '../components/opportunities/OpportunitySkeleton.jsx';
import EmptyState from '../components/opportunities/EmptyState.jsx';
import SearchButton from '../components/opportunities/SearchButton.jsx';
import {
  Compass,
  Sparkles,
  LogOut,
  User,
  Tag,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export default function OpportunitiesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [queries, setQueries] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Client-side quick filter & sort (no extraneous web searches on filter changes)
  const [selectedMatchFilter, setSelectedMatchFilter] = useState('ALL');
  const [searchFilterKeyword, setSearchFilterKeyword] = useState('');
  const [sortBy, setSortBy] = useState('matchScore_desc');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFindOpportunities = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await opportunityService.searchOpportunities();
      if (response.success) {
        setQueries(response.queries || []);
        setOpportunities(response.opportunities || []);
        setHasSearched(true);
      } else {
        setError(response.message || 'Unable to discover opportunities.');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to reach the backend server.' : err.message) ||
        'Failed to discover opportunities.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const hasProfileContext = Boolean(
    user?.candidateProfile ||
    (user?.preferredRoles && user.preferredRoles.length > 0) ||
    user?.resumePath
  );

  // Filter & sort logic applied purely client-side
  const filteredOpportunities = useMemo(() => {
    let list = [...opportunities];

    // Match strength filter
    if (selectedMatchFilter !== 'ALL') {
      list = list.filter((opp) => opp.recommendation === selectedMatchFilter);
    }

    // Keyword text search filter
    if (searchFilterKeyword.trim()) {
      const kw = searchFilterKeyword.toLowerCase().trim();
      list = list.filter((opp) => {
        const titleMatch = (opp.title || '').toLowerCase().includes(kw);
        const companyMatch = (opp.company || '').toLowerCase().includes(kw);
        const locationMatch = (opp.location || '').toLowerCase().includes(kw);
        const skillMatch = (opp.matchingSkills || []).some((s) => s.toLowerCase().includes(kw));
        return titleMatch || companyMatch || locationMatch || skillMatch;
      });
    }

    // Sort
    if (sortBy === 'matchScore_desc') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'matchScore_asc') {
      list.sort((a, b) => (a.matchScore || 0) - (b.matchScore || 0));
    } else if (sortBy === 'company') {
      list.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
    }

    return list;
  }, [opportunities, selectedMatchFilter, searchFilterKeyword, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">CareerLens</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Live Opportunities
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
            >
              Profile
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
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Hero Header */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900/80 border border-slate-800 p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2.5 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Web Intelligence & Vertex AI Matching</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Opportunities matched to you
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Based on your skills, preferences and resume.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <SearchButton
              onClick={handleFindOpportunities}
              loading={loading}
              hasSearched={hasSearched}
              disabled={!hasProfileContext}
            />
          </div>

          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* AI Query Indicator Pills */}
        {queries.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Google Cloud Vertex AI generated focused searches:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {queries.map((q, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono"
                >
                  <Tag className="w-3 h-3 text-emerald-400/70" />
                  "{q}"
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Client-Side Quick Filter & Sort Controls (Only visible after searching with results) */}
        {!loading && hasSearched && opportunities.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search filter keyword */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by title, company, skill..."
                value={searchFilterKeyword}
                onChange={(e) => setSearchFilterKeyword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Match Strength Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['ALL', 'Strong Match', 'Good Match', 'Possible Match'].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedMatchFilter(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedMatchFilter === category
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {category === 'ALL' ? 'All Matches' : category}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="matchScore_desc">Highest Match First</option>
                <option value="matchScore_asc">Lowest Match First</option>
                <option value="company">Company Name (A-Z)</option>
              </select>
            </div>
          </div>
        )}

        {/* Section: Dynamic States */}

        {/* 1. Searching Skeleton State */}
        {loading && <OpportunitySkeleton count={4} />}

        {/* 2. Error / Retry State */}
        {!loading && error && (
          <EmptyState
            type="error"
            errorMessage={error}
            onRetry={handleFindOpportunities}
          />
        )}

        {/* 3. Before Search State */}
        {!loading && !hasSearched && !error && (
          <EmptyState
            type="before_search"
            hasProfile={hasProfileContext}
            onRetry={handleFindOpportunities}
          />
        )}

        {/* 4. Results List */}
        {!loading && hasSearched && !error && filteredOpportunities.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Showing {filteredOpportunities.length} of {opportunities.length} live opportunities
              </span>
              <span className="text-[11px] text-slate-500">
                Sorted by AI Match Score
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredOpportunities.map((opp, idx) => (
                <OpportunityCard
                  key={`${opp.url}-${idx}`}
                  opportunity={opp}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. No Results State (Search executed but 0 results returned or filters narrowed down to 0) */}
        {!loading && hasSearched && !error && filteredOpportunities.length === 0 && (
          <EmptyState
            type="no_results"
            onRetry={handleFindOpportunities}
          />
        )}
      </main>
    </div>
  );
}
