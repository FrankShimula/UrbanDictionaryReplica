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
      const token = localStorage.getItem("token"); // Get the token from local storage

      // Make sure token exists
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
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        setWord(""); // Clear the input fields
        setDefinition("");
        setExample("");
      } else {
        alert("Failed to add word");
      }
    } catch (error) {
      console.error("Error adding word:", error);
      alert("An error occurred while adding the word.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Submit a Word</h2>
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          required
          className="w-full px-3 py-2 mb-6 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default WordSubmit;
