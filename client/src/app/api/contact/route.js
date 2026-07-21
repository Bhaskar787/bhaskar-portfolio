import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import eventBus from "@/lib/eventBus";



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

    const plainContact = JSON.parse(JSON.stringify(newContact));

    // Push real-time event via internal EventBus (SSE)
    eventBus.emit("new-message", plainContact);

    // Push real-time event via Socket.IO if custom server is attached
    const io = process.__io || global.__io;
    if (io) {
      io.to("admin-room").emit("new-message", plainContact);
      io.emit("new-message", plainContact);
    }

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}