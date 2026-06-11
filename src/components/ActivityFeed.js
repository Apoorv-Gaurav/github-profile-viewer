'use client';

import { timeAgo } from '../lib/utils';
import '../styles/components/profile.css';

const EVENT_CONFIG = {
  PushEvent: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
      </svg>
    ),
    getText: (e) => {
      const count = e.payload?.commits?.length || 0;
      return `Pushed ${count} commit${count !== 1 ? 's' : ''} to`;
    },
  },
  CreateEvent: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    getText: (e) => `Created ${e.payload?.ref_type || 'repository'}${e.payload?.ref ? ` "${e.payload.ref}"` : ''} in`,
  },
  PullRequestEvent: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" />
        <path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
      </svg>
    ),
    getText: (e) => `${e.payload?.action === 'opened' ? 'Opened' : e.payload?.action === 'closed' ? 'Closed' : 'Updated'} PR in`,
  },
  IssuesEvent: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    getText: (e) => `${e.payload?.action === 'opened' ? 'Opened' : 'Closed'} issue in`,
  },
  WatchEvent: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-orange)" stroke="var(--accent-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    getText: () => 'Starred',
  },
  ForkEvent: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" />
        <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" /><line x1="12" y1="12" x2="12" y2="15" />
      </svg>
    ),
    getText: () => 'Forked',
  },
  IssueCommentEvent: {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    getText: () => 'Commented on',
  },
};

export default function ActivityFeed({ events }) {
  if (!events || events.length === 0) {
    return (
      <div className="activity-feed__empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <p>No recent activity</p>
      </div>
    );
  }

  const displayEvents = events
    .filter((e) => EVENT_CONFIG[e.type])
    .slice(0, 10);

  return (
    <div className="activity-feed">
      <ul className="activity-feed__list">
        {displayEvents.map((event, index) => {
          const config = EVENT_CONFIG[event.type];
          return (
            <li key={event.id || index} className="activity-feed__item">
              <div className="activity-feed__icon">{config.icon}</div>
              <div className="activity-feed__content">
                <p className="activity-feed__text">
                  {config.getText(event)}{' '}
                  <a
                    href={`https://github.com/${event.repo?.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="activity-feed__repo"
                  >
                    {event.repo?.name?.split('/')[1] || event.repo?.name}
                  </a>
                </p>
                <span className="activity-feed__time">{timeAgo(event.created_at)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
