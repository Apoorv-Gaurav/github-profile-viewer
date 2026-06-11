'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/components/search.css';

const MAX_RECENT = 5;
const STORAGE_KEY = 'recent-searches';

export default function SearchBar({ large = false, size, placeholder = 'Search GitHub users...', autoFocus = false, onSearch }) {
  const isLarge = large || size === 'large';
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearch = (username) => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = query.trim();
    if (!username) return;
    saveSearch(username);
    setShowDropdown(false);
    if (onSearch) {
      onSearch(username);
    } else {
      router.push(`/user/${username}`);
    }
  };

  const handleSelect = (username) => {
    setQuery(username);
    saveSearch(username);
    setShowDropdown(false);
    if (onSearch) {
      onSearch(username);
    } else {
      router.push(`/user/${username}`);
    }
  };

  return (
    <div className={`search-container${isLarge ? ' large' : ''}`} ref={containerRef}>
      <form className="search-form" onSubmit={handleSubmit} role="search">
        {/* Search icon */}
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => recentSearches.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search GitHub username"
          autoComplete="off"
          spellCheck="false"
        />
        <button className="search-submit" type="submit" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>

      {showDropdown && recentSearches.length > 0 && (
        <div className="search-dropdown" role="listbox" aria-label="Recent searches">
          <div className="search-dropdown-header">Recent searches</div>
          {recentSearches.map((search) => (
            <button
              key={search}
              className="search-dropdown-item"
              onClick={() => handleSelect(search)}
              role="option"
              aria-selected={false}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              {search}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
