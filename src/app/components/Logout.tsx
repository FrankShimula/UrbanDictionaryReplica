"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Logout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Optionally, you could also clear cookies if you are using them for authentication
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect the user to the login page
    router.push("/Login");
  };

  useEffect(() => {
    handleLogout();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
