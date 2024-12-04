import { NextResponse } from "next/server";
import dbConnect from "@/utils/mongodb";
import Word from "@/model/Terms";

export async function GET(req, { params }) {
  const { letter } = params;

  await dbConnect();

  try {
    const words = await Word.find({ word: { $regex: `^${letter}`, $options: "i" } });
    return NextResponse.json(words, { status: 200 });
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
