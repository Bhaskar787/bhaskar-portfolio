/**
 * One-off admin seed script — replaces the public /admin/register flow.
 *
 * Usage:
 *   node scripts/create-admin.js "Bhaskar Budha" budhabhaskar11@gmail.com "YourStrongPassword123"
 *
 * Or set ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in your .env and just run:
 *   node scripts/create-admin.js
 *
 * Safe to re-run: if an admin with that email already exists, it updates
 * the name/password instead of creating a duplicate (handy for rotating
 * your password later — just run it again with a new password).
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const [, , argName, argEmail, argPassword] = process.argv;

const name     = argName     || process.env.ADMIN_NAME;
const email    = argEmail    || process.env.ADMIN_EMAIL;
const password = argPassword || process.env.ADMIN_PASSWORD;

async function main() {
  if (!name || !email || !password) {
    console.error(
      "Missing admin details.\n" +
      "Usage: node scripts/create-admin.js \"Full Name\" you@email.com \"YourPassword\"\n" +
      "  (or set ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env)"
    );
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set in your environment/.env file.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password should be at least 8 characters.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  // Inline schema — deliberately not importing src/models/Admin.js here,
  // since that file may use Next.js path aliases (@/...) this plain
  // Node script isn't set up to resolve.
  const Admin = mongoose.models.Admin || mongoose.model(
    "Admin",
    new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    })
  );

  const hashed = await bcrypt.hash(password, 10);

  const existing = await Admin.findOne({ email });
  if (existing) {
    existing.name = name;
    existing.password = hashed;
    await existing.save();
    console.log(`Updated existing admin: ${email}`);
  } else {
    await Admin.create({ name, email, password: hashed });
    console.log(`Created admin: ${email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed admin:", err.message);
  process.exit(1);
});