import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

// GET the number of unread contact messages — used for the admin
// sidebar/header notification badge so we don't have to pull every
// message body just to show a count.
export async function GET() {
  try {
    await connectDB();
    const count = await Contact.countDocuments({ read: { $ne: true } });
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}