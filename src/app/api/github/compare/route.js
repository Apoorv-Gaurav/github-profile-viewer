import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/cache';
import { fetchUser, fetchUserLanguages } from '@/lib/github';

const USER_CACHE_TTL = 600; // 10 minutes
const LANG_CACHE_TTL = 1800; // 30 minutes

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user1 = searchParams.get('user1');
    const user2 = searchParams.get('user2');

    if (!user1 || !user2) {
      return NextResponse.json(
        { error: 'Missing required parameters: user1 and user2' },
        { status: 400 },
      );
    }

    // Helper: fetch profile + languages for one user, using individual caches
    async function fetchUserData(username) {
      const userKey = `user:${username.toLowerCase()}`;
      const langKey = `languages:${username.toLowerCase()}`;

      // Profile
      let profile = getCache(userKey);
      if (!profile) {
        const { data, error } = await fetchUser(username);
        if (error) throw new Error(`${username}: ${error}`);
        profile = data;
        setCache(userKey, profile, USER_CACHE_TTL);
      }

      // Languages
      let languages = getCache(langKey);
      if (!languages) {
        const { data, error } = await fetchUserLanguages(username);
        if (error) throw new Error(`${username} languages: ${error}`);
        languages = data;
        setCache(langKey, languages, LANG_CACHE_TTL);
      }

      return { ...profile, languages };
    }

    // Fetch both users in parallel
    const [result1, result2] = await Promise.all([
      fetchUserData(user1),
      fetchUserData(user2),
    ]);

    return NextResponse.json({ user1: result1, user2: result2 });
  } catch (err) {
    const message = err.message || 'Unknown error';

    if (message.includes('Not found')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message.includes('Rate limited')) {
      return NextResponse.json({ error: message }, { status: 429 });
    }
    return NextResponse.json({ error: `Internal server error: ${message}` }, { status: 500 });
  }
}
