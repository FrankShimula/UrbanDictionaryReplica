"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
}

interface ErrorResponse {
  message: string;
}

// Separate the search results component
const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [guestId, setGuestId] = useState<string>("");
  const [isVoting, setIsVoting] = useState<{ [key: string]: boolean }>({});

  const fetchSearchResults = useCallback(async () => {
    if (!query) return;

    try {
      const response = await axios.get(`/api/search?query=${query}`);
      setSearchResults(response.data.words);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, [query]);

  useEffect(() => {
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

    fetchSearchResults();
  }, [fetchSearchResults]);

  const handleVote = async (wordId: string, action: "upvote" | "downvote") => {
    if (!guestId || isVoting[wordId]) return;

    try {
      setIsVoting((prev) => ({ ...prev, [wordId]: true }));
      const response = await axios.post(`/api/words/${wordId}`, {
        action,
        guestId,
      });

      if (response.status === 200) {
        setSearchResults((prevResults) =>
          prevResults.map((word) =>
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
    const hasUpvoted = word.upvoterIds.includes(guestId);
    const hasDownvoted = word.downvoterIds.includes(guestId);
    return { hasUpvoted, hasDownvoted };
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for "<span className="text-blue-500">{query}</span>"
      </h1>

      {searchResults.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {searchResults.map((word) => {
            const { hasUpvoted, hasDownvoted } = getVoteStatus(word);

            return (
              <div
                key={word._id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600/50"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 pb-4 border-b border-gray-700/50">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                      {word.word}
                    </h2>
                  </div>
                  <div className="flex-grow space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        Definition
                      </h3>
                      <p className="text-gray-100">{word.definition}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">
                        Example
                      </h3>
                      <p className="text-gray-300 italic">"{word.example}"</p>
                    </div>
                    {word.author && (
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>
                          Added by{" "}
                          <span className="text-gray-300">{word.author}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleVote(word._id, "upvote")}
                        disabled={isVoting[word._id]}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                          hasUpvoted
                            ? "bg-green-600 text-white"
                            : "bg-gray-700/50 hover:bg-green-600/20 text-gray-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label="Upvote"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{word.upvotes || 0}</span>
                      </button>
                      <button
                        onClick={() => handleVote(word._id, "downvote")}
                        disabled={isVoting[word._id]}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                          hasDownvoted
                            ? "bg-red-600 text-white"
                            : "bg-gray-700/50 hover:bg-red-600/20 text-gray-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label="Downvote"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span>{word.downvotes || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

// Loading component remains the same
const SearchLoading = () => (
  <div className="container mx-auto p-4 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
            <div className="h-20 bg-gray-700 rounded mb-4"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main page component
const SearchPage = () => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchResults />
    </Suspense>
  );
};

export default SearchPage;
