"use client";
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios, { AxiosError } from "axios";

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

interface ErrorResponse {
  message: string;
}

const WordList = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [guestId, setGuestId] = useState<string>("");
  const [isVoting, setIsVoting] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Generate or retrieve persistent guest ID
    const generateGuestId = () => {
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 15);
      return `guest_${timestamp}_${random}`;
    };

    const storedGuestId = localStorage.getItem("guestId");
    if (storedGuestId) {
      setGuestId(storedGuestId);
    } else {
      const newGuestId = generateGuestId();
      localStorage.setItem("guestId", newGuestId);
      setGuestId(newGuestId);
    }

    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await axios.get("/api/words");
      setWords(response.data);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const handleVote = async (wordId: string, action: "upvote" | "downvote") => {
    if (!guestId || isVoting[wordId]) return;

    try {
      setIsVoting((prev) => ({ ...prev, [wordId]: true }));

      const response = await axios.post(`/api/words/${wordId}`, {
        action,
        guestId,
      });

      if (response.status === 200) {
        setWords((prevWords) =>
          prevWords.map((word) =>
            word._id === wordId ? response.data.word : word
          )
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to process your vote";
      console.error("Voting error:", error);
      alert(errorMessage);
    } finally {
      setIsVoting((prev) => ({ ...prev, [wordId]: false }));
    }
  };

  const getVoteStatus = (word: Word) => {
    const hasUpvoted = word.upvoterIds?.includes(guestId) || false;
    const hasDownvoted = word.downvoterIds?.includes(guestId) || false;
    return { hasUpvoted, hasDownvoted };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Word List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((word) => {
          const { hasUpvoted, hasDownvoted } = getVoteStatus(word);

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
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => handleVote(word._id, "upvote")}
                  disabled={isVoting[word._id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    hasUpvoted
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 hover:bg-green-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Upvote"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{word.upvotes || 0}</span>
                </button>

                <button
                  onClick={() => handleVote(word._id, "downvote")}
                  disabled={isVoting[word._id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    hasDownvoted
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 hover:bg-red-100"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label="Downvote"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{word.downvotes || 0}</span>
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
