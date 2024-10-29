"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link href="/">Yeh</Link>
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
                    <Link
                      href={`/browse/${letter}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      {letter}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/submit" className="text-white hover:text-gray-200">
            Submit a Word
          </Link>
          <Link href="/trending" className="text-white hover:text-gray-200">
            Trending
          </Link>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded border-2 border-white focus:outline-none"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
