import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Word {
  _id: string;
  word: string;
  definition: string;
  example: string;
  author?: string;
  upvotes?: number;
  downvotes?: number;
  upvoterIds?: string[];
  downvoterIds?: string[];
}

interface WordCardProps {
  word: Word;
  handleVote?: (wordId: string, action: "upvote" | "downvote") => void;
  guestId?: string;
  isVoting?: { [key: string]: boolean };
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  handleVote,
  guestId,
  isVoting,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _wordId = word._id;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _action: "upvote" | "downvote" = "upvote";

  const hasUpvoted = word.upvoterIds?.includes(guestId || "") || false;
  const hasDownvoted = word.downvoterIds?.includes(guestId || "") || false;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600/50">
      <div className="flex flex-col h-full">
        <div className="mb-4 pb-4 border-b border-gray-700/50">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            {word.word}
          </h2>
        </div>
        <div className="flex-grow space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Definition
            </h3>
            <p className="text-gray-100">{word.definition}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Example</h3>
            <p className="text-gray-300 italic">"{word.example}"</p>
          </div>
          {word.author && (
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>
                Added by <span className="text-gray-300">{word.author}</span>
              </span>
            </div>
          )}
        </div>
        {handleVote && (
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleVote(word._id, "upvote")}
                disabled={isVoting?.[word._id]}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                  hasUpvoted
                    ? "bg-green-600 text-white"
                    : "bg-gray-700/50 hover:bg-green-600/20 text-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{word.upvotes || 0}</span>
              </button>
              <button
                onClick={() => handleVote(word._id, "downvote")}
                disabled={isVoting?.[word._id]}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all ${
                  hasDownvoted
                    ? "bg-red-600 text-white"
                    : "bg-gray-700/50 hover:bg-red-600/20 text-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{word.downvotes || 0}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCard;
