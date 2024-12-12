"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";

const WordSubmit = () => {
  const [word, setWord] = useState<string>("");
  const [definition, setDefinition] = useState<string>("");
  const [example, setExample] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to submit a word.");
        return;
      }

      const response = await axios.post(
        "/api/wordregister",
        {
          word,
          definition,
          example,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setWord("");
        setDefinition("");
        setExample("");
        alert("Word successfully added!");
      } else {
        alert("Failed to add word");
      }
    } catch (error) {
      console.error("Error adding word:", error);
      alert("An error occurred while adding the word.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Submit a Word
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="word" className="block text-gray-300 mb-2">
              Word
            </label>
            <input
              id="word"
              type="text"
              placeholder="Enter the word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
          </div>
          <div>
            <label htmlFor="definition" className="block text-gray-300 mb-2">
              Definition
            </label>
            <textarea
              id="definition"
              placeholder="Provide a clear definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 resize-none"
            />
          </div>
          <div>
            <label htmlFor="example" className="block text-gray-300 mb-2">
              Example
            </label>
            <textarea
              id="example"
              placeholder="Provide an example of the word's usage"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit Word
          </button>
        </form>
      </div>
    </div>
  );
};

export default WordSubmit;
