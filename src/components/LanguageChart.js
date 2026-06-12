'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/components/chart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LanguageChart({ languages }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="language-chart language-chart--empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 18l2-2-2-2" /><path d="M8 18l-2-2 2-2" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
        <p>No language data available</p>
      </div>
    );
  }

  const topLanguages = languages.slice(0, 8);
  const otherPercentage = languages.slice(8).reduce((sum, l) => sum + l.percentage, 0);

  const chartLabels = topLanguages.map((l) => l.name);
  const chartData = topLanguages.map((l) => l.percentage);
  const chartColors = topLanguages.map((l) => l.color || '#8b949e');

  if (otherPercentage > 0) {
    chartLabels.push('Other');
    chartData.push(parseFloat(otherPercentage.toFixed(1)));
    chartColors.push('#8b949e');
  }

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: chartColors,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 2,
        hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
        hoverBorderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    layout: {
      padding: 12, // Prevents the hover offset from being clipped by the canvas bounds
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13, 17, 23, 0.95)',
        titleColor: '#f0f6fc',
        bodyColor: '#f0f6fc',
        borderColor: '#30363d',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.parsed}%`,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1400,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="language-chart">
      <div className="language-chart__canvas">
        <Doughnut data={data} options={options} />
      </div>
      <div className="language-chart__legend">
        {chartLabels.map((label, i) => (
          <div key={label} className="language-chart__legend-item">
            <span
              className="language-chart__legend-dot"
              style={{ backgroundColor: chartColors[i] }}
            />
            <span className="language-chart__legend-name">{label}</span>
            <span className="language-chart__legend-pct">{chartData[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
