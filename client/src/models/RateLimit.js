import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  key:       { type: String, required: true, unique: true }, // e.g. "contact:203.0.113.7"
  count:     { type: Number, default: 1 },
  expiresAt: { type: Date, required: true },
});

// TTL index: MongoDB automatically deletes the document once expiresAt is in
// the past (checked roughly every 60s by Mongo's background task) — so this
// collection self-cleans, no cron job needed.
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimit || mongoose.model("RateLimit", rateLimitSchema);