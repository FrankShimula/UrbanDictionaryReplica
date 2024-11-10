"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Word {
  _id: string;
  word: string;
  definition: string;
  example: string;
  author: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
}

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get("/api/words");
        setWords(response.data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  const handleVote = async (wordId: string, action: "upvote" | "downvote") => {
    try {
      // Retrieve vote history from localStorage
      const voteHistory = JSON.parse(
        localStorage.getItem("voteHistory") || "{}"
      );

      // Check if the user has already voted on this word
      const existingVote = voteHistory[wordId];

      let newAction: "upvote" | "downvote" | "remove" = action;

      // If user clicked the same vote button, remove the vote
      if (existingVote === action) {
        newAction = "remove";
      } else if (existingVote && existingVote !== action) {
        // If user clicked opposite vote, switch the vote
        newAction = action;
      }

      // Send the request to the backend
      const response = await axios.post(`/api/words/${wordId}`, {
        action: newAction,
      });

      if (response.status === 200) {
        // Update vote history in localStorage
        if (newAction === "remove") {
          delete voteHistory[wordId];
        } else {
          voteHistory[wordId] = newAction;
        }
        localStorage.setItem("voteHistory", JSON.stringify(voteHistory));

        // Update the words state with the new data
        setWords((prevWords) =>
          prevWords.map((word) =>
            word._id === wordId ? response.data.word : word
          )
        );
      } else {
        alert("Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => (
          <div key={word._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold">{word.word}</h2>
            <p className="text-gray-700">
              <strong>Definition:</strong> {word.definition}
            </p>
            <p className="text-gray-700">
              <strong>Example:</strong> {word.example}
            </p>
            <p className="text-gray-700">
              <strong>Author:</strong> {word.author}
            </p>
            <p className="text-gray-500">
              <strong>Submitted on:</strong>{" "}
              {new Date(word.createdAt).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handleVote(word._id, "upvote")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Upvote ({word.upvotes})
              </button>
              <button
                onClick={() => handleVote(word._id, "downvote")}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Downvote ({word.downvotes})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordList;
