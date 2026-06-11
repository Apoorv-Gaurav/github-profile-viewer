import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';
import { fetchReadme } from '@/lib/github';

const CACHE_TTL = 1800; // 30 minutes

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Missing required parameters: owner and repo' },
        { status: 400 },
      );
    }

    // Check cache
    const cacheKey = `readme:${owner.toLowerCase()}/${repo.toLowerCase()}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch README
    const { data, error } = await fetchReadme(owner, repo);

    if (error) {
      if (error === 'Not found') {
        return NextResponse.json(
          { error: `README not found for ${owner}/${repo}` },
          { status: 404 },
        );
      }
      if (error.startsWith('Rate limited')) {
        return NextResponse.json({ error }, { status: 429 });
      }
      return NextResponse.json({ error }, { status: 500 });
    }

    const result = { content: data };

    // Cache and return
    setCache(cacheKey, result, CACHE_TTL);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 });
  }
}
