"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Word {
  _id: string;
  word: string;
  definition: string;
  example: string;
  author: string;
  upvotes: number;
  downvotes: number;
  upvoterIds: string[];
  downvoterIds: string[];
  createdAt: string;
}

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isVoting, setIsVoting] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
    }

    const fetchWords = async () => {
      try {
        const response = await axios.get("/api/trending");
        setWords(response.data);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    fetchWords();
  }, []);

  const handleVote = async (wordId: string, action: "upvote" | "downvote") => {
    try {
      if (!userId || isVoting[wordId]) return;

      setIsVoting((prev) => ({ ...prev, [wordId]: true }));

      const word = words.find((w) => w._id === wordId);
      if (!word) return;

      const hasUpvoted = word.upvoterIds.includes(userId);
      const hasDownvoted = word.downvoterIds.includes(userId);

      let newAction: "upvote" | "downvote" | "remove" = action;

      // Logic for handling the vote
      if (action === "upvote") {
        if (hasUpvoted) {
          newAction = "remove"; // Remove upvote
        } else if (hasDownvoted) {
          newAction = "upvote"; // Switch from downvote to upvote
        }
      } else if (action === "downvote") {
        if (hasDownvoted) {
          newAction = "remove"; // Remove downvote
        } else if (hasUpvoted) {
          newAction = "downvote"; // Switch from upvote to downvote
        }
      }

      const response = await axios.post(`/api/words/${wordId}`, {
        action: newAction,
        userId,
      });

      if (response.status === 200) {
        setWords((prevWords) =>
          prevWords.map((word) =>
            word._id === wordId ? response.data.word : word
          )
        );
      }
    } catch (error) {
      console.error("Error voting:", error);
    } finally {
      setIsVoting((prev) => ({ ...prev, [wordId]: false }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => {
          const hasUpvoted = (word.upvoterIds || []).includes(userId);
          const hasDownvoted = (word.downvoterIds || []).includes(userId);

          return (
            <div key={word._id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">{word.word}</h2>
              <p className="text-gray-700 mb-2">
                <strong>Definition:</strong> {word.definition}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Example:</strong> {word.example}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Author:</strong> {word.author}
              </p>
              <p className="text-gray-500 mb-4">
                <strong>Submitted on:</strong>{" "}
                {new Date(word.createdAt).toLocaleDateString()}
              </p>

              <div className="flex items-center justify-between mt-4 gap-4">
                {/* Upvote Button */}
                <button
                  onClick={() => handleVote(word._id, "upvote")}
                  disabled={isVoting[word._id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    hasUpvoted
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 hover:bg-green-100 text-gray-700"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{word.upvotes}</span>
                </button>

                {/* Downvote Button */}
                <button
                  onClick={() => handleVote(word._id, "downvote")}
                  disabled={isVoting[word._id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                    hasDownvoted
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 hover:bg-red-100 text-gray-700"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{word.downvotes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordList;
