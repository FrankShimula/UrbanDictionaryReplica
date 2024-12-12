import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Terms from "@/model/Terms";

export async function POST(req, { params }) {
  await dbConnect();
  const { wordId } = params;
  const { action, guestId } = await req.json();

  if (!guestId) {
    return NextResponse.json(
      { message: "Guest identification required" },
      { status: 400 }
    );
  }

  try {
    // Find the term first
    const term = await Terms.findById(wordId);
    if (!term) {
      return NextResponse.json({ message: "Term not found" }, { status: 404 });
    }

    // Initialize arrays if they don't exist
    if (!Array.isArray(term.upvoterIds)) term.upvoterIds = [];
    if (!Array.isArray(term.downvoterIds)) term.downvoterIds = [];

    // Check current vote status
    const hasUpvoted = term.upvoterIds.includes(guestId);
    const hasDownvoted = term.downvoterIds.includes(guestId);

    // Handle upvote action
    if (action === "upvote") {
      if (hasUpvoted) {
        // If already upvoted, remove the upvote (toggle off)
        term.upvoterIds = term.upvoterIds.filter(id => id !== guestId);
      } else {
        // If was downvoted, remove the downvote first
        if (hasDownvoted) {
          term.downvoterIds = term.downvoterIds.filter(id => id !== guestId);
        }
        // Add the upvote
        term.upvoterIds.push(guestId);
      }
    }
    // Handle downvote action
    else if (action === "downvote") {
      if (hasDownvoted) {
        // If already downvoted, remove the downvote (toggle off)
        term.downvoterIds = term.downvoterIds.filter(id => id !== guestId);
      } else {
        // If was upvoted, remove the upvote first
        if (hasUpvoted) {
          term.upvoterIds = term.upvoterIds.filter(id => id !== guestId);
        }
        // Add the downvote
        term.downvoterIds.push(guestId);
      }
    }

    // Save changes
    await term.save();

    // Fetch fresh data to ensure we have the latest state
    const updatedTerm = await Terms.findById(wordId);

    return NextResponse.json({
      message: "Vote updated successfully",
      word: {
        ...updatedTerm.toObject(),
        _id: updatedTerm._id,
        upvotes: updatedTerm.upvotes,
        downvotes: updatedTerm.downvotes,
        upvoterIds: updatedTerm.upvoterIds,
        downvoterIds: updatedTerm.downvoterIds
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