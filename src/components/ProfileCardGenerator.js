'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import '../styles/components/card-generator.css';

const THEMES = {
  dark: {
    name: 'Dark',
    background: 'linear-gradient(135deg, #0d1117, #161b22, #1a1e2e)',
    text: '#f0f6fc',
    subtext: '#8b949e',
    accent: '#58a6ff',
    border: '#30363d',
  },
  ocean: {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #0c2d48, #145374, #2e8bc0)',
    text: '#ffffff',
    subtext: '#a8d8ea',
    accent: '#00c6ff',
    border: 'rgba(255,255,255,0.15)',
  },
  sunset: {
    name: 'Sunset',
    background: 'linear-gradient(135deg, #2d1b69, #6b2fa0, #d63384, #ff6b6b)',
    text: '#ffffff',
    subtext: '#e0c3fc',
    accent: '#ff9a9e',
    border: 'rgba(255,255,255,0.15)',
  },
  forest: {
    name: 'Forest',
    background: 'linear-gradient(135deg, #0b3d0b, #1a5c1a, #2d8f2d)',
    text: '#ffffff',
    subtext: '#a8e6cf',
    accent: '#55efc4',
    border: 'rgba(255,255,255,0.15)',
  },
};

export default function ProfileCardGenerator({ user, languages }) {
  const cardRef = useRef(null);
  const [theme, setTheme] = useState('dark');
  const [downloading, setDownloading] = useState(false);

  const currentTheme = THEMES[theme];
  const topLangs = (languages || []).slice(0, 5);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `${user.login}-github-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate card:', err);
    }
    setDownloading(false);
  };

  return (
    <div className="card-generator">
      <h3 className="card-generator__title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        Generate Profile Card
      </h3>

      {/* Theme selector */}
      <div className="card-generator__themes">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            className={`card-generator__theme-btn ${theme === key ? 'card-generator__theme-btn--active' : ''}`}
            onClick={() => setTheme(key)}
            style={{ background: t.background }}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Card preview */}
      <div className="card-generator__preview-wrapper">
        <div
          ref={cardRef}
          className="card-generator__card"
          style={{
            background: currentTheme.background,
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`,
          }}
        >
          <div className="card-generator__card-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={user.login}
              width={80}
              height={80}
              className="card-generator__card-avatar"
              crossOrigin="anonymous"
            />
            <div className="card-generator__card-info">
              <h4 className="card-generator__card-name" style={{ color: currentTheme.text }}>
                {user.name || user.login}
              </h4>
              <p className="card-generator__card-username" style={{ color: currentTheme.subtext }}>
                @{user.login}
              </p>
              {user.bio && (
                <p className="card-generator__card-bio" style={{ color: currentTheme.subtext }}>
                  {user.bio.length > 80 ? user.bio.slice(0, 80) + '...' : user.bio}
                </p>
              )}
            </div>
          </div>

          <div className="card-generator__card-stats">
            <div className="card-generator__card-stat">
              <span className="card-generator__card-stat-value" style={{ color: currentTheme.accent }}>
                {user.public_repos}
              </span>
              <span className="card-generator__card-stat-label" style={{ color: currentTheme.subtext }}>
                Repos
              </span>
            </div>
            <div className="card-generator__card-stat">
              <span className="card-generator__card-stat-value" style={{ color: currentTheme.accent }}>
                {user.followers}
              </span>
              <span className="card-generator__card-stat-label" style={{ color: currentTheme.subtext }}>
                Followers
              </span>
            </div>
            <div className="card-generator__card-stat">
              <span className="card-generator__card-stat-value" style={{ color: currentTheme.accent }}>
                {user.following}
              </span>
              <span className="card-generator__card-stat-label" style={{ color: currentTheme.subtext }}>
                Following
              </span>
            </div>
          </div>

          {topLangs.length > 0 && (
            <div className="card-generator__card-languages">
              {topLangs.map((lang) => (
                <span
                  key={lang.name}
                  className="card-generator__card-lang"
                  style={{ color: currentTheme.subtext }}
                >
                  <span
                    className="card-generator__card-lang-dot"
                    style={{ backgroundColor: lang.color }}
                  />
                  {lang.name}
                </span>
              ))}
            </div>
          )}

          <div className="card-generator__card-footer" style={{ color: currentTheme.subtext, borderTop: `1px solid ${currentTheme.border}` }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>github.com/{user.login}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card-generator__actions">
        <button
          className="card-generator__download-btn"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <span className="card-generator__spinner" />
              Generating...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download as PNG
            </>
          )}
        </button>
      </div>
    </div>
  );
}
