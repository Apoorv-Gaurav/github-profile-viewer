import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';
import { fetchRepos } from '@/lib/github';

const CACHE_TTL = 300; // 5 minutes

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Missing required parameter: username' },
        { status: 400 },
      );
    }

    // Check cache
    const cacheKey = `repos:${username.toLowerCase()}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Paginate through all repos
    const allRepos = [];
    let page = 1;

    while (true) {
      const { data, error } = await fetchRepos(username, page, 100);

      if (error) {
        if (error === 'Not found') {
          return NextResponse.json({ error: `User '${username}' not found` }, { status: 404 });
        }
        if (error.startsWith('Rate limited')) {
          return NextResponse.json({ error }, { status: 429 });
        }
        return NextResponse.json({ error }, { status: 500 });
      }

      if (!data || data.length === 0) break;
      allRepos.push(...data);
      if (data.length < 100) break;
      page++;
    }

    // Sort by updated_at descending
    allRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    // Cache and return
    setCache(cacheKey, allRepos, CACHE_TTL);
    return NextResponse.json(allRepos);
  } catch (err) {
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 });
  }
}
