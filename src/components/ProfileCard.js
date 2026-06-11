'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import BookmarkButton from './BookmarkButton';
import { formatNumber, formatDate } from '../lib/utils';
import '../styles/components/profile.css';

export default function ProfileCard({ user }) {
  const statRefs = useRef([]);

  // Count-up animation on mount
  useEffect(() => {
    if (!user) return;
    const stats = [
      user.public_repos,
      user.followers,
      user.following,
      user.public_gists,
    ];

    statRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = stats[i] || 0;
      const duration = 600;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        el.textContent = formatNumber(Math.floor(target * eased));
        if (progress < 1) requestAnimationFrame(animate);
        else el.textContent = formatNumber(target);
      }
      requestAnimationFrame(animate);
    });
  }, [user]);

  if (!user) return null;

  const handleShare = async () => {
    const url = `${window.location.origin}/user/${user.login}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${user.name || user.login} - GitView`, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="profile-card">
      {/* Avatar */}
      <div className="profile-avatar-wrapper">
        <Image
          className="profile-avatar"
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          width={122}
          height={122}
          priority
        />
      </div>

      {/* Name & username */}
      {user.name && <h1 className="profile-name">{user.name}</h1>}
      <p className="profile-username">@{user.login}</p>

      {/* Bio */}
      {user.bio && <p className="profile-bio">{user.bio}</p>}

      {/* Details */}
      <div className="profile-details">
        {user.location && (
          <span className="profile-detail">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M12.596 11.596a6.5 6.5 0 1 0-9.192 0L8 16l4.596-4.404ZM8 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
            </svg>
            {user.location}
          </span>
        )}
        {user.company && (
          <span className="profile-detail">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5ZM1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.777.871.777 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75h-3C.784 16 0 15.216 0 14.25V1.75C0 .784.784 0 1.75 0ZM3.5 4h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1ZM3 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM3.5 10h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1ZM7 4.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM7.5 7h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1ZM7 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Z" />
            </svg>
            {user.company}
          </span>
        )}
        {user.blog && (
          <span className="profile-detail">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25Zm-.025 5.45a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 1 1-2.83-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25Z" />
            </svg>
            <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noopener noreferrer">
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          </span>
        )}
        {user.twitter_username && (
          <span className="profile-detail">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
            </svg>
            <a href={`https://x.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer">
              @{user.twitter_username}
            </a>
          </span>
        )}
        {user.created_at && (
          <span className="profile-detail">
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0Zm0 3.5h8.5a.25.25 0 0 1 .25.25V6h-11V3.75a.25.25 0 0 1 .25-.25Zm-2 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Z" />
            </svg>
            Joined {formatDate(user.created_at)}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="profile-stats">
        {[
          { label: 'Repos', value: user.public_repos },
          { label: 'Followers', value: user.followers },
          { label: 'Following', value: user.following },
          { label: 'Gists', value: user.public_gists },
        ].map((stat, i) => (
          <div className="profile-stat" key={stat.label}>
            <div
              className="profile-stat-value"
              ref={(el) => { statRefs.current[i] = el; }}
            >
              {formatNumber(stat.value)}
            </div>
            <div className="profile-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="profile-actions">
        <BookmarkButton user={user} />
        <a
          className="profile-action-btn"
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View profile on GitHub"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z" />
          </svg>
          View on GitHub
        </a>
        <button
          className="profile-action-btn"
          onClick={handleShare}
          aria-label="Share profile"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
