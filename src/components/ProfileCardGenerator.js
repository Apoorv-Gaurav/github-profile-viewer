'use client';

import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { formatDate } from '../lib/utils';
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
  light: {
    name: 'Light',
    background: 'linear-gradient(135deg, #ffffff, #f0f4f8)',
    text: '#1f2937',
    subtext: '#64748b',
    accent: '#3b82f6',
    border: 'rgba(0,0,0,0.1)',
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
          className={`card-generator__preview card-preview--${theme}`}
          style={{
            background: currentTheme.background,
            color: currentTheme.text,
            border: `1px solid ${currentTheme.border}`,
          }}
        >
          {/* Glowing Orbs */}
          <div style={{
            position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%',
            background: currentTheme.accent, filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none', borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', right: '-10%', width: '60%', height: '60%',
            background: currentTheme.text, filter: 'blur(80px)', opacity: 0.1, pointerEvents: 'none', borderRadius: '50%'
          }} />

          {/* Subtle GitHub Logo Watermark */}
          <svg
            className="card-preview__watermark"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '300px',
              height: '300px',
              opacity: 0.03,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%) rotate(-5deg)'
            }}
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>

          <div className="card-preview__inner" style={{ position: 'relative', zIndex: 10, background: theme === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(10px)', border: theme === 'light' ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '28px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: theme === 'light' ? '0 4px 20px rgba(0,0,0,0.06)' : 'inset 0 0 40px rgba(255,255,255,0.02)' }}>
            
            {/* Avatar */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', inset: '-5px', background: `linear-gradient(135deg, ${currentTheme.accent}, #fff, ${currentTheme.accent})`, borderRadius: '50%', opacity: 0.8, filter: 'blur(2px)' }} />
              <img
                src={user.avatar_url}
                alt={user.login}
                style={{ position: 'relative', width: '84px', height: '84px', borderRadius: '50%', border: `3px solid ${currentTheme.background.split(',')[1] || '#161b22'}`, zIndex: 2, background: '#fff' }}
                crossOrigin="anonymous"
              />
            </div>

            {/* Name & Username */}
            <h1 style={{ color: currentTheme.text, fontSize: '1.4rem', fontWeight: 800, margin: '0 0 4px 0', letterSpacing: '-0.02em', textAlign: 'center' }}>
              {user.name || user.login}
            </h1>
            <p style={{ color: currentTheme.subtext, fontSize: '0.9rem', margin: '0 0 16px 0', fontFamily: 'monospace' }}>
              @{user.login}
            </p>

            {/* Bio */}
            {user.bio && (
              <p style={{ color: currentTheme.subtext, fontSize: '0.85rem', lineHeight: 1.4, maxWidth: '340px', margin: '0 0 16px 0', textAlign: 'center' }}>
                {user.bio.length > 90 ? user.bio.slice(0, 90) + '...' : user.bio}
              </p>
            )}

            {/* Meta Details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', color: currentTheme.subtext, fontSize: '0.75rem', marginBottom: '20px' }}>
              {user.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.596 11.596a6.5 6.5 0 1 0-9.192 0L8 16l4.596-4.404ZM8 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
                  </svg>
                  {user.location}
                </span>
              )}
              {user.company && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1.5 14.25c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25v12.5ZM1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.777.871.777 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75h-3C.784 16 0 15.216 0 14.25V1.75C0 .784.784 0 1.75 0ZM3.5 4h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1ZM3 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM3.5 10h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1ZM7 4.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5ZM7.5 7h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1ZM7 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5Z" />
                  </svg>
                  {user.company}
                </span>
              )}
              {user.twitter_username && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
                  </svg>
                  @{user.twitter_username}
                </span>
              )}
              {user.created_at && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0Zm0 3.5h8.5a.25.25 0 0 1 .25.25V6h-11V3.75a.25.25 0 0 1 .25-.25Zm-2 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Z" />
                  </svg>
                  Joined {formatDate(user.created_at)}
                </span>
              )}
            </div>

            {/* 4-Column Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', width: '100%', marginBottom: '20px' }}>
              {[
                { label: 'Repos', value: user.public_repos },
                { label: 'Followers', value: user.followers },
                { label: 'Following', value: user.following },
                { label: 'Gists', value: user.public_gists },
              ].map((stat) => (
                <div key={stat.label} style={{ background: theme === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)', padding: '10px 4px', borderRadius: '8px', textAlign: 'center', border: theme === 'light' ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 800, color: currentTheme.accent, marginBottom: '2px', fontFamily: 'monospace' }}>
                    {stat.value}
                  </span>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: currentTheme.subtext }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Languages */}
            {topLangs.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                {topLangs.map((lang) => (
                  <span key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: currentTheme.subtext, background: theme === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)', padding: '4px 8px', borderRadius: '20px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: lang.color }} />
                    {lang.name}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: currentTheme.subtext, fontSize: '0.7rem', paddingTop: '16px', borderTop: `1px solid ${currentTheme.border}`, width: '100%' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>github.com/{user.login}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card-generator__actions">
        <button
          className="card-generator__action-btn card-generator__action-btn--download"
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
