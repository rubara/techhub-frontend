'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, CloseIcon } from './Icons';
import { useUIStore } from '@/store';
import { colors } from '@/lib/colors';

interface SearchBarProps {
  className?: string;
  expanded?: boolean;
}

export const SearchBar = ({ className, expanded = true }: SearchBarProps) => {
  const router = useRouter();
  const { isDark, t } = useUIStore();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className="flex items-center rounded-full transition-all duration-200"
        style={{
          background: isDark ? 'rgba(255,255,255,0.08)' : colors.white,
          border: `1px solid ${
            isFocused
              ? colors.forestGreen
              : isDark
              ? 'rgba(255,255,255,0.1)'
              : '#e0e0e0'
          }`,
          boxShadow: isFocused ? `0 0 0 2px ${colors.forestGreen}30` : 'none',
        }}
      >
        <button
          type="submit"
          className="p-3 transition-colors hover:opacity-70"
          aria-label="Search"
        >
          <SearchIcon
            size={18}
            color={isDark ? 'rgba(255,255,255,0.5)' : colors.gray}
          />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t.searchPlaceholder || t.search}
          className="flex-1 bg-transparent outline-none py-2 pr-3"
          style={{
            color: isDark ? colors.white : colors.midnightBlack,
            fontSize: '14px',
          }}
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-3 transition-colors hover:opacity-70"
            aria-label="Clear search"
          >
            <CloseIcon
              size={16}
              color={isDark ? 'rgba(255,255,255,0.5)' : colors.gray}
            />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
