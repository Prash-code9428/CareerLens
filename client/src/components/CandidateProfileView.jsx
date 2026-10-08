import React from 'react';
import {
  Sparkles,
  Code2,
  Layers,
  Database,
  Wrench,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Compass,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';

export default function CandidateProfileView({ profile, onReanalyze, isAnalyzing }) {
  if (!profile) return null;

  const {
    summary,
    skills = [],
    programmingLanguages = [],
    frameworks = [],
    databases = [],
    tools = [],
    projects = [],
    experience = [],
    education = [],
    certifications = [],
    preferredRoles = [],
    experienceLevel = 'Student',
    analyzedAt
  } = profile;

  return (
    <div className="space-y-6 text-left">
      {/* AI Header Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI-assisted profile • Generated with Google Cloud Vertex AI
          </div>
          <p className="text-xs text-slate-400">
            Structured candidate intelligence extracted from your verified resume document.
          </p>
        </div>

        {onReanalyze && (
          <button
            type="button"
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Re-analyze Resume'}</span>
          </button>
        )}
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Professional Summary
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Recommended Roles & Experience Level */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Recommended Target Roles</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {preferredRoles.length > 0 ? (
              preferredRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">General Software Engineering</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Classified Experience Level</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{experienceLevel}</span>
          </div>
        </div>
      </div>

      {/* Categorized Technical Skills */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          Technical Skill Stack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Programming Languages */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              Programming Languages
            </p>
            <div className="flex flex-wrap gap-1.5">
              {programmingLanguages.length > 0 ? (
                programmingLanguages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None detected</span>
              )}
            </div>
          </div>

          {/* Frameworks & Libraries */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              Frameworks & Libraries
            </p>
            <div className="flex flex-wrap gap-1.5">
              {frameworks.length > 0 ? (
                frameworks.map((fw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    {fw}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None detected</span>
              )}
            </div>
          </div>

          {/* Databases & Storage */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              Databases & Storage
            </p>
            <div className="flex flex-wrap gap-1.5">
              {databases.length > 0 ? (
                databases.map((db, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    {db}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None detected</span>
              )}
            </div>
          </div>

          {/* Tools & Platforms */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              Tools & Platforms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tools.length > 0 ? (
                tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    {tool}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None detected</span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Projects Extracted */}
      {projects.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            Key Projects & Engineering Work
          </h3>

          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work & Internship Experience */}
      {experience.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Internship & Work Experience
          </h3>

          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                  {exp.duration && (
                    <span className="text-xs text-slate-500">{exp.duration}</span>
                  )}
                </div>
                <p className="text-xs font-semibold text-emerald-400">{exp.company}</p>
                {exp.description && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Education */}
        {education.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Academic Background
            </h3>
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <p className="font-bold text-white">{edu.institution}</p>
                  <p className="text-slate-300">
                    {edu.degree} {edu.major ? `• ${edu.major}` : ''}
                  </p>
                  {edu.graduationYear && (
                    <p className="text-slate-500 text-[11px]">Class of {edu.graduationYear}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Certifications & Training
            </h3>
            <div className="space-y-1.5">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
