'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useBookmarks } from '../../hooks/useBookmarks';
import AnimatedBackground from '../../components/AnimatedBackground';
import '../../styles/components/bookmarks.css';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Bookmarked' },
  { value: 'alpha', label: 'Alphabetical (A-Z)' },
  { value: 'alpha-desc', label: 'Alphabetical (Z-A)' },
];

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    document.title = 'Bookmarks - GitView';
  }, []);

  const filteredBookmarks = useMemo(() => {
    let result = [...bookmarks];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          (b.login || b.username || '').toLowerCase().includes(query) ||
          (b.name || '').toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'alpha':
        result.sort((a, b) =>
          (a.login || a.username || '').localeCompare(b.login || b.username || '')
        );
        break;
      case 'alpha-desc':
        result.sort((a, b) =>
          (b.login || b.username || '').localeCompare(a.login || a.username || '')
        );
        break;
      case 'recent':
      default:
        // Keep original order (most recent first, assuming bookmarks are stored in order)
        break;
    }

    return result;
  }, [bookmarks, searchQuery, sortBy]);

  function handleClearAll() {
    clearBookmarks();
    setShowClearConfirm(false);
  }

  return (
    <div className="bookmarks-page">
      <AnimatedBackground />
      <div className="bookmarks-page__header">
        <div className="bookmarks-page__header-top">
          <div>
            <h1 className="bookmarks-page__title">📑 Bookmarks</h1>
            <p className="bookmarks-page__subtitle">
              {bookmarks.length === 0
                ? 'Save profiles to quickly access them later.'
                : `You have ${bookmarks.length} bookmarked profile${bookmarks.length !== 1 ? 's' : ''}.`}
            </p>
          </div>

          {bookmarks.length > 0 && (
            <div className="bookmarks-page__header-actions">
              {!showClearConfirm ? (
                <button
                  className="bookmarks-page__clear-btn"
                  onClick={() => setShowClearConfirm(true)}
                >
                  🗑️ Clear All
                </button>
              ) : (
                <div className="bookmarks-page__confirm">
                  <span className="bookmarks-page__confirm-text">Are you sure?</span>
                  <button
                    className="bookmarks-page__confirm-yes"
                    onClick={handleClearAll}
                  >
                    Yes, clear all
                  </button>
                  <button
                    className="bookmarks-page__confirm-no"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Controls */}
        {bookmarks.length > 0 && (
          <div className="bookmarks-page__controls">
            <div className="bookmarks-page__search">
              <span className="bookmarks-page__search-icon">🔍</span>
              <input
                type="text"
                className="bookmarks-page__search-input"
                placeholder="Filter bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="bookmarks-page__sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <div className="bookmarks-page__empty">
          <div className="bookmarks-page__empty-icon">📌</div>
          <h2 className="bookmarks-page__empty-title">No Bookmarks Yet</h2>
          <p className="bookmarks-page__empty-text">
            When you find a GitHub profile you like, bookmark it to save it here for
            quick access.
          </p>
          <Link href="/" className="bookmarks-page__empty-action">
            🔍 Search for Profiles
          </Link>
        </div>
      )}

      {/* Bookmarks Grid */}
      {filteredBookmarks.length > 0 && (
        <div className="bookmarks-page__grid">
          {filteredBookmarks.map((bookmark, index) => {
            const username = bookmark.login || bookmark.username;
            return (
              <div key={bookmark.id || username || `bookmark-${index}`} className="bookmarks-page__card">
                <div className="bookmarks-page__card-header">
                  <img
                    src={
                      bookmark.avatar_url || `https://github.com/${username}.png`
                    }
                    alt={bookmark.name || username}
                    className="bookmarks-page__card-avatar"
                    width={56}
                    height={56}
                    loading="lazy"
                  />
                  <button
                    className="bookmarks-page__card-remove"
                    onClick={() => removeBookmark(username)}
                    aria-label={`Remove ${username} from bookmarks`}
                    title="Remove bookmark"
                  >
                    ✕
                  </button>
                </div>

                <div className="bookmarks-page__card-body">
                  {bookmark.name && (
                    <h3 className="bookmarks-page__card-name">{bookmark.name}</h3>
                  )}
                  <p className="bookmarks-page__card-username">@{username}</p>

                  {/* Stats */}
                  <div className="bookmarks-page__card-stats">
                    {bookmark.public_repos !== undefined && (
                      <span className="bookmarks-page__card-stat">
                        📦 {bookmark.public_repos} repos
                      </span>
                    )}
                    {bookmark.followers !== undefined && (
                      <span className="bookmarks-page__card-stat">
                        👥 {bookmark.followers} followers
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/user/${username}`}
                  className="bookmarks-page__card-link"
                >
                  View Profile →
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results (filtered) */}
      {bookmarks.length > 0 && filteredBookmarks.length === 0 && (
        <div className="bookmarks-page__no-results">
          <p>No bookmarks match &quot;{searchQuery}&quot;</p>
          <button
            className="bookmarks-page__clear-search"
            onClick={() => setSearchQuery('')}
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
