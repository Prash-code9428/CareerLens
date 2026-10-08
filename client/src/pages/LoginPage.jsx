import React, { useState } from 'react';
import { Mail, LogIn } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout.jsx';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Button from '../components/Button.jsx';
import FormError from '../components/FormError.jsx';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailTrimmed = formData.email.trim();

    if (!emailTrimmed) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    // Clear individual field error on change
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
      // Backend integration hook placeholder:
      // const response = await axios.post('/api/auth/login', {
      //   email: formData.email.trim(),
      //   password: formData.password
      // });
      // For now, simulate network response delay for frontend state verification
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFormError('Backend authentication endpoint will be connected in the next phase.');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormIncomplete = !formData.email.trim() || !formData.password;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to review matched job opportunities."
      footerLinkText="Don't have an account yet?"
      footerLinkTo="/register"
      footerLinkAction="Create account"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && <FormError message={formError} />}

        <Input
          id="login-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="student@university.edu"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
          disabled={loading}
          icon={Mail}
        />

        <PasswordInput
          id="login-password"
          name="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="current-password"
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
            icon={LogIn}
          >
            Sign In
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
