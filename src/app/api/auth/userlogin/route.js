import User from "@/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/mongodb";

export async function POST(request) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Sign a JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET, // Your JWT secret from .env
            { expiresIn: '1h' }     // Token valid for 1 hour
        );

        // Return the token and success message
        return NextResponse.json(
            { message: "Login successful", token },
            { status: 200 }
        );

    } catch (error) {
        console.error("Login error", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
