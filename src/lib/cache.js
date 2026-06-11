import NodeCache from 'node-cache';

// Singleton cache instance — 10-minute default TTL, check expired keys every 120s
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Retrieve a value from the cache.
 * @param {string} key
 * @returns {*} cached value or undefined
 */
export function getCache(key) {
  return cache.get(key);
}

/**
 * Store a value in the cache.
 * @param {string} key
 * @param {*}      value
 * @param {number} [ttl] – seconds; omit to use the default (600s)
 */
export function setCache(key, value, ttl) {
  if (ttl !== undefined) {
    cache.set(key, value, ttl);
  } else {
    cache.set(key, value);
  }
}

/**
 * Flush every key from the cache.
 */
export function clearCache() {
  cache.flushAll();
}

export default cache;
