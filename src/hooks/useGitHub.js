'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook that fetches JSON from `url` whenever it changes.
 * Returns { data, loading, error, refetch }.
 */
function useGitHubFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || `Request failed with status ${res.status}`);
        setData(null);
      } else {
        setData(json);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Fetch a GitHub user profile from the internal API route.
 * @param {string} username
 */
export function useGitHubUser(username) {
  const url = username ? `/api/github/user?username=${encodeURIComponent(username)}` : null;
  return useGitHubFetch(url);
}

/**
 * Fetch all repositories for a GitHub user.
 * @param {string} username
 */
export function useGitHubRepos(username) {
  const url = username ? `/api/github/repos?username=${encodeURIComponent(username)}` : null;
  return useGitHubFetch(url);
}

/**
 * Fetch aggregated language stats for a GitHub user.
 * @param {string} username
 */
export function useGitHubLanguages(username) {
  const url = username ? `/api/github/languages?username=${encodeURIComponent(username)}` : null;
  return useGitHubFetch(url);
}

/**
 * Fetch contribution data for a GitHub user (requires server-side token).
 * @param {string} username
 */
export function useGitHubContributions(username) {
  const url = username
    ? `/api/github/contributions?username=${encodeURIComponent(username)}`
    : null;
  return useGitHubFetch(url);
}

export default useGitHubFetch;
