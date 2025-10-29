import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/styles.css'

function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e, username, password) => {
    // e.preventDefault();
    console.log("USERNAME: ", username);
    console.log("PASSWORD: ", password);
    setError("");
    console.log("Clicked button");
    navigate("/journal", { replace: true });

    // try {
    //   const response = await fetch("http://localhost:5000/api/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ username, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     // "Login successful"

    //     // chatgpt does some token stuff which makes sense but idk the logic behind it 
    //     // so not including but TODO

    //     navigate("/journal", { replace: true });
    //   } else {
    //     // "Invalid credentials"
    //     setError(data.message || "Invalid credentials");
    //   }
    // } catch (error) {
    //   console.error(err);
    //   setError("Network error — try again");
    // }
  };

	return (
		<>
			<div id="sidebar">
				<h1> Allergy Free Around Me </h1>
			</div>
			<div id="login-content">
				<div id="slogan">
					<h2>Find the food that loves you back.</h2>
					<img src="../static/Heart.png"></img>
				</div>
				<div id="login-form">
					<form id="login">
						<p>
							<label htmlFor="username">Username</label>
							<input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete='username'
                required
              />
						</p>
						<p>
							<label htmlFor="password">Password</label>
							<input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='current-password'
                required
              />
						</p>
						<button type="submit" onClick={(e) => handleLogin(e, username, password)}>Login</button>
						{/* <input type="hidden" name="operation" value="login" /> */}
					</form>
					<p>Don't have an account? 
            <Link to="/signup">
              Sign Up!
            </Link>
          </p>
				</div>
			</div>
		</>
	)
}

export default LoginPage;
