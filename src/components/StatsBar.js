'use client';

import { formatNumber } from '../lib/utils';
import '../styles/components/profile.css';

export default function StatsBar({ stats }) {
  if (!stats) return null;

  const items = [
    {
      label: 'Repos',
      value: stats.repos,
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
        </svg>
      ),
    },
    {
      label: 'Followers',
      value: stats.followers,
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4.001 4.001 0 0 0-6.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 4.6 8.049 3.5 3.5 0 0 1 2 5.5ZM5.5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.527 1a2.5 2.5 0 0 1 0 5 .75.75 0 0 1 0-1.5 1 1 0 1 0 0-2 .75.75 0 0 1 0-1.5ZM11.5 10.5c.456 0 .891.072 1.3.206a.75.75 0 0 1-.462 1.428A2.498 2.498 0 0 0 9 14.25a.75.75 0 0 1-1.5 0 4 4 0 0 1 4-4Z" />
        </svg>
      ),
    },
    {
      label: 'Following',
      value: stats.following,
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M4.243 4.757a3.757 3.757 0 1 1 5.514 0 5.006 5.006 0 0 1 3.117 3.527.751.751 0 0 1-1.49.18A3.501 3.501 0 0 0 7 5.5a3.5 3.5 0 0 0-4.384 2.964.75.75 0 0 1-1.49-.18 5.006 5.006 0 0 1 3.117-3.527ZM7 1a2.25 2.25 0 1 0 0 4.5A2.25 2.25 0 0 0 7 1Zm5.25 6.5a.75.75 0 0 1 .75.75v2h2a.75.75 0 0 1 0 1.5h-2v2a.75.75 0 0 1-1.5 0v-2h-2a.75.75 0 0 1 0-1.5h2v-2a.75.75 0 0 1 .75-.75Z" />
        </svg>
      ),
    },
    {
      label: 'Gists',
      value: stats.gists,
      icon: (
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 0 1 0 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 0 1 0-.136ZM8 2c-1.981 0-3.67.992-4.933 2.078C1.86 5.147.93 6.41.458 7.134a1.619 1.619 0 0 0 0 1.732c.472.724 1.402 1.987 2.609 3.056C4.33 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.207-1.069 2.137-2.332 2.609-3.056a1.619 1.619 0 0 0 0-1.732c-.472-.724-1.402-1.987-2.609-3.056C11.67 2.992 9.981 2 8 2Zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="stats-bar" role="list" aria-label="User statistics">
      {items.map((item) => (
        <div className="stats-bar-item" key={item.label} role="listitem">
          {item.icon}
          <span className="stats-bar-value">{formatNumber(item.value)}</span>
          <span className="stats-bar-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
