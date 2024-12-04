"use client";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

const Logout = () => {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Optionally, you could also clear cookies if you are using them for authentication
    // document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect the user to the login page
    router.push("/Login");
  }, [router]); // Include `router` as dependency to ensure the latest version is used

  useEffect(() => {
    handleLogout();
  }, [handleLogout]); // This ensures `handleLogout` will only be called once

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
