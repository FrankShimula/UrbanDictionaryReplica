"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

interface Word {
  _id: string;
  word: string;
  definition: string;
  example: string;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/search?query=${query}`);
        setSearchResults(response.data.words);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : searchResults.length > 0 ? (
        <ul>
          {searchResults.map((word) => (
            <li key={word._id}>
              <strong>{word.word}</strong>: {word.definition}
              <p>{word.example}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;
