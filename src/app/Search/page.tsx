"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import WordCard from "../components/WordCard"; // Import the reusable card component

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Search Results for "<span>{query}</span>"
        </h1>
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : searchResults.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {searchResults.map((word) => (
              <WordCard key={word._id} word={word} />
            ))}
          </div>
        ) : (
          <p className="text-white">No results found.</p>
        )}
      </div>
    </div>
  );
};

const SearchPageWithSuspense = () => {
  return (
    <Suspense fallback={<p>Loading search page...</p>}>
      <SearchPage />
    </Suspense>
  );
};

export default SearchPageWithSuspense;
