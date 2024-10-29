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

  const handleUpvote = async (wordId: string) => {
    try {
      await axios.post(`/api/words/${wordId}/upvote`);
      // Update the UI after upvoting
      setWords((prevWords) =>
        prevWords.map((word) =>
          word._id === wordId ? { ...word, upvotes: word.upvotes + 1 } : word
        )
      );
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleDownvote = async (wordId: string) => {
    try {
      await axios.post(`/api/words/${wordId}/downvote`);
      // Update the UI after downvoting
      setWords((prevWords) =>
        prevWords.map((word) =>
          word._id === wordId
            ? { ...word, downvotes: word.downvotes + 1 }
            : word
        )
      );
    } catch (error) {
      console.error("Error downvoting:", error);
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
                onClick={() => handleUpvote(word._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Upvote ({word.upvotes})
              </button>
              <button
                onClick={() => handleDownvote(word._id)}
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
