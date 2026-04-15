import jwt from "jsonwebtoken";

import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import getJwtSecret from "@/utils/auth";


export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, name: admin.name },
      getJwtSecret(),
      { expiresIn: "1h" }
    );

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}