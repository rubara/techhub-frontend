'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUIStore, useAuthStore } from '@/store';
import { colors } from '@/lib/colors';
import { updateProfile, changePassword, getMe } from '@/lib/auth-api';
import { useProtectedRoute } from '@/hooks/use-protected-route';

export default function ProfilePage() {
  const { isDark, language } = useUIStore();
  const { user, token, updateUser } = useAuthStore();
  const { isReady } = useProtectedRoute();

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load user data when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (!token) return;

      // Fetch fresh user data from API
      const { data } = await getMe(token);
      if (data) {
        updateUser(data);
        setProfileData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
        });
      }
    };

    if (isReady && token) {
      loadUserData();
    }
  }, [token, isReady]);

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      });
    }
  }, [user]);

  // Handle profile change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setProfileMessage({ type: '', text: '' });
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setPasswordMessage({ type: '', text: '' });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Save profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    setSavingProfile(true);
    setProfileMessage({ type: '', text: '' });

    const { data, error } = await updateProfile(token, user.id, profileData);

    if (error) {
      setProfileMessage({
        type: 'error',
        text: language === 'bg' ? 'Грешка при запазване на профила' : 'Error saving profile',
      });
    } else {
      updateUser(profileData);
      setProfileMessage({
        type: 'success',
        text: language === 'bg' ? 'Профилът е обновен успешно' : 'Profile updated successfully',
      });
    }

    setSavingProfile(false);
  };

  // Save password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    // Validate
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: 'error',
        text: language === 'bg' ? 'Паролата трябва да е поне 6 символа' : 'Password must be at least 6 characters',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({
        type: 'error',
        text: language === 'bg' ? 'Паролите не съвпадат' : 'Passwords do not match',
      });
      return;
    }

    setSavingPassword(true);
    setPasswordMessage({ type: '', text: '' });

    const { error } = await changePassword(token, passwordData.currentPassword, passwordData.newPassword);

    if (error) {
      setPasswordMessage({
        type: 'error',
        text: language === 'bg' ? 'Грешна текуща парола' : 'Incorrect current password',
      });
    } else {
      setPasswordMessage({
        type: 'success',
        text: language === 'bg' ? 'Паролата е променена успешно' : 'Password changed successfully',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }

    setSavingPassword(false);
  };

  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    color: isDark ? colors.white : colors.midnightBlack,
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
  };

  if (!isReady || !user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div
            className="h-64 rounded-2xl"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          />
          <div
            className="h-48 rounded-2xl"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/account" style={{ color: colors.forestGreen }}>
          {language === 'bg' ? 'Акаунт' : 'Account'}
        </Link>
        <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>/</span>
        <span style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
          {language === 'bg' ? 'Профил' : 'Profile'}
        </span>
      </div>

      {/* Header */}
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: isDark ? colors.white : colors.midnightBlack }}
      >
        {language === 'bg' ? 'Редактиране на профила' : 'Edit Profile'}
      </h1>

      {/* Account Email - Read Only Section */}
      <div
        className="p-6 rounded-2xl mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <h2
          className="font-bold mb-4"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Акаунт' : 'Account'}
        </h2>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: isDark ? colors.white : colors.midnightBlack }}
          >
            {language === 'bg' ? 'Имейл адрес' : 'Email Address'}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="email"
              value={user.email}
              disabled
              className="flex-1 px-4 py-3 rounded-xl outline-none opacity-60 cursor-not-allowed"
              style={inputStyle}
            />
            <div
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(34,197,94,0.1)', color: colors.forestGreen }}
            >
              {language === 'bg' ? 'Потвърден' : 'Verified'}
            </div>
          </div>
          <p className="text-xs mt-2" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
            {language === 'bg' 
              ? 'Имейлът не може да бъде променен. Свържете се с нас ако имате нужда от помощ.' 
              : 'Email cannot be changed. Contact us if you need assistance.'}
          </p>
        </div>
      </div>

      {/* Personal Information Form */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 rounded-2xl mb-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <h2
          className="font-bold mb-4"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Лична информация' : 'Personal Information'}
        </h2>

        {/* Message */}
        {profileMessage.text && (
          <div
            className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
            style={{
              background: profileMessage.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
              color: profileMessage.type === 'error' ? '#ef4444' : colors.forestGreen,
            }}
          >
            {profileMessage.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {profileMessage.text}
          </div>
        )}

        <div className="space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Име' : 'First Name'} *
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                style={{
                  ...inputStyle,
                }}
                placeholder={language === 'bg' ? 'Вашето име' : 'Your first name'}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Фамилия' : 'Last Name'} *
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                required
                className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                style={inputStyle}
                placeholder={language === 'bg' ? 'Вашата фамилия' : 'Your last name'}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Телефон' : 'Phone'}
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={inputStyle}
              placeholder="+359 888 123 456"
            />
          </div>

          {/* Address */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Адрес' : 'Address'}
            </label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={inputStyle}
              placeholder={language === 'bg' ? 'ул. Примерна 123, ап. 4' : '123 Example St, Apt 4'}
            />
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Град' : 'City'}
              </label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={inputStyle}
                placeholder={language === 'bg' ? 'София' : 'Sofia'}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: isDark ? colors.white : colors.midnightBlack }}
              >
                {language === 'bg' ? 'Пощенски код' : 'Postal Code'}
              </label>
              <input
                type="text"
                name="postalCode"
                value={profileData.postalCode}
                onChange={handleProfileChange}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={inputStyle}
                placeholder="1000"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={savingProfile}
            className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: colors.forestGreen,
              color: colors.white,
            }}
          >
            {savingProfile && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {savingProfile
              ? language === 'bg'
                ? 'Запазване...'
                : 'Saving...'
              : language === 'bg'
              ? 'Запази промените'
              : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Password Form */}
      <form
        onSubmit={handleSavePassword}
        className="p-6 rounded-2xl"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : colors.white,
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <h2
          className="font-bold mb-4"
          style={{ color: isDark ? colors.white : colors.midnightBlack }}
        >
          {language === 'bg' ? 'Промяна на паролата' : 'Change Password'}
        </h2>

        {/* Message */}
        {passwordMessage.text && (
          <div
            className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2"
            style={{
              background: passwordMessage.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
              color: passwordMessage.type === 'error' ? '#ef4444' : colors.forestGreen,
            }}
          >
            {passwordMessage.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {passwordMessage.text}
          </div>
        )}

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Текуща парола' : 'Current Password'}
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all"
                style={inputStyle}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {showPasswords.current ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Нова парола' : 'New Password'}
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all"
                style={inputStyle}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {showPasswords.new ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: isDark ? colors.gray : colors.midnightBlack }}>
              {language === 'bg' ? 'Минимум 6 символа' : 'Minimum 6 characters'}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: isDark ? colors.white : colors.midnightBlack }}
            >
              {language === 'bg' ? 'Потвърди новата парола' : 'Confirm New Password'}
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl outline-none transition-all"
                style={inputStyle}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: isDark ? colors.gray : colors.midnightBlack }}
              >
                {showPasswords.confirm ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={savingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: isDark ? colors.white : colors.midnightBlack,
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {savingPassword && (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {savingPassword
              ? language === 'bg'
                ? 'Запазване...'
                : 'Saving...'
              : language === 'bg'
              ? 'Промени паролата'
              : 'Change Password'}
          </button>
        </div>
      </form>

      {/* Back to Account Link */}
      <div className="mt-6 text-center">
        <Link
          href="/account"
          className="text-sm font-medium"
          style={{ color: colors.forestGreen }}
        >
          ← {language === 'bg' ? 'Обратно към акаунта' : 'Back to Account'}
        </Link>
      </div>
    </main>
  );
}
