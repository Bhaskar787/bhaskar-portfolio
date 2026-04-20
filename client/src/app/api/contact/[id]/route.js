import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/models/Contact";

// GET single contact 
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;


    const contact = await Contact.findById(id);

    if (!contact) {
      return NextResponse.json({ message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact);
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