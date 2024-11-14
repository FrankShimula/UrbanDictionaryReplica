import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Word from "@/model/Terms";

export async function POST(req, { params }) {
    await dbConnect();
    const { wordId } = await params;
    const { action } = await req.json();

    try {
        const word = await Word.findById(wordId);
        if (!word) {
            return NextResponse.json({ message: "Word not found" }, { status: 404 });
        }

        if (action === "upvote") {
            if (word.upvotes < 1) {
                word.upvotes += 1;
                if (word.downvotes > 0) word.downvotes -= 1;
            }
        } else if (action === "downvote") {
            if (word.downvotes < 1) {
                word.downvotes += 1;
                if (word.upvotes > 0) word.upvotes -= 1;
            }
        } else if (action === "remove") {
            word.upvotes = Math.max(0, word.upvotes - 1);
            word.downvotes = Math.max(0, word.downvotes - 1);
        } else {
            return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        await word.save();
        return NextResponse.json({ message: "Vote updated", word }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
