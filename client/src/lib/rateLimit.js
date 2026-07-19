/**
 * MongoDB-backed rate limiter.
 *
 * An earlier version of this kept counters in a plain in-memory Map. That
 * broke in practice because Next.js dev mode (and Turbopack fast-refresh in
 * particular) can reload a route's module — wiping the in-memory Map — much
 * more often than expected, so the counter kept silently resetting to zero
 * and never actually blocked anyone. Storing the counter in the database
 * instead means it survives reloads, restarts, and would even work correctly
 * if this were ever deployed across multiple server instances.
 */
import connectDB from "@/lib/db";
import RateLimit from "@/models/RateLimit";

/**
 * @param {string} key         unique identifier for the caller, e.g. `contact:1.2.3.4`
 * @param {object} opts
 * @param {number} opts.limit     max allowed requests within the window (default 3)
 * @param {number} opts.windowMs  window length in ms (default 10 minutes)
 * @returns {Promise<{ allowed: boolean, resetAt: Date }>}
 */
export async function rateLimit(key, { limit = 3, windowMs = 10 * 60 * 1000 } = {}) {
  await connectDB();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);

  const activeDoc = await RateLimit.findOneAndUpdate(
    { key, expiresAt: { $gt: now }, count: { $lt: limit } },
    { $inc: { count: 1 } },
    { new: true }
  );

  if (activeDoc) {
    return { allowed: true, resetAt: activeDoc.expiresAt };
  }

  const existing = await RateLimit.findOne({ key });

  if (existing) {
    if (existing.expiresAt > now) {
      return { allowed: false, resetAt: existing.expiresAt };
    }

    const resetDoc = await RateLimit.findOneAndUpdate(
      { key, expiresAt: { $lte: now } },
      { $set: { count: 1, expiresAt } },
      { new: true }
    );

    return { allowed: true, resetAt: resetDoc.expiresAt };
  }

  const created = await RateLimit.findOneAndUpdate(
    { key },
    { $setOnInsert: { key, count: 1, expiresAt } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { allowed: true, resetAt: created.expiresAt };
}

/** Best-effort client IP extraction from a Next.js Route Handler `Request`. */
export function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown"; // e.g. plain localhost dev with no proxy in front
}