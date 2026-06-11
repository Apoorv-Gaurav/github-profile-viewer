import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';
import { fetchContributions } from '@/lib/github';

const CACHE_TTL = 900; // 15 minutes

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
    const cacheKey = `contributions:${username.toLowerCase()}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch contributions via GraphQL (requires GITHUB_TOKEN)
    const { data, error } = await fetchContributions(username);

    if (error) {
      if (error.includes('token is required')) {
        return NextResponse.json(
          { error: 'A GitHub token is required to fetch contribution data' },
          { status: 403 },
        );
      }
      if (error.startsWith('Rate limited')) {
        return NextResponse.json({ error }, { status: 429 });
      }
      return NextResponse.json({ error }, { status: 500 });
    }

    // Cache and return
    setCache(cacheKey, data, CACHE_TTL);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 });
  }
}
