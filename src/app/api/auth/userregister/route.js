import User from "@/model/User";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function GET() {
    await dbConnect();
    try {

        const users = await User.find({});
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    const { username, email, password } = await request.json();
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ message: "User already here" }, { status: 401 });
        }
        else {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const newUser = new User({ username, email, password: hashedPassword });
            await newUser.save();
            return NextResponse.json({ message: "User registered successfully" }, { status: 200 });

        }


    }
    catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
