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
            word: { $regex: query, $options: "i" },
        }).limit(20);

        return NextResponse.json({ words }, { status: 200 });
    } catch (err) {
        console.error("Search error:", err);
        if (err instanceof Error) {
            return NextResponse.json({ message: err.message }, { status: 500 });
        }
        return NextResponse.json({ message: "Unknown error occurred" }, { status: 500 });
    }
}
