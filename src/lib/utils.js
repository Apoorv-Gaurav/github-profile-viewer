/**
 * Format a number into a human-readable short form.
 * 1234 → '1.2k', 1234567 → '1.2M'
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

/**
 * Format an ISO date string to a friendly representation.
 * '2023-01-15T10:30:00Z' → 'Jan 15, 2023'
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Return a human-readable "time ago" string.
 * '2 hours ago', '3 days ago', 'just now', etc.
 */
export function timeAgo(dateString) {
  if (!dateString) return '';
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Return a friendly account-age string like '5 years, 3 months'.
 */
export function getAccountAge(createdAt) {
  if (!createdAt) return '';
  const created = new Date(createdAt);
  const now = new Date();

  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  return parts.join(', ') || 'Less than a month';
}

/**
 * Truncate text to `maxLength` characters, appending an ellipsis if truncated.
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Return a color hex string for a given programming language.
 */
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB',
  HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', Lua: '#000080',
  R: '#198CE7', Scala: '#c22d40', Vue: '#41b883', Svelte: '#ff3e00',
  Jupyter: '#DA5B0B', SCSS: '#c6538c', Dockerfile: '#384d54',
};

export function getLanguageColor(language) {
  return LANGUAGE_COLORS[language] || '#8b949e';
}
