'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'github-bookmarks';

function readBookmarks() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeBookmarks(bookmarks) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

/**
 * Custom hook for managing GitHub user bookmarks in localStorage.
 *
 * @returns {{ bookmarks: Array, addBookmark: Function, removeBookmark: Function, isBookmarked: Function, clearBookmarks: Function }}
 */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setBookmarks(readBookmarks());
  }, []);

  const addBookmark = useCallback(
    (user) => {
      setBookmarks((prev) => {
        // Don't duplicate
        if (prev.some((b) => b.username === user.login)) return prev;

        const bookmark = {
          username: user.login,
          name: user.name || user.login,
          avatar_url: user.avatar_url,
          bio: user.bio || '',
          followers: user.followers ?? 0,
          public_repos: user.public_repos ?? 0,
          bookmarkedAt: new Date().toISOString(),
        };

        const next = [bookmark, ...prev];
        writeBookmarks(next);
        return next;
      });
    },
    [],
  );

  const removeBookmark = useCallback(
    (username) => {
      setBookmarks((prev) => {
        const next = prev.filter((b) => b.username !== username);
        writeBookmarks(next);
        return next;
      });
    },
    [],
  );

  const isBookmarked = useCallback(
    (username) => bookmarks.some((b) => b.username === username),
    [bookmarks],
  );

  const clearBookmarks = useCallback(() => {
    writeBookmarks([]);
    setBookmarks([]);
  }, []);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks };
}

export default useBookmarks;
