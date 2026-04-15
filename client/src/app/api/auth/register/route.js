import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import getJwtSecret from "@/utils/auth";


export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, email, password } = body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin already exists" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email },
      getJwtSecret(),
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        admin: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

