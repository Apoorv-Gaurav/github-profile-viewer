'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SkeletonProfile } from '../../../../../components/Skeleton';
import '../../../../../styles/pages/user.css';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

function formatNumber(num) {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

export default function RepoDetailPage() {
  const { username, reponame } = useParams();

  const [repo, setRepo] = useState(null);
  const [readme, setReadme] = useState(null);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username || !reponame) return;

    document.title = `${reponame} - ${username} - GitView`;
    setLoading(true);
    setError(null);

    async function fetchRepoData() {
      try {
        // Fetch repo details
        const repoRes = await fetch(
          `/api/github/repos?username=${encodeURIComponent(username)}`
        );

        if (!repoRes.ok) {
          throw new Error(`Failed to fetch repository data (${repoRes.status})`);
        }

        const allRepos = await repoRes.json();
        const foundRepo = allRepos.find(
          (r) => r.name.toLowerCase() === reponame.toLowerCase()
        );

        if (!foundRepo) {
          setError({ type: 'not_found', message: `Repository "${reponame}" not found` });
          setLoading(false);
          return;
        }

        setRepo(foundRepo);

        // Fetch README and commits in parallel
        const [readmeRes, commitsRes] = await Promise.allSettled([
          fetch(
            `/api/github/readme?owner=${encodeURIComponent(username)}&repo=${encodeURIComponent(reponame)}`
          ),
          fetch(
            `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(reponame)}/commits?per_page=10`
          ),
        ]);

        if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
          const readmeData = await readmeRes.value.json();
          setReadme(readmeData.content || readmeData);
        }

        if (commitsRes.status === 'fulfilled' && commitsRes.value.ok) {
          const commitsData = await commitsRes.value.json();
          setCommits(Array.isArray(commitsData) ? commitsData.slice(0, 10) : []);
        }
      } catch (err) {
        setError({
          type: 'error',
          message: err.message || 'Failed to load repository details.',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRepoData();
  }, [username, reponame]);

  if (loading) {
    return (
      <div className="user-page">
        <nav className="user-page__breadcrumb">
          <Link href="/">Home</Link>
          <span className="user-page__breadcrumb-separator">/</span>
          <Link href={`/user/${username}`}>{username}</Link>
          <span className="user-page__breadcrumb-separator">/</span>
          <span className="user-page__breadcrumb-current">{reponame}</span>
        </nav>
        <SkeletonProfile />
      </div>
    );
  }

  if (error?.type === 'not_found') {
    return (
      <div className="user-page">
        <div className="user-page__not-found">
          <div className="user-page__not-found-code">404</div>
          <h1 className="user-page__not-found-title">Repository Not Found</h1>
          <p className="user-page__not-found-message">
            The repository <strong>&quot;{reponame}&quot;</strong> was not found for
            user <strong>&quot;{username}&quot;</strong>.
          </p>
          <Link href={`/user/${username}`} className="user-page__error-action">
            ← Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  if (error?.type === 'error') {
    return (
      <div className="user-page">
        <div className="user-page__error">
          <div className="user-page__error-icon">⚠️</div>
          <h1 className="user-page__error-title">Something Went Wrong</h1>
          <p className="user-page__error-message">{error.message}</p>
          <button
            className="user-page__error-action"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Build language percentages from repo data
  const repoLanguages = repo?.languages || repo?.language
    ? repo.languages || { [repo.language]: 100 }
    : {};

  const totalBytes = Object.values(repoLanguages).reduce((sum, v) => sum + v, 0);

  return (
    <div className="user-page">
      {/* Breadcrumb */}
      <nav className="user-page__breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="user-page__breadcrumb-separator">/</span>
        <Link href={`/user/${username}`}>{username}</Link>
        <span className="user-page__breadcrumb-separator">/</span>
        <span className="user-page__breadcrumb-current">{reponame}</span>
      </nav>

      {/* Repo Header */}
      <section className="user-page__section">
        <div className="repo-page__header">
          <h1 className="repo-page__name">
            📦 {repo.name}
            {repo.fork && <span className="repo-page__topic">fork</span>}
          </h1>
          {repo.description && (
            <p className="repo-page__description">{repo.description}</p>
          )}
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-page__homepage"
            >
              🔗 {repo.homepage}
            </a>
          )}
        </div>

        {/* Stats Bar */}
        <div className="repo-page__stats">
          <div className="repo-page__stat">
            <span className="repo-page__stat-icon">⭐</span>
            <span className="repo-page__stat-value">
              {formatNumber(repo.stargazers_count)}
            </span>
            <span>stars</span>
          </div>
          <div className="repo-page__stat">
            <span className="repo-page__stat-icon">🔱</span>
            <span className="repo-page__stat-value">
              {formatNumber(repo.forks_count)}
            </span>
            <span>forks</span>
          </div>
          <div className="repo-page__stat">
            <span className="repo-page__stat-icon">👁️</span>
            <span className="repo-page__stat-value">
              {formatNumber(repo.watchers_count)}
            </span>
            <span>watchers</span>
          </div>
          <div className="repo-page__stat">
            <span className="repo-page__stat-icon">🐛</span>
            <span className="repo-page__stat-value">
              {formatNumber(repo.open_issues_count)}
            </span>
            <span>issues</span>
          </div>
          {repo.license?.spdx_id && (
            <div className="repo-page__stat">
              <span className="repo-page__stat-icon">📄</span>
              <span className="repo-page__stat-value">{repo.license.spdx_id}</span>
            </div>
          )}
        </div>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="repo-page__topics">
            {repo.topics.map((topic) => (
              <span key={topic} className="repo-page__topic">
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Language Bar */}
        {totalBytes > 0 && (
          <div className="repo-page__languages">
            <div className="repo-page__language-bar">
              {Object.entries(repoLanguages).map(([lang, bytes]) => (
                <div
                  key={lang}
                  className="repo-page__language-segment"
                  style={{
                    width: `${(bytes / totalBytes) * 100}%`,
                    backgroundColor: LANGUAGE_COLORS[lang] || '#8b8b8b',
                  }}
                  title={`${lang}: ${((bytes / totalBytes) * 100).toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="repo-page__language-labels">
              {Object.entries(repoLanguages).map(([lang, bytes]) => (
                <span key={lang} className="repo-page__language-label">
                  <span
                    className="repo-page__language-dot"
                    style={{
                      backgroundColor: LANGUAGE_COLORS[lang] || '#8b8b8b',
                    }}
                  />
                  {lang} {((bytes / totalBytes) * 100).toFixed(1)}%
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* README */}
      {readme && (
        <section className="user-page__section" style={{ marginTop: '1.5rem' }}>
          <h2 className="user-page__section-title">
            <span className="user-page__section-icon">📖</span>
            README
          </h2>
          <div className="repo-page__readme">
            <pre className="repo-page__readme-content">
              {typeof readme === 'string' ? readme : JSON.stringify(readme, null, 2)}
            </pre>
          </div>
        </section>
      )}

      {/* Recent Commits */}
      {commits.length > 0 && (
        <section className="user-page__section" style={{ marginTop: '1.5rem' }}>
          <h2 className="user-page__section-title">
            <span className="user-page__section-icon">📝</span>
            Recent Commits
          </h2>
          <div className="repo-page__commits">
            {commits.map((commit) => (
              <div key={commit.sha} className="repo-page__commit">
                {commit.author?.avatar_url && (
                  <img
                    src={commit.author.avatar_url}
                    alt={commit.commit?.author?.name || 'author'}
                    className="repo-page__commit-avatar"
                    width={28}
                    height={28}
                    loading="lazy"
                  />
                )}
                <div className="repo-page__commit-info">
                  <div className="repo-page__commit-message">
                    {commit.commit?.message?.split('\n')[0]}
                  </div>
                  <div className="repo-page__commit-meta">
                    {commit.commit?.author?.name} •{' '}
                    {timeAgo(commit.commit?.author?.date)}
                    {' • '}
                    <a
                      href={commit.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="repo-page__commit-sha"
                    >
                      {commit.sha?.slice(0, 7)}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Back Link */}
      <Link href={`/user/${username}`} className="repo-page__back">
        ← Back to {username}&apos;s profile
      </Link>
    </div>
  );
}
