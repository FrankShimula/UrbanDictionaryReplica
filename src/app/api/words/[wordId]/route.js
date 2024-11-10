import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Word from "@/model/Terms";

export async function POST(req, { params }) {
    const { wordId } = await params;
    const { action } = await req.json();

    await dbConnect();

    try {
        const word = await Word.findById(wordId);
        if (!word) {
            return NextResponse.json({ message: "Word not found" }, { status: 404 });
        }

        // Handle the different voting actions
        if (action === "upvote") {
            word.upvotes += 1;
        } else if (action === "downvote") {
            word.downvotes += 1;
        } else if (action === "remove") {
            // If the action is remove, check what type of vote to remove
            const previousVote = req.headers.get("previous-vote");
            if (previousVote === "upvote" && word.upvotes > 0) {
                word.upvotes -= 1;
            } else if (previousVote === "downvote" && word.downvotes > 0) {
                word.downvotes -= 1;
            }
        } else {
            return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        await word.save();

        return NextResponse.json({ message: "Vote processed", word }, { status: 200 });
    } catch (error) {
        console.error("Error processing vote:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
