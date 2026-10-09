import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  Briefcase,
  Laptop,
  Zap
} from 'lucide-react';

export default function OpportunityFilters({
  searchKeyword,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  workModeFilter,
  onWorkModeFilterChange,
  matchScoreFilter,
  onMatchScoreFilterChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  totalCount,
  filteredCount
}) {
  const isFiltered =
    searchKeyword.trim() !== '' ||
    typeFilter !== 'ALL' ||
    workModeFilter !== 'ALL' ||
    matchScoreFilter !== 'ALL' ||
    sortBy !== 'best_match';

  return (
    <div className="rounded-2xl bg-white border border-stone-200/90 p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Top Search Bar & Sort Dropdown */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, company, or skill (e.g. React, Python, Google)..."
            className="w-full bg-[#fafaf9] border border-stone-200/90 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
          <span className="text-xs font-semibold text-slate-600 hidden sm:inline flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-[#fafaf9] border border-stone-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="best_match">Best Match</option>
            <option value="recently_found">Recently Found</option>
          </select>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="pt-3 border-t border-stone-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* 1. Type Filter */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-slate-400" />
              Type
            </span>
            <div className="flex items-center bg-[#fafaf9] rounded-lg p-1 border border-stone-200/80">
              {[
                { label: 'All', value: 'ALL' },
                { label: 'Internship', value: 'INTERNSHIP' },
                { label: 'Job', value: 'JOB' }
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onTypeFilterChange(t.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    typeFilter === t.value
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Work Mode Filter */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Laptop className="w-3 h-3 text-slate-400" />
              Work Mode
            </span>
            <div className="flex items-center bg-[#fafaf9] rounded-lg p-1 border border-stone-200/80">
              {[
                { label: 'All', value: 'ALL' },
                { label: 'Remote', value: 'REMOTE' },
                { label: 'Hybrid', value: 'HYBRID' },
                { label: 'On-site', value: 'ON_SITE' }
              ].map((wm) => (
                <button
                  key={wm.value}
                  type="button"
                  onClick={() => onWorkModeFilterChange(wm.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    workModeFilter === wm.value
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {wm.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Match Score Filter */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-slate-400" />
              Match Score
            </span>
            <div className="flex items-center bg-[#fafaf9] rounded-lg p-1 border border-stone-200/80">
              {[
                { label: 'All', value: 'ALL' },
                { label: '90%+', value: '90' },
                { label: '80%+', value: '80' },
                { label: '70%+', value: '70' }
              ].map((ms) => (
                <button
                  key={ms.value}
                  type="button"
                  onClick={() => onMatchScoreFilterChange(ms.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    matchScoreFilter === ms.value
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ms.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counts & Reset Filters Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-200/60">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCount}</strong> of {totalCount}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
