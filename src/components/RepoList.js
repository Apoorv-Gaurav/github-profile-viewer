'use client';

import { useState, useMemo } from 'react';
import RepoCard from './RepoCard';
import '../styles/components/repo.css';

const PAGE_SIZE = 6;

export default function RepoList({ repos = [], username }) {
  const [filter, setFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('');
  const [sortBy, setSortBy] = useState('updated');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Extract unique languages from repos
  const languages = useMemo(() => {
    const langs = new Set();
    repos.forEach((r) => { if (r.language) langs.add(r.language); });
    return Array.from(langs).sort();
  }, [repos]);

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // Type filter
    if (filter === 'sources') result = result.filter((r) => !r.fork);
    if (filter === 'forks') result = result.filter((r) => r.fork);

    // Language filter
    if (languageFilter) result = result.filter((r) => r.language === languageFilter);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'updated':
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

    return result;
  }, [repos, filter, languageFilter, sortBy, searchQuery]);

  const visibleRepos = filteredRepos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRepos.length;

  // Reset visible count when filters change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      {/* Controls */}
      <div className="repo-list-controls">
        {['all', 'sources', 'forks'].map((f) => (
          <button
            key={f}
            className={`repo-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => handleFilterChange(f)}
          >
            {f === 'all' ? 'All' : f === 'sources' ? 'Sources' : 'Forks'}
          </button>
        ))}

        <select
          className="repo-select"
          value={languageFilter}
          onChange={(e) => { setLanguageFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
          aria-label="Filter by language"
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>

        <select
          className="repo-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort repositories"
        >
          <option value="updated">Recently updated</option>
          <option value="stars">Stars</option>
          <option value="name">Name</option>
          <option value="created">Created</option>
        </select>

        <input
          className="repo-search-input"
          type="text"
          placeholder="Find a repository…"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
          aria-label="Search repositories by name"
        />

        <span className="repo-count">
          {filteredRepos.length} result{filteredRepos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Repo grid */}
      {filteredRepos.length > 0 ? (
        <>
          <div className="repo-grid">
            {visibleRepos.map((repo) => (
              <RepoCard key={repo.id || repo.name} repo={repo} username={username} />
            ))}
          </div>
          {hasMore && (
            <button
              className="repo-show-more"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            >
              Show more ({filteredRepos.length - visibleCount} remaining)
            </button>
          )}
        </>
      ) : (
        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary, #656d76)' }}>
          No repositories found.
        </p>
      )}
    </div>
  );
}
