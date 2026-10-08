import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  ExternalLink,
  Sparkles,
  Globe,
  Clock
} from 'lucide-react';
import MatchScore from './MatchScore.jsx';
import SkillBadge from './SkillBadge.jsx';

export default function OpportunityCard({ opportunity }) {
  if (!opportunity) return null;

  const {
    title,
    company,
    location,
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

  const oppId = btoa(encodeURIComponent(url || '')).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);

  // Derive job type or work mode if explicitly mentioned in title without fabricating
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
    if (lowerTitle.includes('remote') || (location && location.toLowerCase().includes('remote'))) {
      displayWorkMode = 'Remote';
    } else if (lowerTitle.includes('hybrid') || (location && location.toLowerCase().includes('hybrid'))) {
      displayWorkMode = 'Hybrid';
    }
  }

  return (
    <div className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between gap-5 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 selection:bg-emerald-500 selection:text-slate-950">
      <div className="space-y-4">
        {/* Header: Title & Match Score */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <Link
              to={`/opportunities/${oppId}`}
              state={{ opportunity }}
              className="block group/title"
            >
              <h3 className="text-base sm:text-lg font-bold text-white group-hover/title:text-emerald-300 transition-colors leading-snug line-clamp-2">
                {title}
              </h3>
            </Link>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
              {company && (
                <span className="inline-flex items-center gap-1.5 text-slate-200 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{company}</span>
                </span>
              )}

              {location && (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{location}</span>
                </span>
              )}

              {displayWorkMode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                  {displayWorkMode}
                </span>
              )}

              {displayJobType && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/10 border border-teal-500/20 text-teal-300">
                  <Clock className="w-3 h-3 text-teal-400" />
                  <span>{displayJobType}</span>
                </span>
              )}
            </div>
          </div>

          {/* Match Score Indicator */}
          <div className="shrink-0 pt-0.5">
            <MatchScore score={matchScore} recommendation={recommendation} />
          </div>
        </div>

        {/* AI Alignment & Reason Box */}
        {(reason || matchingSkills.length > 0 || missingSkills.length > 0) && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-3">
            {reason && (
              <div className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold text-slate-200">Why this matches: </strong>
                  {reason}
                </span>
              </div>
            )}

            {/* Matching Skills */}
            {matchingSkills.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Matching Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matchingSkills.map((skill, sIdx) => (
                    <SkillBadge key={sIdx} skill={skill} type="matching" />
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gaps */}
            {missingSkills.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                  Skill Gaps
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((skill, sIdx) => (
                    <SkillBadge key={sIdx} skill={skill} type="gap" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Snippet Description if available */}
        {description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Footer: Source Domain and Actions */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[120px] sm:max-w-[160px]">
            {source || 'Hiring Portal'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/opportunities/${btoa(encodeURIComponent(url)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24)}`}
            state={{ opportunity }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Details
          </Link>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:bg-emerald-500 transition-colors shadow-sm cursor-pointer group-hover:shadow-emerald-500/10"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
