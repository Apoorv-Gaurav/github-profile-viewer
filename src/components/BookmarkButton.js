'use client';

import { useState } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';

export default function BookmarkButton({ user }) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const [animating, setAnimating] = useState(false);
  const bookmarked = isBookmarked(user?.login);

  const handleToggle = () => {
    setAnimating(true);
    if (bookmarked) {
      removeBookmark(user.login);
    } else {
      addBookmark({
        username: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        public_repos: user.public_repos,
      });
    }
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      className={`bookmark-btn ${bookmarked ? 'bookmark-btn--active' : ''} ${animating ? 'bookmark-btn--animating' : ''}`}
      onClick={handleToggle}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this profile'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  );
}
