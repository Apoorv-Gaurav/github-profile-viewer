'use client';

import Link from 'next/link';
import { formatNumber, timeAgo, getLanguageColor } from '../lib/utils';
import '../styles/components/repo.css';

export default function RepoCard({ repo, username }) {
  if (!repo) return null;

  return (
    <article className="repo-card">
      {/* Repo name */}
      <Link href={`/user/${username}/repo/${repo.name}`} className="repo-name">
        {repo.name}
      </Link>

      {/* Description */}
      {repo.description && (
        <p className="repo-description">{repo.description}</p>
      )}

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="repo-topics">
          {repo.topics.slice(0, 5).map((topic) => (
            <span className="repo-topic" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Meta: language, stars, forks, updated */}
      <div className="repo-meta">
        {repo.language && (
          <span className="repo-language">
            <span
              className="repo-language-dot"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
              aria-hidden="true"
            />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="repo-stat" aria-label={`${repo.stargazers_count} stars`}>
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
            </svg>
            {formatNumber(repo.stargazers_count)}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="repo-stat" aria-label={`${repo.forks_count} forks`}>
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
            </svg>
            {formatNumber(repo.forks_count)}
          </span>
        )}
        {repo.updated_at && (
          <span className="repo-stat">
            Updated {timeAgo(repo.updated_at)}
          </span>
        )}
      </div>
    </article>
  );
}
