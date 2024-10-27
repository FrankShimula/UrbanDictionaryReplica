import React from "react";

interface CardProps {
  word: string;
  definition: string;
  example?: string;
  votes: number;
  onUpvote: () => void;
  onDownvote: () => void;
}

const Card = ({
  word,
  definition,
  example,
  votes,
  onUpvote,
  onDownvote,
}: CardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-2xl font-bold text-blue-600">{word}</h2>

      <p className="mt-2 text-gray-700">{definition}</p>

      {example && (
        <blockquote className="mt-2 text-gray-500 italic border-l-4 border-blue-500 pl-4">
          "{example}"
        </blockquote>
      )}

      {/* Votes */}
      <div className="mt-4 flex items-center">
        <button
          onClick={onUpvote}
          className="mr-2 px-4 py-1 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Upvote
        </button>
        <span className="text-gray-800">{votes}</span>
        <button
          onClick={onDownvote}
          className="ml-2 px-4 py-1 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Downvote
        </button>
      </div>
    </div>
  );
};

export default Card;
