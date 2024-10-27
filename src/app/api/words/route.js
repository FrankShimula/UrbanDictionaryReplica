import Terms from "@/model/Terms";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";

export async function GET() {
    await dbConnect();
    try {
        // Find all words, sort by `createdAt` field in descending order
        const words = await Terms.find({}).sort({ createdAt: -1 });
        return NextResponse.json(words, { status: 200 });
    } catch (error) {
        console.error("Error fetching words", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
