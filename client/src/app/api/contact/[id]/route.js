import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

// GET single contact 
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;


    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — mark a message read/unread (used when the admin opens it)
export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const read = typeof body.read === "boolean" ? body.read : true;

    const updated = await Contact.findByIdAndUpdate(id, { read }, { new: true });
    if (!updated) {
      return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE contact admin can delete the messgae
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const deletedContact = await Contact.findByIdAndDelete(id);
   if (!deletedContact) {
      return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error) {
   
    console.error("Delete Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}