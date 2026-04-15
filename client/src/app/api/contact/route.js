import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";



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
    await connectDB();

    const body = await req.json();

    const newContact = await Contact.create(body);

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
