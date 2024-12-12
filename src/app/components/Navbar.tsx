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
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => router.push("/")}
              className="text-xl font-bold text-white hover:text-gray-200"
            >
              UrbanDict
            </button>
          </div>

          {/* Middle section: Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Browse Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white hover:text-gray-200 px-3 py-2"
              >
                Browse
              </button>
              {isDropdownOpen && (
                <div className="absolute z-50 mt-2 w-40 bg-white rounded-md shadow-lg py-1">
                  <div className="grid grid-cols-6 gap-1 p-2">
                    {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
                      <button
                        key={letter}
                        onClick={() => handleBrowse(letter)}
                        className="text-gray-700 hover:bg-gray-100 px-2 py-1 rounded text-center"
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push("/wordadd")}
              className="text-white hover:text-gray-200 px-3 py-2"
            >
              Submit a Word
            </button>

            <button
              onClick={() => router.push("/Trending")}
              className="text-white hover:text-gray-200 px-3 py-2"
            >
              Trending
            </button>
          </div>

          {/* Right section: Search and Auth */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>

            <button
              onClick={() => router.push("/Login")}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/Register")}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
