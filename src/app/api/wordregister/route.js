import Terms from "@/model/Terms";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/utils/mongodb";

export async function POST(request) {
    await dbConnect();

    try {
        // Extract the token from the Authorization header
        const token = request.headers.get("authorization")?.replace("Bearer ", "");

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify the token and extract the user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get word details from the request body
        const { word, definition, example } = await request.json();

        // Create new word with the author from the decoded token
        const newWord = new Terms({
            word,
            definition,
            example,
            author: decoded.username, // Use the user's email as the author
        });

        // Save the word in the database
        await newWord.save();

        return NextResponse.json({ message: "Word added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding word", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
