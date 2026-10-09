import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import opportunityService from '../services/opportunityService.js';
import OpportunityCard from '../components/opportunities/OpportunityCard.jsx';
import OpportunitySkeleton from '../components/opportunities/OpportunitySkeleton.jsx';
import EmptyState from '../components/opportunities/EmptyState.jsx';
import SearchButton from '../components/opportunities/SearchButton.jsx';
import OpportunityFilters from '../components/opportunities/OpportunityFilters.jsx';
import FeatureSearchBar from '../components/opportunities/FeatureSearchBar.jsx';
import {
  Compass,
  Sparkles,
  LogOut,
  Tag,
  Briefcase,
  RotateCcw
} from 'lucide-react';

export default function OpportunitiesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [queries, setQueries] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Client-Side Filters & Sort State (Purely client-side, zero redundant API requests)
  const [searchKeyword, setSearchKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL, INTERNSHIP, JOB
  const [workModeFilter, setWorkModeFilter] = useState('ALL'); // ALL, REMOTE, HYBRID, ON_SITE
  const [matchScoreFilter, setMatchScoreFilter] = useState('ALL'); // ALL, 90, 80, 70
  const [sortBy, setSortBy] = useState('best_match'); // best_match, recently_found

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFindOpportunities = async (customPayload) => {
    setLoading(true);
    setError('');

    // Ensure customPayload is a clean object, not a React SyntheticEvent or DOM Event
    const isEvent = customPayload && (customPayload.nativeEvent || customPayload.target || customPayload._reactName || typeof customPayload.preventDefault === 'function');
    const safePayload = (customPayload && typeof customPayload === 'object' && !isEvent) ? customPayload : {};

    try {
      const response = await opportunityService.searchOpportunities(safePayload);
      if (response.success) {
        setQueries(response.queries || []);
        // Attach original index for stable "Recently Found" sorting
        const rawOpps = (response.opportunities || []).map((opp, idx) => ({
          ...opp,
          _originalIndex: idx
        }));
        setOpportunities(rawOpps);
        setHasSearched(true);
        try {
          sessionStorage.setItem('careerlens_opportunities', JSON.stringify(rawOpps));
        } catch (e) {
          // ignore sessionStorage write errors
        }
      } else {
        setError(response.message || 'Unable to discover opportunities.');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to reach the backend server. Please check your internet connection.' : err.message) ||
        "We couldn't find opportunities at the moment. Please try again shortly.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setTypeFilter('ALL');
    setWorkModeFilter('ALL');
    setMatchScoreFilter('ALL');
    setSortBy('best_match');
  };

  const hasProfileContext = Boolean(
    user?.candidateProfile ||
    (user?.preferredRoles && user.preferredRoles.length > 0) ||
    user?.resumePath
  );

  // Filter & Sort Pipeline
  const filteredOpportunities = useMemo(() => {
    let list = [...opportunities];

    // 1. Text Search across title, company, skills
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase().trim();
      list = list.filter((opp) => {
        const titleMatch = (opp.title || '').toLowerCase().includes(kw);
        const companyMatch = (opp.company || '').toLowerCase().includes(kw);
        const locationMatch = (opp.location || '').toLowerCase().includes(kw);
        const matchingSkillMatch = (opp.matchingSkills || []).some((s) => s.toLowerCase().includes(kw));
        const missingSkillMatch = (opp.missingSkills || []).some((s) => s.toLowerCase().includes(kw));
        const descMatch = (opp.description || '').toLowerCase().includes(kw);
        return titleMatch || companyMatch || locationMatch || matchingSkillMatch || missingSkillMatch || descMatch;
      });
    }

    // 2. Type Filter (All, Internship, Job)
    if (typeFilter === 'INTERNSHIP') {
      list = list.filter((opp) => {
        const text = `${opp.title || ''} ${opp.jobType || ''}`.toLowerCase();
        return opp.jobType === 'Internship' || text.includes('intern') || text.includes('internship') || text.includes('trainee') || text.includes('co-op');
      });
    } else if (typeFilter === 'JOB') {
      list = list.filter((opp) => {
        const text = `${opp.title || ''} ${opp.jobType || ''}`.toLowerCase();
        return opp.jobType === 'Full-time' || opp.jobType === 'Part-time' || (!text.includes('intern') && !text.includes('internship'));
      });
    }

    // 3. Work Mode Filter (All, Remote, Hybrid, On-site)
    if (workModeFilter === 'REMOTE') {
      list = list.filter((opp) => {
        const text = `${opp.title || ''} ${opp.workMode || ''} ${opp.location || ''}`.toLowerCase();
        return opp.workMode === 'Remote' || text.includes('remote');
      });
    } else if (workModeFilter === 'HYBRID') {
      list = list.filter((opp) => {
        const text = `${opp.title || ''} ${opp.workMode || ''} ${opp.location || ''}`.toLowerCase();
        return opp.workMode === 'Hybrid' || text.includes('hybrid');
      });
    } else if (workModeFilter === 'ON_SITE') {
      list = list.filter((opp) => {
        const text = `${opp.title || ''} ${opp.workMode || ''} ${opp.location || ''}`.toLowerCase();
        return opp.workMode === 'On-site' || (!text.includes('remote') && !text.includes('hybrid'));
      });
    }

    // 4. Match Score Filter (90%+, 80%+, 70%+)
    if (matchScoreFilter === '90') {
      list = list.filter((opp) => (opp.matchScore ?? 0) >= 90);
    } else if (matchScoreFilter === '80') {
      list = list.filter((opp) => (opp.matchScore ?? 0) >= 80);
    } else if (matchScoreFilter === '70') {
      list = list.filter((opp) => (opp.matchScore ?? 0) >= 70);
    }

    // 5. Sorting (Best Match, Recently Found)
    if (sortBy === 'best_match') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'recently_found') {
      list.sort((a, b) => (a._originalIndex ?? 0) - (b._originalIndex ?? 0));
    }

    return list;
  }, [opportunities, searchKeyword, typeFilter, workModeFilter, matchScoreFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900">CareerLens</span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
              Live Opportunities
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-stone-300 transition-colors shadow-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-stone-300 transition-colors shadow-sm"
            >
              Profile
            </Link>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors shadow-sm cursor-pointer"
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
        <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2.5 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real-Time Web Intelligence & Vertex AI Matching</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Opportunities matched to you
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Based on your skills, preferences and resume.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <SearchButton
              onClick={() => handleFindOpportunities()}
              loading={loading}
              hasSearched={hasSearched}
              disabled={!hasProfileContext}
            />
          </div>

          {/* Subtle background glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Feature-Based Search Bar */}
        <FeatureSearchBar
          user={user}
          onSearch={(payload) => handleFindOpportunities(payload)}
          loading={loading}
        />

        {/* AI Query Indicator Pills */}
        {queries.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Google Cloud Vertex AI generated focused searches:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {queries.map((q, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-50 border border-stone-200 text-slate-800 text-xs font-mono"
                >
                  <Tag className="w-3 h-3 text-emerald-600" />
                  "{q}"
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Client-Side Quick Filter & Sort Controls (Always available after searching with results) */}
        {!loading && hasSearched && opportunities.length > 0 && (
          <OpportunityFilters
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            workModeFilter={workModeFilter}
            onWorkModeFilterChange={setWorkModeFilter}
            matchScoreFilter={matchScoreFilter}
            onMatchScoreFilterChange={setMatchScoreFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onResetFilters={handleResetFilters}
            totalCount={opportunities.length}
            filteredCount={filteredOpportunities.length}
          />
        )}

        {/* Dynamic States */}

        {/* 1. Searching Skeleton State */}
        {loading && <OpportunitySkeleton count={4} />}

        {/* 2. Error / Retry State */}
        {!loading && error && (
          <EmptyState
            type="error"
            errorMessage={error}
            onRetry={() => handleFindOpportunities()}
          />
        )}

        {/* 3. Before Search State */}
        {!loading && !hasSearched && !error && (
          <EmptyState
            type="before_search"
            hasProfile={hasProfileContext}
            onRetry={() => handleFindOpportunities()}
          />
        )}

        {/* 4. Results List (when matches exist) */}
        {!loading && hasSearched && !error && filteredOpportunities.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600 px-1">
              <span>
                Showing {filteredOpportunities.length} of {opportunities.length} live opportunities
              </span>
              <span className="text-[11px] text-slate-500">
                {sortBy === 'best_match' ? 'Sorted by Best Match' : 'Sorted by Recently Found'}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredOpportunities.map((opp, idx) => (
                <OpportunityCard
                  key={`${opp.url}-${opp._originalIndex ?? idx}`}
                  opportunity={opp}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Filtered Empty State (Search executed, raw results exist, but active filters filtered everything out) */}
        {!loading && hasSearched && !error && opportunities.length > 0 && filteredOpportunities.length === 0 && (
          <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-600">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">No Opportunities Match Your Filters</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                No opportunities in the retrieved list matched your search keywords or filter criteria. Try resetting or adjusting your filters.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. Raw No Results State (Search executed and backend returned 0 opportunities) */}
        {!loading && hasSearched && !error && opportunities.length === 0 && (
          <EmptyState
            type="no_results"
            onRetry={() => handleFindOpportunities()}
          />
        )}
      </main>
    </div>
  );
}
