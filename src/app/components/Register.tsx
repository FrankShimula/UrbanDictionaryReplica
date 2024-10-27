"use client";
import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/userregister", {
        username,
        password,
        email,
      });
      console.log(response.data);
      if (response.status === 200) {
        alert("success");
      } else {
        alert("failed");
      }
    } catch (error) {
      console.error("Error occured during registration", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="Username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="Email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="border" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
