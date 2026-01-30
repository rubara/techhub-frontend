'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store';
import { useAuthStore } from '@/store';
import { colors } from '@/lib/colors';
import { login } from '@/lib/auth-api';
import { useProtectedRoute } from '@/hooks/use-protected-route';

export default function LoginPage() {
  const router = useRouter();
  const { isDark, language } = useUIStore();
  const { setAuth, setLoading } = useAuthStore();

  // Redirect if already authenticated
  useProtectedRoute({ redirectIfAuthenticated: true });

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    setError('');

    const { data, error: loginError } = await login(formData.identifier, formData.password);

    if (loginError) {
      setError(
        language === 'bg'
          ? 'Невалиден имейл или парола'
          : 'Invalid email or password'
      );
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    if (data) {
      setAuth(data.user, data.jwt);
      router.push('/account');
    }

    setIsSubmitting(false);
    setLoading(false);
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Вход' : 'Login'}
          </h1>
          <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg'
              ? 'Влезте в профила си'
              : 'Sign in to your account'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl text-center"
            style={{
              background: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Имейл' : 'Email'}
            </label>
            <input
              type="email"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                color: isDark ? colors.white : colors.midnightBlack,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              }}
              placeholder={language === 'bg' ? 'Вашият имейл' : 'Your email'}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Парола' : 'Password'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                color: isDark ? colors.white : colors.midnightBlack,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm hover:underline"
              style={{ color: colors.forestGreen }}
            >
              {language === 'bg' ? 'Забравена парола?' : 'Forgot password?'}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
            style={{
              background: colors.forestGreen,
              color: colors.white,
            }}
          >
            {isSubmitting
              ? language === 'bg'
                ? 'Влизане...'
                : 'Signing in...'
              : language === 'bg'
              ? 'Вход'
              : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div
            className="flex-1 h-px"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />
          <span
            className="text-sm"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {language === 'bg' ? 'или' : 'or'}
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          />
        </div>

        {/* Register Link */}
        <p
          className="text-center"
          style={{ color: isDark ? colors.gray : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Нямате акаунт? ' : "Don't have an account? "}
          <Link
            href="/register"
            className="font-semibold hover:underline"
            style={{ color: colors.forestGreen }}
          >
            {language === 'bg' ? 'Регистрация' : 'Register'}
          </Link>
        </p>
      </div>
    </main>
  );
}
