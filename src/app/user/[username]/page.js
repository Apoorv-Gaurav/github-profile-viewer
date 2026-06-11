'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProfileCard from '../../../components/ProfileCard';
import RepoList from '../../../components/RepoList';
import LanguageChart from '../../../components/LanguageChart';
import ContributionHeatmap from '../../../components/ContributionHeatmap';
import ActivityFeed from '../../../components/ActivityFeed';
import ProfileCardGenerator from '../../../components/ProfileCardGenerator';
import { SkeletonProfile, SkeletonRepoList } from '../../../components/Skeleton';
import '../../../styles/pages/user.css';

export default function UserProfilePage() {
  const { username } = useParams();

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [contributions, setContributions] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!username) return;

    document.title = `${username} - GitView`;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const [userRes, reposRes, langsRes, contribRes] = await Promise.all([
          fetch(`/api/github/user?username=${encodeURIComponent(username)}`),
          fetch(`/api/github/repos?username=${encodeURIComponent(username)}`),
          fetch(`/api/github/languages?username=${encodeURIComponent(username)}`),
          fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`),
        ]);

        if (userRes.status === 404) {
          setError({ type: 'not_found', message: `User "${username}" not found` });
          setLoading(false);
          return;
        }

        if (!userRes.ok) {
          throw new Error(`Failed to fetch user data (${userRes.status})`);
        }

        const userData = await userRes.json();
        setUser(userData);

        if (reposRes.ok) {
          const reposData = await reposRes.json();
          setRepos(reposData);
        }

        if (langsRes.ok) {
          const langsData = await langsRes.json();
          setLanguages(langsData);
        }

        if (contribRes.ok) {
          const contribData = await contribRes.json();
          setContributions(contribData);
        }

        // Fetch events separately (no dedicated API route, call GitHub directly)
        try {
          const eventsRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`);
          if (eventsRes.ok) {
            const eventsData = await eventsRes.json();
            setEvents(eventsData);
          }
        } catch {
          // Events are optional, don't fail if unavailable
        }
      } catch (err) {
        setError({
          type: 'error',
          message: err.message || 'Something went wrong while fetching profile data.',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [username]);

  // Not found state
  if (!loading && error?.type === 'not_found') {
    return (
      <div className="user-page">
        <div className="user-page__not-found">
          <div className="user-page__not-found-code">404</div>
          <h1 className="user-page__not-found-title">User Not Found</h1>
          <p className="user-page__not-found-message">
            The GitHub user <strong>&quot;{username}&quot;</strong> doesn&apos;t exist or
            may have been renamed.
          </p>
          <Link href="/" className="user-page__error-action">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (!loading && error?.type === 'error') {
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

  // Loading state
  if (loading) {
    return (
      <div className="user-page">
        <nav className="user-page__breadcrumb">
          <Link href="/">Home</Link>
          <span className="user-page__breadcrumb-separator">/</span>
          <span className="user-page__breadcrumb-current">{username}</span>
        </nav>
        <div className="user-page__loading">
          <SkeletonProfile />
          <div className="user-page__content">
            <div className="user-page__main">
              <SkeletonRepoList />
            </div>
            <div className="user-page__sidebar">
              <SkeletonRepoList count={2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      {/* Breadcrumb */}
      <nav className="user-page__breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span className="user-page__breadcrumb-separator">/</span>
        <span className="user-page__breadcrumb-current">{username}</span>
      </nav>

      {/* Profile Card (full width) */}
      <div className="user-page__header">
        <ProfileCard user={user} />
      </div>

      {/* Tab Navigation */}
      <div className="user-page__tabs" role="tablist">
        <button
          className={`user-page__tab ${activeTab === 'overview' ? 'user-page__tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
          role="tab"
          aria-selected={activeTab === 'overview'}
        >
          📊 Overview
        </button>
        <button
          className={`user-page__tab ${activeTab === 'repos' ? 'user-page__tab--active' : ''}`}
          onClick={() => setActiveTab('repos')}
          role="tab"
          aria-selected={activeTab === 'repos'}
        >
          📁 Repositories ({repos.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="user-page__content">
        {/* Left Column - Main */}
        <div className="user-page__main">
          {activeTab === 'overview' && (
            <>
              {/* Contribution Heatmap */}
              <section className="user-page__section">
                <h2 className="user-page__section-title">
                  <span className="user-page__section-icon">📅</span>
                  Contribution Activity
                </h2>
                <ContributionHeatmap contributions={contributions?.contributionCalendar || contributions} />
              </section>

              {/* Top Repositories */}
              <section className="user-page__section">
                <h2 className="user-page__section-title">
                  <span className="user-page__section-icon">📦</span>
                  Popular Repositories
                </h2>
                <RepoList
                  repos={repos.slice(0, 6)}
                  username={username}
                  compact
                />
              </section>
            </>
          )}

          {activeTab === 'repos' && (
            <section className="user-page__section">
              <h2 className="user-page__section-title">
                <span className="user-page__section-icon">📁</span>
                All Repositories
              </h2>
              <RepoList repos={repos} username={username} />
            </section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="user-page__sidebar">
          {/* Language Chart */}
          <section className="user-page__section">
            <h2 className="user-page__section-title">
              <span className="user-page__section-icon">🔤</span>
              Languages
            </h2>
            <LanguageChart languages={languages} />
          </section>

          {/* Activity Feed */}
          <section className="user-page__section">
            <h2 className="user-page__section-title">
              <span className="user-page__section-icon">⚡</span>
              Recent Activity
            </h2>
            <ActivityFeed events={events} />
          </section>
        </div>
      </div>

      {/* Profile Card Generator (full width) */}
      <section className="user-page__section" style={{ marginTop: '1.5rem' }}>
        <h2 className="user-page__section-title">
          <span className="user-page__section-icon">🎨</span>
          Profile Card Generator
        </h2>
        <ProfileCardGenerator user={user} languages={languages} />
      </section>
    </div>
  );
}
