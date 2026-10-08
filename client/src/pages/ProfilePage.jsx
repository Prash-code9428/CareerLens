import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  ArrowLeft,
  Save,
  Compass,
  Check
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import profileService from '../services/profileService.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import FormError from '../components/FormError.jsx';
import ProfileSkeleton from '../components/common/ProfileSkeleton.jsx';
import PageError from '../components/common/PageError.jsx';
import InlineAlert from '../components/common/InlineAlert.jsx';

const WORK_MODES = ['Any', 'Remote', 'Hybrid', 'On-site'];
const EXPERIENCE_LEVELS = ['Student', 'Fresher', '0–1 years', '1–3 years'];

const POPULAR_ROLES = [
  'Software Engineer Intern',
  'Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'Data Analyst',
  'AI / ML Engineer',
  'DevOps Engineer'
];

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    education: {
      university: '',
      degree: '',
      major: '',
      graduationYear: ''
    },
    preferredRoles: [],
    workMode: 'Any',
    experienceLevel: 'Student'
  });

  const [newRoleInput, setNewRoleInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchError, setFetchError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const data = await profileService.getProfile();
      if (data.success && data.user) {
        const u = data.user;
        setFormData({
          name: u.name || '',
          email: u.email || '',
          location: u.location || '',
          education: {
            university: u.education?.university || '',
            degree: u.education?.degree || '',
            major: u.education?.major || '',
            graduationYear: u.education?.graduationYear || ''
          },
          preferredRoles: Array.isArray(u.preferredRoles) ? u.preferredRoles : [],
          workMode: u.workMode || 'Any',
          experienceLevel: u.experienceLevel || 'Student'
        });
      }
    } catch (err) {
      setFetchError(
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to reach the server. Please check your internet connection.' : err.message) ||
        'Unable to load your profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Load profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Compute profile completion percentage based on real fields
  const computeCompletion = () => {
    let score = 0;
    const totalWeights = 6;

    if (formData.name?.trim()) score++;
    if (formData.location?.trim()) score++;
    if (formData.education?.university?.trim() || formData.education?.degree?.trim()) score++;
    if (formData.preferredRoles?.length > 0) score++;
    if (formData.workMode) score++;
    if (formData.experienceLevel) score++;

    return Math.round((score / totalWeights) * 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [name]: value
      }
    }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const addRole = (roleToAdd) => {
    const role = (roleToAdd || newRoleInput).trim();
    if (role && !formData.preferredRoles.includes(role)) {
      setFormData((prev) => ({
        ...prev,
        preferredRoles: [...prev.preferredRoles, role]
      }));
      setNewRoleInput('');
      setSuccessMessage('');
    }
  };

  const removeRole = (roleToRemove) => {
    setFormData((prev) => ({
      ...prev,
      preferredRoles: prev.preferredRoles.filter((r) => r !== roleToRemove)
    }));
    setSuccessMessage('');
  };

  const handleRoleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRole();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name?.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        education: {
          university: formData.education.university.trim(),
          degree: formData.education.degree.trim(),
          major: formData.education.major.trim(),
          graduationYear: formData.education.graduationYear.trim()
        },
        preferredRoles: formData.preferredRoles,
        workMode: formData.workMode,
        experienceLevel: formData.experienceLevel
      };

      const data = await profileService.updateProfile(payload);
      if (data.success && data.user) {
        setUser(data.user);
        setSuccessMessage('Your candidate profile has been saved successfully.');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const completionPercent = computeCompletion();

  if (fetchError) {
    return (
      <PageError
        title="Unable to load your profile"
        message={fetchError}
        onRetry={fetchProfile}
        backTo="/dashboard"
        backLabel="Back to Dashboard"
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">CareerLens Profile</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
        
        {/* Page Title & Profile Completion Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Placement Profile
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Complete your educational background and career preferences to guide Vertex AI job matching and research.
            </p>
          </div>

          {/* Profile Completion Widget */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {completionPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400">
              {completionPercent >= 80
                ? 'Great job! Your profile is well-detailed for role discovery.'
                : 'Fill in your education and target roles for optimal matching.'}
            </p>
          </div>
        </div>

        {/* Success / Error Feedback */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && <FormError message={errorMessage} />}

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Editable Profile Sections */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Section 1: Basic Information */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <User className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="profile-name"
                    name="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Prashant Sharma"
                    required
                  />

                  <Input
                    id="profile-email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    disabled
                    helperText="Email is managed through your login account"
                  />

                  <div className="sm:col-span-2">
                    <Input
                      id="profile-location"
                      name="location"
                      label="Current Location / City"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Bangalore, Karnataka, India"
                      icon={MapPin}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Education */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Education Details</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      id="edu-university"
                      name="university"
                      label="University / College"
                      value={formData.education.university}
                      onChange={handleEducationChange}
                      placeholder="e.g. National Institute of Technology"
                    />
                  </div>

                  <Input
                    id="edu-degree"
                    name="degree"
                    label="Degree"
                    value={formData.education.degree}
                    onChange={handleEducationChange}
                    placeholder="e.g. B.Tech / B.E. / B.Sc"
                  />

                  <Input
                    id="edu-major"
                    name="major"
                    label="Major / Branch"
                    value={formData.education.major}
                    onChange={handleEducationChange}
                    placeholder="e.g. Computer Science & Engineering"
                  />

                  <Input
                    id="edu-year"
                    name="graduationYear"
                    label="Graduation Year"
                    value={formData.education.graduationYear}
                    onChange={handleEducationChange}
                    placeholder="e.g. 2026"
                  />
                </div>
              </div>

              {/* Section 3: Career Preferences */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Career & Role Preferences</h2>
                </div>

                {/* Work Mode Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Work Mode Preference
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {WORK_MODES.map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, workMode: mode }));
                          setSuccessMessage('');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          formData.workMode === mode
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, experienceLevel: level }));
                          setSuccessMessage('');
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          formData.experienceLevel === level
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Roles Manager */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">
                    Preferred Target Roles (Multiple)
                  </label>

                  {/* Input with Add button */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRoleInput}
                      onChange={(e) => setNewRoleInput(e.target.value)}
                      onKeyDown={handleRoleKeyDown}
                      placeholder="Add a target role (e.g. Backend Engineer)"
                      className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => addRole()}
                      disabled={!newRoleInput.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {/* Active selected roles tags */}
                  <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
                    {formData.preferredRoles.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">
                        No target roles added yet. Choose from suggestions below or type your own.
                      </p>
                    ) : (
                      formData.preferredRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                        >
                          {role}
                          <button
                            type="button"
                            onClick={() => removeRole(role)}
                            className="hover:text-rose-400 transition-colors"
                            aria-label={`Remove ${role}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Suggested roles pills */}
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Suggested Roles:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_ROLES.map((role) => {
                        const isSelected = formData.preferredRoles.includes(role);
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => (isSelected ? removeRole(role) : addRole(role))}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
                              isSelected
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                            {role}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <Link
                  to="/dashboard"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={saving}
                  icon={Save}
                >
                  Save Profile
                </Button>
              </div>

            </div>

            {/* Right 1 Column: Resume & AI Status Cards */}
            <div className="space-y-6">
              
              {/* Status 1: Resume Status */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Resume Document</h3>
                    <p className="text-[11px] text-slate-400">Supabase Storage</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>No Resume Uploaded</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Resume upload and storage integration will be enabled in the upcoming resume ingestion phase.
                  </p>
                </div>
              </div>

              {/* Status 2: AI Profile Status */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Candidate Profile</h3>
                    <p className="text-[11px] text-slate-400">Google Cloud Vertex AI</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Awaiting Resume Analysis</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Structured skill extraction and project evaluation will automatically run with Vertex AI once your resume is uploaded.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </form>
        </>
        )}

      </main>
    </div>
  );
}
