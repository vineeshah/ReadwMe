// Very small in-memory fixed-window rate limiter.
const hits = new Map();

export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry) {
    hits.set(key, { count: 1, start: now });
    return { ok: true, remaining: limit - 1 };
  }

  if (now - entry.start > windowMs) {
    entry.count = 0;
  }

  entry.count++;
  return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
}
