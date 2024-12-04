"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Word {
  _id: string;
  word: string;
  definition: string;
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Words Starting with "<span>{letter}</span>"
      </h1>
      {words.length === 0 ? (
        <p>No words found.</p>
      ) : (
        <ul>
          {words.map((word) => (
            <li key={word._id}>
              <strong>{word.word}:</strong> {word.definition}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrowseByLetter;
