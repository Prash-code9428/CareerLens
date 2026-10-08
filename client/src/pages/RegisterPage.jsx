import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, UserPlus } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Button from '../components/Button.jsx';
import FormError from '../components/FormError.jsx';
import useAuth from '../hooks/useAuth.js';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    const nameTrimmed = formData.name.trim();
    const emailTrimmed = formData.email.trim();

    if (!nameTrimmed) {
      newErrors.name = 'Full name is required';
    } else if (nameTrimmed.length < 2) {
      newErrors.name = 'Full name must be at least 2 characters';
    }

    if (!emailTrimmed) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
    if (formError) {
      setFormError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Unable to reach backend server. Please ensure the API is running.' : err.message) ||
        'Registration failed. Please try again.';
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  const isFormIncomplete =
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password ||
    !formData.confirmPassword;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join CareerLens to get tailored, AI-verified placement matches."
      footerLinkText="Already have an account?"
      footerLinkTo="/login"
      footerLinkAction="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <FormError message={formError} />}

        <Input
          id="register-name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="Alex Sharma"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          autoComplete="name"
          disabled={loading}
          icon={User}
        />

        <Input
          id="register-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="alex@university.edu"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
          disabled={loading}
          icon={Mail}
        />

        <PasswordInput
          id="register-password"
          name="password"
          label="Password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helperText={!errors.password ? 'Must be at least 6 characters' : undefined}
          required
          autoComplete="new-password"
          disabled={loading}
        />

        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          disabled={loading}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
            disabled={isFormIncomplete}
            icon={UserPlus}
          >
            Create Account
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
