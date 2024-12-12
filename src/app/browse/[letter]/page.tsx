"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import WordCard from "../../components/WordCard"; // Import the WordCard component

interface Word {
  _id: string;
  word: string;
  definition: string;
  example: string;
}

const BrowseByLetter = () => {
  const pathname = usePathname(); // e.g., "/browse/A"
  const letter = pathname.split("/").pop()?.toUpperCase(); // Extracts the letter
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!letter) return;

    const fetchWords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/browse/${letter}`);
        setWords(response.data);
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [letter]);

  if (!letter) return <p>Invalid letter.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {words.length === 0 ? (
          <p className="text-white">No words found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {words.map((word) => (
              <WordCard key={word._id} word={word} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseByLetter;
