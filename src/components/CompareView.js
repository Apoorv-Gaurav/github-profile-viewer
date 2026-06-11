'use client';

import Image from 'next/image';
import { formatNumber } from '../lib/utils';
import '../styles/components/compare.css';

const COMPARE_STATS = [
  { key: 'public_repos', label: 'Repositories', icon: '📦' },
  { key: 'followers', label: 'Followers', icon: '👥' },
  { key: 'following', label: 'Following', icon: '➡️' },
  { key: 'public_gists', label: 'Gists', icon: '📝' },
];

function StatBar({ value1, value2, label, icon }) {
  const max = Math.max(value1, value2, 1);
  const pct1 = (value1 / max) * 100;
  const pct2 = (value2 / max) * 100;
  const winner = value1 > value2 ? 1 : value2 > value1 ? 2 : 0;

  return (
    <div className="compare__stat-row">
      <div className={`compare__stat-value compare__stat-value--left ${winner === 1 ? 'compare__stat-value--winner' : ''}`}>
        {formatNumber(value1)}
      </div>
      <div className="compare__stat-bar-container">
        <div className="compare__stat-bar compare__stat-bar--left">
          <div
            className={`compare__stat-bar-fill compare__stat-bar-fill--left ${winner === 1 ? 'compare__stat-bar-fill--winner' : ''}`}
            style={{ width: `${pct1}%` }}
          />
        </div>
        <span className="compare__stat-label">
          {icon} {label}
        </span>
        <div className="compare__stat-bar compare__stat-bar--right">
          <div
            className={`compare__stat-bar-fill compare__stat-bar-fill--right ${winner === 2 ? 'compare__stat-bar-fill--winner' : ''}`}
            style={{ width: `${pct2}%` }}
          />
        </div>
      </div>
      <div className={`compare__stat-value compare__stat-value--right ${winner === 2 ? 'compare__stat-value--winner' : ''}`}>
        {formatNumber(value2)}
      </div>
    </div>
  );
}

function ProfileSummary({ user }) {
  return (
    <div className="compare__profile-card">
      <div className="compare__avatar-wrapper">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={80}
          height={80}
          className="compare__avatar"
        />
      </div>
      <h3 className="compare__profile-name">{user.name || user.login}</h3>
      <p className="compare__profile-username">@{user.login}</p>
      {user.bio && <p className="compare__profile-bio">{user.bio}</p>}
    </div>
  );
}

export default function CompareView({ user1, user2 }) {
  // Calculate overall score
  let score1 = 0;
  let score2 = 0;
  COMPARE_STATS.forEach(({ key }) => {
    if ((user1[key] || 0) > (user2[key] || 0)) score1++;
    else if ((user2[key] || 0) > (user1[key] || 0)) score2++;
  });

  const overallWinner = score1 > score2 ? user1.login : score2 > score1 ? user2.login : null;

  return (
    <div className="compare__results">
      {/* Profile cards */}
      <div className="compare__profiles">
        <ProfileSummary user={user1} />
        <div className="compare__vs-badge">
          <span>VS</span>
        </div>
        <ProfileSummary user={user2} />
      </div>

      {/* Stats comparison */}
      <div className="compare__stats">
        <h3 className="compare__stats-title">Stats Comparison</h3>
        {COMPARE_STATS.map(({ key, label, icon }) => (
          <StatBar
            key={key}
            value1={user1[key] || 0}
            value2={user2[key] || 0}
            label={label}
            icon={icon}
          />
        ))}
      </div>

      {/* Language comparison */}
      {(user1.languages?.length > 0 || user2.languages?.length > 0) && (
        <div className="compare__languages">
          <h3 className="compare__stats-title">Top Languages</h3>
          <div className="compare__language-lists">
            <div className="compare__language-list">
              <h4>{user1.login}</h4>
              {(user1.languages || []).slice(0, 5).map((lang) => (
                <div key={lang.name} className="compare__language-item">
                  <span
                    className="compare__language-dot"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="compare__language-name">{lang.name}</span>
                  <span className="compare__language-pct">{lang.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="compare__language-list">
              <h4>{user2.login}</h4>
              {(user2.languages || []).slice(0, 5).map((lang) => (
                <div key={lang.name} className="compare__language-item">
                  <span
                    className="compare__language-dot"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="compare__language-name">{lang.name}</span>
                  <span className="compare__language-pct">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overall winner */}
      <div className="compare__winner-section">
        {overallWinner ? (
          <>
            <span className="compare__winner-trophy">🏆</span>
            <h3 className="compare__winner-text">
              <span className="compare__winner-name">{overallWinner}</span> wins overall!
            </h3>
            <p className="compare__winner-score">
              Score: {score1} - {score2}
            </p>
          </>
        ) : (
          <>
            <span className="compare__winner-trophy">🤝</span>
            <h3 className="compare__winner-text">It&apos;s a tie!</h3>
            <p className="compare__winner-score">
              Score: {score1} - {score2}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
