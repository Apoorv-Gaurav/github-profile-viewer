const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// ---------------------------------------------------------------------------
// Language → colour map (used by fetchUserLanguages)
// ---------------------------------------------------------------------------
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Lua: '#000080',
  R: '#198CE7',
  Scala: '#c22d40',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Jupyter: '#DA5B0B',
  SCSS: '#c6538c',
  Dockerfile: '#384d54',
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function baseHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'github-profile-viewer',
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * Perform a REST fetch against the GitHub API.
 * Returns `{ data, error }` — never throws.
 */
async function githubFetch(endpoint, extraHeaders = {}) {
  try {
    const res = await fetch(`${GITHUB_API}${endpoint}`, {
      headers: { ...baseHeaders(), ...extraHeaders },
    });

    if (res.status === 404) {
      return { data: null, error: 'Not found' };
    }
    if (res.status === 403 || res.status === 429) {
      const reset = res.headers.get('x-ratelimit-reset');
      return {
        data: null,
        error: `Rate limited. Resets at ${reset ? new Date(reset * 1000).toISOString() : 'unknown'}`,
      };
    }
    if (!res.ok) {
      const body = await res.text();
      return { data: null, error: `GitHub API error ${res.status}: ${body}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

// ---------------------------------------------------------------------------
// Public API helpers
// ---------------------------------------------------------------------------

/**
 * Fetch a single GitHub user profile.
 */
export async function fetchUser(username) {
  return githubFetch(`/users/${encodeURIComponent(username)}`);
}

/**
 * Fetch one page of repositories for a user.
 */
export async function fetchRepos(username, page = 1, perPage = 100) {
  return githubFetch(
    `/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${perPage}&page=${page}`,
  );
}

/**
 * Fetch the language‐byte breakdown for a single repository.
 */
export async function fetchRepoLanguages(owner, repo) {
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
  );
}

/**
 * Aggregate language usage across every public repo of a user.
 * Returns a sorted array: [{ name, bytes, percentage, color }]
 */
export async function fetchUserLanguages(username) {
  try {
    // 1. Grab all repos (paginate)
    const allRepos = [];
    let page = 1;
    while (true) {
      const { data, error } = await fetchRepos(username, page, 100);
      if (error) return { data: null, error };
      if (!data || data.length === 0) break;
      allRepos.push(...data);
      if (data.length < 100) break;
      page++;
    }

    // 2. Fetch languages for each repo in parallel (batch of 10)
    const totals = {};
    for (let i = 0; i < allRepos.length; i += 10) {
      const batch = allRepos.slice(i, i + 10);
      const results = await Promise.all(
        batch.map((r) => fetchRepoLanguages(r.owner.login, r.name)),
      );
      for (const { data } of results) {
        if (!data) continue;
        for (const [lang, bytes] of Object.entries(data)) {
          totals[lang] = (totals[lang] || 0) + bytes;
        }
      }
    }

    // 3. Convert to sorted array with percentages + colours
    const totalBytes = Object.values(totals).reduce((a, b) => a + b, 0);
    const languages = Object.entries(totals)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? parseFloat(((bytes / totalBytes) * 100).toFixed(2)) : 0,
        color: LANGUAGE_COLORS[name] || '#8b8b8b',
      }))
      .sort((a, b) => b.bytes - a.bytes);

    return { data: languages, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Fetch contribution data via the GraphQL API.
 * Requires a GITHUB_TOKEN — returns null data when missing.
 */
export async function fetchContributions(username) {
  if (!GITHUB_TOKEN) {
    return { data: null, error: 'GitHub token is required for contribution data' };
  }

  const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        ...baseHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { data: null, error: `GraphQL error ${res.status}: ${body}` };
    }

    const json = await res.json();

    if (json.errors) {
      return { data: null, error: json.errors.map((e) => e.message).join('; ') };
    }

    return { data: json.data.user.contributionsCollection, error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

/**
 * Fetch the raw README content for a repository.
 */
export async function fetchReadme(owner, repo) {
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
    { Accept: 'application/vnd.github.raw+json' },
  );
}

/**
 * Fetch detailed information about a single repository.
 */
export async function fetchRepoDetails(owner, repo) {
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
  );
}

/**
 * Fetch recent commits for a repository.
 */
export async function fetchRepoCommits(owner, repo, perPage = 10) {
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=${perPage}`,
  );
}

/**
 * Fetch public events for a user.
 */
export async function fetchEvents(username, perPage = 30) {
  return githubFetch(
    `/users/${encodeURIComponent(username)}/events/public?per_page=${perPage}`,
  );
}

/**
 * Fetch current rate-limit status.
 */
export async function getRateLimit() {
  return githubFetch('/rate_limit');
}
