'use client';

import { useState } from 'react';
import SearchBar from '../../components/SearchBar';
import CompareView from '../../components/CompareView';
import { SkeletonProfile } from '../../components/Skeleton';
import '../../styles/components/compare.css';

export default function ComparePage() {
  const [user1Input, setUser1Input] = useState('');
  const [user2Input, setUser2Input] = useState('');
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCompared, setHasCompared] = useState(false);

  async function handleCompare() {
    const u1 = user1Input.trim();
    const u2 = user2Input.trim();

    if (!u1 || !u2) {
      setError('Please enter both usernames to compare.');
      return;
    }

    if (u1.toLowerCase() === u2.toLowerCase()) {
      setError('Please enter two different usernames.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasCompared(false);
    setUser1Data(null);
    setUser2Data(null);

    try {
      const res = await fetch(
        `/api/github/compare?user1=${encodeURIComponent(u1)}&user2=${encodeURIComponent(u2)}`
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Comparison failed (${res.status})`);
      }

      const data = await res.json();
      setUser1Data(data.user1);
      setUser2Data(data.user2);
      setHasCompared(true);
    } catch (err) {
      setError(err.message || 'Failed to compare users. Please check the usernames and try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setUser1Input('');
    setUser2Input('');
    setUser1Data(null);
    setUser2Data(null);
    setError(null);
    setHasCompared(false);
  }

  return (
    <div className="compare-page">
      <div className="compare-page__header">
        <h1 className="compare-page__title">Compare Profiles</h1>
        <p className="compare-page__subtitle">
          Enter two GitHub usernames to compare their profiles, stats, and activity
          side by side.
        </p>
      </div>

      {/* Search Inputs */}
      <div className="compare-page__inputs">
        <div className="compare-page__input-group">
          <label className="compare-page__label" htmlFor="compare-user1">
            First User
          </label>
          <input
            id="compare-user1"
            type="text"
            className="compare-page__input"
            placeholder="e.g. torvalds"
            value={user1Input}
            onChange={(e) => setUser1Input(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            disabled={loading}
          />
        </div>

        <div className="compare-page__vs">
          <span className="compare-page__vs-badge">VS</span>
        </div>

        <div className="compare-page__input-group">
          <label className="compare-page__label" htmlFor="compare-user2">
            Second User
          </label>
          <input
            id="compare-user2"
            type="text"
            className="compare-page__input"
            placeholder="e.g. gaearon"
            value={user2Input}
            onChange={(e) => setUser2Input(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
            disabled={loading}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="compare-page__actions">
        <button
          className="compare-page__button compare-page__button--primary"
          onClick={handleCompare}
          disabled={loading || !user1Input.trim() || !user2Input.trim()}
        >
          {loading ? (
            <>
              <span className="compare-page__spinner" />
              Comparing...
            </>
          ) : (
            '⚡ Compare'
          )}
        </button>

        {(hasCompared || error) && (
          <button
            className="compare-page__button compare-page__button--secondary"
            onClick={handleReset}
          >
            🔄 Reset
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="compare-page__error">
          <span className="compare-page__error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="compare-page__loading">
          <div className="compare-page__loading-col">
            <SkeletonProfile />
          </div>
          <div className="compare-page__loading-col">
            <SkeletonProfile />
          </div>
        </div>
      )}

      {/* Compare Results */}
      {hasCompared && user1Data && user2Data && (
        <div className="compare-page__results">
          <CompareView user1={user1Data} user2={user2Data} />
        </div>
      )}
    </div>
  );
}
