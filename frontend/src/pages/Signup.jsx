import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchAPI } from '../util';
import Heart from '../static/Heart.png';
import '../styles/styles.css';


function SignupPage() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("USERNAME: ", username);
        console.log("PASSWORD: ", password);

        try {
        const response = await fetchAPI("/api/accounts/create", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Account registration successful");
            setUsername(username);
            navigate("/login", { replace: true });

        } else {
            // "Invalid credentials"
            setError(data.message || "Invalid credentials");
        }
        } catch (err) {
        console.error(err);
        }
    };

    return (
        <>
        <div id="sidebar">
            <h1 id="title"> Allergy Free Around Me </h1>
        </div>
        <div id="login-content">
            <div id="slogan">
            <h2>Wellness starts with awareness.</h2>
            <img src={Heart}></img>
            </div>
            <div id="login-form">
            <form id="login">
                <p>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete='name'
                    required
                />
                </p>
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
                {error && (
                <p className="error">{error}</p>
                )}
                <button type="submit" onClick={(e) => handleSignup(e, username, password)}>Register</button>
            </form>
            <p>Already have an account? 
                <Link to="/login" id="bold-link">
                    Log in!
                </Link>
            </p>
            </div>
        </div>
        </>
    )
}

export default SignupPage;
