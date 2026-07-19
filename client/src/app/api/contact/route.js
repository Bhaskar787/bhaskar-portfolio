import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { rateLimit, getClientIp } from "@/lib/rateLimit";



// GET all contacts admin can view the contact
export async function GET() {
  try {
    await connectDB();

    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST contact this is from the client side 
export async function POST(req) {
  try {
    // Cap how often the same visitor can hit this endpoint, so one person
    // (or a script) can't flood the inbox with repeated submissions.
    const ip = getClientIp(req);
    const { allowed, resetAt } = await rateLimit(`contact:${ip}`, {
      limit: 3,            // max 3 messages
      windowMs: 10 * 60 * 1000, // per 10 minutes
    });

    if (!allowed) {
      const retryAfterSec = Math.max(1, Math.ceil((new Date(resetAt).getTime() - Date.now()) / 1000));
      return NextResponse.json(
        { error: "You're sending messages too quickly. Please try again in a few minutes." },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
      );
    }

    await connectDB();

    const body = await req.json();

    const newContact = await Contact.create(body);

    // Push a real-time event to any connected admin dashboards.
    // `global.__io` is set by server.js (the custom Socket.IO server) —
    // it won't exist when running under plain `next dev`/serverless,
    // so this is guarded and simply skipped in that case.
    if (global.__io) {
      global.__io.to("admin-room").emit("new-message", newContact);
    }

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}