import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Word from "@/model/Terms";

export async function POST(req, { params }) {
  await dbConnect();
  const { wordId } = await params;
  const { action, guestId } = await req.json();

  if (!guestId) {
    return NextResponse.json(
      { message: "Guest identification required" },
      { status: 400 }
    );
  }

  try {
    const word = await Word.findById(wordId);
    if (!word) {
      return NextResponse.json({ message: "Word not found" }, { status: 404 });
    }

    // Initialize arrays if they don't exist
    word.upvoterIds = word.upvoterIds || [];
    word.downvoterIds = word.downvoterIds || [];

    const hasUpvoted = word.upvoterIds.includes(guestId);
    const hasDownvoted = word.downvoterIds.includes(guestId);

    // Reddit-style voting logic
    if (action === "upvote") {
      if (hasUpvoted) {
        // If already upvoted, remove the upvote (toggle off)
        word.upvoterIds = word.upvoterIds.filter(id => id !== guestId);
      } else {
        // If not upvoted:
        // 1. If downvoted, remove the downvote first
        if (hasDownvoted) {
          word.downvoterIds = word.downvoterIds.filter(id => id !== guestId);
        }
        // 2. Add the upvote
        word.upvoterIds.push(guestId);
      }
    } else if (action === "downvote") {
      if (hasDownvoted) {
        // If already downvoted, remove the downvote (toggle off)
        word.downvoterIds = word.downvoterIds.filter(id => id !== guestId);
      } else {
        // If not downvoted:
        // 1. If upvoted, remove the upvote first
        if (hasUpvoted) {
          word.upvoterIds = word.upvoterIds.filter(id => id !== guestId);
        }
        // 2. Add the downvote
        word.downvoterIds.push(guestId);
      }
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // Calculate final vote counts from the voter arrays
    word.upvotes = word.upvoterIds.length;
    word.downvotes = word.downvoterIds.length;

    await word.save();

    return NextResponse.json({
      message: "Vote updated successfully",
      word: {
        ...word.toObject(),
        _id: word._id,
        upvotes: word.upvotes,
        downvotes: word.downvotes,
        upvoterIds: word.upvoterIds,
        downvoterIds: word.downvoterIds
      }
    });

  } catch (error) {
    console.error("Voting error:", error);
    return NextResponse.json(
      { message: "Failed to process your vote" },
      { status: 500 }
    );
  }
}