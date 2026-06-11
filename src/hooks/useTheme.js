'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'github-viewer-theme';

/**
 * Custom hook for theme management (light / dark).
 * Persists the choice to localStorage and sets `data-theme` on <html>.
 *
 * @returns {{ theme: string, toggleTheme: Function, setTheme: Function }}
 */
export function useTheme() {
  const [theme, setThemeState] = useState('dark');

  // Resolve initial theme on mount
  useEffect(() => {
    let initial = 'dark';

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        initial = stored;
      } else if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: light)').matches
      ) {
        initial = 'light';
      }
    } catch {
      // localStorage unavailable — keep default
    }

    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = useCallback((newTheme) => {
    const value = newTheme === 'light' ? 'light' : 'dark';
    setThemeState(value);
    document.documentElement.setAttribute('data-theme', value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // silently ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // silently ignore
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme, setTheme };
}

export default useTheme;
