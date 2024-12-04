import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Terms from "@/model/Terms";

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ message: "Query is required" }, { status: 400 });
    }

    try {
        const words = await Terms.find({
            word: { $regex: query, $options: "i" }, // Case-insensitive partial match
        }).limit(20);

        return NextResponse.json({ words }, { status: 200 });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
