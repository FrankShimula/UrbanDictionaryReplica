// app/wordadd/page.tsx
"use client";
import WordSubmit from "../components/WordSubmit";
import { useRouter } from "next/navigation";

const WordAddPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    router.push("/Login"); // Redirect to login page
  };

  return (
    <div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <WordSubmit />
    </div>
  );
};

export default WordAddPage;
