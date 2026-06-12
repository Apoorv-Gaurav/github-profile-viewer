'use client';

import { useState, useMemo } from 'react';
import '../styles/components/heatmap.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

function formatTooltipDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function ContributionHeatmap({ contributions }) {
  const [tooltip, setTooltip] = useState(null);

  if (!contributions) {
    return (
      <div className="heatmap heatmap--empty">
        <div className="heatmap__empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p>Contribution data requires a GitHub token</p>
          <span className="heatmap__empty-hint">
            Add a <code>GITHUB_TOKEN</code> to <code>.env.local</code> to see the contribution heatmap
          </span>
        </div>
      </div>
    );
  }

  const { weeks, totalContributions } = contributions;

  // Calculate month labels — only place a label if there are at least 3 weeks
  // gap from the previous label to prevent overlap
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    let lastWeekIdx = -4;
    weeks.forEach((week, weekIdx) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const d = new Date(firstDay.date + 'T00:00:00');
        const month = d.getMonth();
        if (month !== lastMonth && weekIdx - lastWeekIdx >= 3) {
          labels.push({ month: MONTHS[month], weekIdx });
          lastMonth = month;
          lastWeekIdx = weekIdx;
        } else if (month !== lastMonth) {
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [weeks]);

  // Build columns: each week is a column of 7 rows
  return (
    <div className="heatmap">
      <div className="heatmap__summary">
        <span className="heatmap__total">
          {totalContributions.toLocaleString()} contributions in the last year
        </span>
      </div>

      <div className="heatmap__scroll">
        {/* Month labels row */}
        <div className="heatmap__months" style={{ gridTemplateColumns: `repeat(${weeks.length}, var(--heatmap-size))` }}>
          {monthLabels.map((label, i) => (
            <span
              key={i}
              className="heatmap__month"
              style={{ gridColumnStart: label.weekIdx + 1 }}
            >
              {label.month}
            </span>
          ))}
        </div>

        <div className="heatmap__graph">
          {/* Day labels */}
          <div className="heatmap__days">
            <span className="heatmap__day-label heatmap__day-label--hidden"></span>
            <span className="heatmap__day-label">Mon</span>
            <span className="heatmap__day-label heatmap__day-label--hidden"></span>
            <span className="heatmap__day-label">Wed</span>
            <span className="heatmap__day-label heatmap__day-label--hidden"></span>
            <span className="heatmap__day-label">Fri</span>
            <span className="heatmap__day-label heatmap__day-label--hidden"></span>
          </div>

          {/* Grid of cells — each week is a column */}
          <div className="heatmap__grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, var(--heatmap-size))` }}>
            {weeks.map((week, weekIdx) =>
              week.contributionDays.map((day) => (
                <div
                  key={`${weekIdx}-${day.weekday}`}
                  className={`heatmap__cell heatmap__cell--${getLevel(day.contributionCount)}`}
                  style={{
                    gridColumn: weekIdx + 1,
                    gridRow: day.weekday + 1,
                  }}
                  onMouseEnter={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    setTooltip({
                      count: day.contributionCount,
                      date: formatTooltipDate(day.date),
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="heatmap__legend">
        <span className="heatmap__legend-label">Less</span>
        <div className="heatmap__legend-cell heatmap__legend-cell--0" />
        <div className="heatmap__legend-cell heatmap__legend-cell--1" />
        <div className="heatmap__legend-cell heatmap__legend-cell--2" />
        <div className="heatmap__legend-cell heatmap__legend-cell--3" />
        <div className="heatmap__legend-cell heatmap__legend-cell--4" />
        <span className="heatmap__legend-label">More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap__tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <strong>{tooltip.count} contribution{tooltip.count !== 1 ? 's' : ''}</strong>
          <span>{tooltip.date}</span>
        </div>
      )}
    </div>
  );
}
