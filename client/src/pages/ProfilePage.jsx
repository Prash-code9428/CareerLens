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
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 border-b border-stone-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-stone-300 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900">CareerLens Profile</span>
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Placement Profile
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Complete your educational background and career preferences to guide Vertex AI job matching and research.
            </p>
          </div>

          {/* Profile Completion Widget */}
          <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Profile Completion
              </span>
              <span className="text-sm font-bold text-emerald-700 font-mono">
                {completionPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-500">
              {completionPercent >= 80
                ? 'Great job! Your profile is well-detailed for role discovery.'
                : 'Fill in your education and target roles for optimal matching.'}
            </p>
          </div>
        </div>

        {/* Success / Error Feedback */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
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
              <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                  <User className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">Basic Information</h2>
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
              <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">Education Details</h2>
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
              <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900">Career & Role Preferences</h2>
                </div>

                {/* Work Mode Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
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
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          formData.workMode === mode
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-1 ring-emerald-600/30'
                            : 'bg-white border-stone-200 text-slate-700 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
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
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          formData.experienceLevel === level
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm ring-1 ring-emerald-600/30'
                            : 'bg-white border-stone-200 text-slate-700 hover:border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Roles Manager */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
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
                      className="flex-1 rounded-xl bg-white border border-stone-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => addRole()}
                      disabled={!newRoleInput.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed border border-stone-300 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  {/* Active selected roles tags */}
                  <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
                    {formData.preferredRoles.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">
                        No target roles added yet. Choose from suggestions below or type your own.
                      </p>
                    ) : (
                      formData.preferredRoles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800"
                        >
                          {role}
                          <button
                            type="button"
                            onClick={() => removeRole(role)}
                            className="hover:text-rose-600 transition-colors cursor-pointer"
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
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-white border-stone-200 text-slate-600 hover:text-slate-900 hover:border-stone-300 shadow-sm'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-emerald-600" />}
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
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900"
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
              <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Resume Document</h3>
                    <p className="text-[11px] text-slate-500">Supabase Storage</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>No Resume Uploaded</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Resume upload and storage integration will be enabled in the upcoming resume ingestion phase.
                  </p>
                </div>
              </div>

              {/* Status 2: AI Profile Status */}
              <div className="rounded-2xl bg-white border border-stone-200/90 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">AI Candidate Profile</h3>
                    <p className="text-[11px] text-slate-500">Google Cloud Vertex AI</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Awaiting Resume Analysis</span>
                  </div>
                  <p className="text-xs text-slate-600">
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
