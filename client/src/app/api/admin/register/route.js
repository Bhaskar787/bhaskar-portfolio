// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import Admin from "@/models/Admin";
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import getJwtSecret from "@/utils/auth";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { name, email, password } = body;

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
//     }

//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newAdmin = await Admin.create({ name, email, password: hashedPassword });

//     const token = jwt.sign(
//       { id: newAdmin._id, email: newAdmin.email, name: newAdmin.name },
//       getJwtSecret(),
//       { expiresIn: "7d" }
//     );

//     return NextResponse.json(
//       { admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email }, token },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Register error:", error);
//     return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";

// Public self-registration is intentionally disabled — this is a
// single-owner site. The one admin account is created/rotated via
// `node scripts/create-admin.js` directly against the database.
// See that script for details.
export async function POST() {
  return NextResponse.json(
    { error: "Registration is disabled. Contact the site owner." },
    { status: 403 }
  );
}