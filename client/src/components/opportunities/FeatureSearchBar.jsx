import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Laptop,
  Briefcase,
  GraduationCap,
  Plus,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function FeatureSearchBar({
  user,
  onSearch,
  loading = false
}) {
  const [activeTab, setActiveTab] = useState('resume'); // 'resume' | 'custom'
  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(user?.preferredRoles?.[0] || '');
  const [location, setLocation] = useState(user?.location || 'India');
  const [workMode, setWorkMode] = useState(user?.workMode || 'Any');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Student');
  
  // Suggested skills from parsed resume or defaults
  const parsedSkills = [
    ...(user?.candidateProfile?.programmingLanguages || []),
    ...(user?.candidateProfile?.frameworks || []),
    ...(user?.candidateProfile?.skills || [])
  ];
  
  const [selectedSkills, setSelectedSkills] = useState(
    parsedSkills.slice(0, 5)
  );
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddSkill = (skillToAdd) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleExecuteSearch = (e) => {
    if (e) e.preventDefault();
    
    if (activeTab === 'resume') {
      // Clean resume match
      onSearch({
        preferredRoles: user?.preferredRoles || [],
        location: user?.location || 'India',
        workMode: user?.workMode || 'Any',
        experienceLevel: user?.experienceLevel || 'Student'
      });
    } else {
      // Custom feature search
      onSearch({
        query: query.trim() || undefined,
        skills: selectedSkills,
        preferredRoles: selectedRole ? [selectedRole] : (user?.preferredRoles || []),
        location: location || 'India',
        workMode: workMode || 'Any',
        experienceLevel: experienceLevel || 'Student'
      });
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl shadow-slate-950/60 space-y-5">
      {/* Mode Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'resume'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Match</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Feature-Based Search</span>
          </button>
        </div>

        <div className="text-xs text-slate-400">
          {activeTab === 'resume' ? (
            <span>Automatically searching using skills extracted from your resume</span>
          ) : (
            <span>Customize target skills, roles, location and work mode</span>
          )}
        </div>
      </div>

      {/* Mode 1: AI Resume Match View */}
      {activeTab === 'resume' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                Targeting: {user?.preferredRoles?.join(', ') || 'Software Engineer Intern'}
              </h4>
              <p className="text-xs text-slate-400">
                Location: <strong className="text-slate-300">{user?.location || 'India'}</strong> • Work Mode: <strong className="text-slate-300">{user?.workMode || 'Any'}</strong> • Level: <strong className="text-slate-300">{user?.experienceLevel || 'Student'}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleExecuteSearch}
              disabled={loading}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 text-slate-950 hover:bg-emerald-300 active:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Finding Best Matches...' : 'Find Matches From Resume'}</span>
            </button>
          </div>

          {/* Extracted Resume Skills Tags */}
          {parsedSkills.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-medium">Matched Resume Skills:</span>
              {parsedSkills.slice(0, 8).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Custom Feature-Based Search View */}
      {activeTab === 'custom' && (
        <form onSubmit={handleExecuteSearch} className="space-y-4">
          {/* Main Keyword / Role Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="relative md:col-span-8">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search specific roles or keywords (e.g. AI Engineer Intern, Full Stack Developer, Python Data Analyst)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Searching...' : 'Search Live Jobs'}</span>
              </button>
            </div>
          </div>

          {/* Quick Expandable Criteria */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  Target Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. India, Bengaluru, Remote, USA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Work Mode */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Laptop className="w-3 h-3 text-slate-500" />
                  Work Mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Any">Any Work Mode</option>
                  <option value="Remote">Remote Only</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-slate-500" />
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Student">Student / Internship</option>
                  <option value="Fresher">Fresher (New Grad)</option>
                  <option value="0–1 years">0–1 years</option>
                  <option value="1–3 years">1–3 years</option>
                </select>
              </div>
            </div>

            {/* Target Skills Tags */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Target Skill Filters ({selectedSkills.length})</span>
                <span className="text-[10px] text-slate-500 normal-case">Add skills you want the jobs to match</span>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                {selectedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-emerald-400/60 hover:text-emerald-300 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Add Custom Skill */}
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(customSkillInput);
                      }
                    }}
                    placeholder="+ Add skill..."
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-28"
                  />
                  {customSkillInput.trim() && (
                    <button
                      type="button"
                      onClick={() => handleAddSkill(customSkillInput)}
                      className="px-2 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs hover:bg-slate-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
