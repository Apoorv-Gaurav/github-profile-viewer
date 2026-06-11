import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';
import { fetchUser } from '@/lib/github';

const CACHE_TTL = 600; // 10 minutes

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
    const cacheKey = `user:${username.toLowerCase()}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch from GitHub
    const { data, error } = await fetchUser(username);

    if (error) {
      if (error === 'Not found') {
        return NextResponse.json({ error: `User '${username}' not found` }, { status: 404 });
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
