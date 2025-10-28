import React, { useState } from "react";
import "../styles/styles.css";

function AuthPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Login response:", data);
      // TODO: handle login success (store token, redirect, etc.)
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/accounts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("Signup response:", data);
      // TODO: handle signup success (show message, auto-login, etc.)
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="container">
      <div className="left">
        <h1>
          Allergy Free
          <br />
          Around Me
        </h1>
      </div>

      <div className="right">
        <h2>
          Find the food that
          <br />
          loves you back.
        </h2>
        <div className="heart"></div>
        <form>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className="buttons">
            <button className="signup-btn" onClick={handleSignup}>
              Sign Up
            </button>
            <button className="login-btn" onClick={handleLogin}>
              Log In --&gt;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
