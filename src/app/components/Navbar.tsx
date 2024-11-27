"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/Search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBrowse = (letter: string) => {
    router.push(`/browse/${letter}`);
    setIsDropdownOpen(false); // Close the dropdown after navigation
  };

  return (
    <nav className="bg-blue-600 p-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-white text-2xl font-bold">
            <button onClick={() => router.push("/")} className="text-white">
              Yeh
            </button>
          </div>

          <div className="relative space-x-4">
            <button
              onClick={toggleDropdown}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              Browse
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 bg-white shadow-md rounded-lg w-40">
                <ul className="flex flex-wrap">
                  {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                    <li key={letter} className="w-1/4">
                      <button
                        onClick={() => handleBrowse(letter)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-200 text-left w-full"
                      >
                        {letter}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => router.push("/wordadd")}
              className="text-white hover:text-gray-200"
            >
              Submit a Word
            </button>
            <button
              onClick={() => router.push("/trending")}
              className="text-white hover:text-gray-200"
            >
              Trending
            </button>
          </div>

          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-4 py-2 rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </nav>
  );
};

export default Navbar;
