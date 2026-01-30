'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useUIStore, useAuthStore } from '@/store';
import { colors } from '@/lib/colors';
import { register } from '@/lib/auth-api';
import { useProtectedRoute } from '@/hooks/use-protected-route';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
    onTurnstileLoad: () => void;
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { isDark, language } = useUIStore();
  const { setAuth, setLoading } = useAuthStore();

  // Redirect if already authenticated
  useProtectedRoute({ redirectIfAuthenticated: true });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Turnstile when script loads
  useEffect(() => {
    window.onTurnstileLoad = () => {
      setTurnstileLoaded(true);
      if (turnstileContainerRef.current && !turnstileWidgetId.current) {
        turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          theme: isDark ? 'dark' : 'light',
          callback: (token: string) => {
            setTurnstileToken(token);
            if (errors.captcha) {
              setErrors((prev) => ({ ...prev, captcha: '' }));
            }
          },
          'expired-callback': () => {
            setTurnstileToken(null);
          },
          'error-callback': () => {
            setTurnstileToken(null);
          },
        });
      }
    };

    // If turnstile already loaded (e.g., navigating back)
    if (window.turnstile && turnstileContainerRef.current && !turnstileWidgetId.current) {
      window.onTurnstileLoad();
    }

    return () => {
      turnstileWidgetId.current = null;
    };
  }, [isDark, errors.captcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'bg' ? 'Името е задължително' : 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'bg' ? 'Фамилията е задължителна' : 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'bg' ? 'Имейлът е задължителен' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'bg' ? 'Невалиден имейл' : 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = language === 'bg' ? 'Паролата е задължителна' : 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = language === 'bg' ? 'Паролата трябва да е поне 6 символа' : 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'bg' ? 'Паролите не съвпадат' : 'Passwords do not match';
    }

    // Check Turnstile token
    if (!turnstileToken) {
      newErrors.captcha = language === 'bg' ? 'Моля, потвърдете, че не сте робот' : 'Please verify you are not a robot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);

    const { data, error } = await register(
      formData.email,
      formData.email,
      formData.password,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
      }
    );

    if (error) {
      if (error.message.includes('already taken') || error.message.includes('unique')) {
        setErrors({
          email: language === 'bg' ? 'Този имейл вече е регистриран' : 'This email is already registered',
        });
      } else {
        setErrors({
          general: error.message,
        });
      }

      // Reset Turnstile on error
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId.current);
        setTurnstileToken(null);
      }

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

  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    color: isDark ? colors.white : colors.midnightBlack,
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
  };

  const errorInputStyle = {
    ...inputStyle,
    border: '1px solid #ef4444',
  };

  return (
    <>
      {/* Load Turnstile Script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad"
        strategy="lazyOnload"
      />

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
              {language === 'bg' ? 'Регистрация' : 'Register'}
            </h1>
            <p style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg'
                ? 'Създайте нов акаунт'
                : 'Create a new account'}
            </p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div
              className="mb-6 p-4 rounded-xl text-center"
              style={{
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? colors.white : colors.midnightBlack }}
                >
                  {language === 'bg' ? 'Име' : 'First Name'}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={errors.firstName ? errorInputStyle : inputStyle}
                  placeholder={language === 'bg' ? 'Иван' : 'John'}
                />
                {errors.firstName && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? colors.white : colors.midnightBlack }}
                >
                  {language === 'bg' ? 'Фамилия' : 'Last Name'}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={errors.lastName ? errorInputStyle : inputStyle}
                  placeholder={language === 'bg' ? 'Иванов' : 'Doe'}
                />
                {errors.lastName && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

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
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={errors.email ? errorInputStyle : inputStyle}
                placeholder={language === 'bg' ? 'Вашият имейл' : 'Your email'}
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                  {errors.email}
                </p>
              )}
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
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={errors.password ? errorInputStyle : inputStyle}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Потвърди паролата' : 'Confirm Password'}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={errors.confirmPassword ? errorInputStyle : inputStyle}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Turnstile CAPTCHA */}
            <div className="flex flex-col items-center">
              <div ref={turnstileContainerRef} />
              {errors.captcha && (
                <p className="text-xs mt-2" style={{ color: '#ef4444' }}>
                  {errors.captcha}
                </p>
              )}
            </div>

            {/* Terms */}
            <p
              className="text-xs"
              style={{ color: isDark ? colors.gray : colors.midnightBlack }}
            >
              {language === 'bg'
                ? 'С регистрацията се съгласявате с нашите '
                : 'By registering, you agree to our '}
              <Link href="/terms" className="underline" style={{ color: colors.forestGreen }}>
                {language === 'bg' ? 'Общи условия' : 'Terms of Service'}
              </Link>
              {language === 'bg' ? ' и ' : ' and '}
              <Link href="/privacy" className="underline" style={{ color: colors.forestGreen }}>
                {language === 'bg' ? 'Политика за поверителност' : 'Privacy Policy'}
              </Link>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !turnstileToken}
              className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: colors.forestGreen,
                color: colors.white,
              }}
            >
              {isSubmitting
                ? language === 'bg'
                  ? 'Регистриране...'
                  : 'Registering...'
                : language === 'bg'
                ? 'Регистрация'
                : 'Register'}
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

          {/* Login Link */}
          <p
            className="text-center"
            style={{ color: isDark ? colors.gray : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Вече имате акаунт? ' : 'Already have an account? '}
            <Link
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: colors.forestGreen }}
            >
              {language === 'bg' ? 'Вход' : 'Login'}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
