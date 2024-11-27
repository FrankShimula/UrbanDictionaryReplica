import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Word from "@/model/Terms";

export async function POST(req, { params }) {
    await dbConnect();
    const { wordId } = await params;
    const { action, userId } = await req.json(); // Include `userId` in the payload.

    try {
        const word = await Word.findById(wordId);
        if (!word) {
            return NextResponse.json({ message: "Word not found" }, { status: 404 });
        }

        // Ensure voter tracking arrays exist
        word.upvoterIds = word.upvoterIds || [];
        word.downvoterIds = word.downvoterIds || [];

        const hasUpvoted = word.upvoterIds.includes(userId);
        const hasDownvoted = word.downvoterIds.includes(userId);

        if (action === "upvote") {
            if (hasUpvoted) {
                // Remove the upvote if already upvoted
                word.upvoterIds = word.upvoterIds.filter((id) => id !== userId);
                word.upvotes = Math.max(0, word.upvotes - 1);
            } else {
                // Remove downvote if present, then apply upvote
                if (hasDownvoted) {
                    word.downvoterIds = word.downvoterIds.filter((id) => id !== userId);
                    word.downvotes = Math.max(0, word.downvotes - 1);
                }
                word.upvoterIds.push(userId);
                word.upvotes = word.upvoterIds.length;
            }
        } else if (action === "downvote") {
            if (hasDownvoted) {
                // Remove the downvote if already downvoted
                word.downvoterIds = word.downvoterIds.filter((id) => id !== userId);
                word.downvotes = Math.max(0, word.downvotes - 1);
            } else {
                // Remove upvote if present, then apply downvote
                if (hasUpvoted) {
                    word.upvoterIds = word.upvoterIds.filter((id) => id !== userId);
                    word.upvotes = Math.max(0, word.upvotes - 1);
                }
                word.downvoterIds.push(userId);
                word.downvotes = word.downvoterIds.length;
            }
        } else {
            return NextResponse.json({ message: "Invalid action" }, { status: 400 });
        }

        await word.save();

        // Respond with updated word
        return NextResponse.json({
            message: "Vote updated",
            word: {
                ...word.toObject(),
                upvotes: word.upvotes,
                downvotes: word.downvotes,
            },
        }, { status: 200 });

    } catch (error) {
        console.error("Voting error:", error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
