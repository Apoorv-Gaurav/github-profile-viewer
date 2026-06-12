'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import BackgroundLogo from '../components/BackgroundLogo';
import '../styles/pages/home.css';

const FEATURED_DEVS = [
  { username: 'amanr11314', name: 'Aman Raj' },
  { username: 'mauryarajeev560-eng', name: 'Rajeev Maurya' },
  { username: 'Anushka1118', name: 'Anushka' },
  { username: 'fauzia10', name: 'Fauzia' },
  { username: 'CodeWithHarry', name: 'CodeWithHarry' },
  { username: 'hiteshchoudhary', name: 'Hitesh Choudhary' },
  { username: 'apna-college', name: 'Apna College' },
  { username: 'Apoorv-Gaurav', name: 'Apoorv Gaurav' },
];

const STATS = [
  { value: '100M+', label: 'Developers on GitHub' },
  { value: '372M+', label: 'Repositories' },
  { value: '4B+', label: 'Contributions' },
];

export default function HomePage() {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    document.title = 'GitView - Explore GitHub Profiles';
    try {
      const stored = JSON.parse(localStorage.getItem('gitview_recent') || '[]');
      setRecentSearches(stored.slice(0, 8));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  function handleSearch(username) {
    if (!username.trim()) return;
    const trimmed = username.trim();

    try {
      const stored = JSON.parse(localStorage.getItem('gitview_recent') || '[]');
      const updated = [trimmed, ...stored.filter((s) => s !== trimmed)].slice(0, 8);
      localStorage.setItem('gitview_recent', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // localStorage unavailable
    }

    router.push(`/user/${trimmed}`);
  }

  function removeRecent(username) {
    try {
      const stored = JSON.parse(localStorage.getItem('gitview_recent') || '[]');
      const updated = stored.filter((s) => s !== username);
      localStorage.setItem('gitview_recent', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // localStorage unavailable
    }
  }

  return (
    <div className="home">
      {/* 3D Background Logo */}
      <BackgroundLogo />

      {/* Animated Background Orbs */}
      <div className="home__orbs" aria-hidden="true">
        <div className="home__orb home__orb--1" />
        <div className="home__orb home__orb--2" />
        <div className="home__orb home__orb--3" />
        <div className="home__orb home__orb--4" />
      </div>

      {/* Hero Section */}
      <section className="home__hero">
        <span className="home__badge">🚀 Open Source Explorer</span>
        <h1 className="home__title">Explore GitHub Profiles</h1>
        <p className="home__subtitle">
          Search any GitHub user to view their profile, repositories, and
          contributions with beautiful visualizations.
        </p>
        <div className="home__search-wrapper">
          <SearchBar onSearch={handleSearch} size="large" />
        </div>
      </section>

      {/* Featured Developers */}
      <section className="home__section">
        <div className="home__section-header">
          <span className="home__section-icon">⭐</span>
          <h2 className="home__section-title">Featured Developers</h2>
        </div>
        <div className="home__featured">
          {FEATURED_DEVS.map((dev) => (
            <Link
              key={dev.username}
              href={`/user/${dev.username}`}
              className="home__featured-card"
              onClick={() => handleSearch(dev.username)}
            >
              <img
                src={`https://github.com/${dev.username}.png`}
                alt={dev.name}
                className="home__featured-avatar"
                width={40}
                height={40}
                loading="lazy"
              />
              <div className="home__featured-info">
                <span className="home__featured-name">{dev.name}</span>
                <span className="home__featured-username">@{dev.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Searches */}
      <section className="home__section">
        <div className="home__section-header">
          <span className="home__section-icon">🕐</span>
          <h2 className="home__section-title">Recent Searches</h2>
        </div>
        <div className="home__recent-list">
          {recentSearches.length === 0 ? (
            <span className="home__recent-empty">
              No recent searches yet. Try searching for a GitHub username above!
            </span>
          ) : (
            recentSearches.map((username) => (
              <span key={username} className="home__recent-chip">
                <Link href={`/user/${username}`}>@{username}</Link>
                <button
                  className="home__recent-remove"
                  onClick={(e) => {
                    e.preventDefault();
                    removeRecent(username);
                  }}
                  aria-label={`Remove ${username} from recent searches`}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="home__stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="home__stat">
            <div className="home__stat-value">{stat.value}</div>
            <div className="home__stat-label">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
