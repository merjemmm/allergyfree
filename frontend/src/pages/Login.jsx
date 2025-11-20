import { useNavigate, Link } from 'react-router';
import User from '../UserContext';
import { UserContext } from '../UserContext';
import { useContext, useState } from 'react';
import { fetchAPI } from '../util';
import Heart from '../static/Heart.png';
import '../styles/styles.css'


function LoginPage() {

  // right now we just validate username; 
  // should do password as well, but this will be enough for now
  const {setUsername} = useContext(UserContext);
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    console.log("Clicked login");
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
          let response = await fetchAPI("/api/accounts/login", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password}),
          });
          
          if (response.ok) {
            setUsername(username);
            navigate("/profile", { replace: true });
          }
          else {
            // set username to null on invalid attempts
            setUsername(null);
            setError("Incorrect login. Try again!")
          }
          // await response.json()
          //   .then(d => setError(d.error));
            
          
      } catch (e) {
        console.error(e);
        setError(e.message);
    }
  };

	return (
		<>
			<div id="sidebar">
				<h1> Allergy Free Around Me </h1>
			</div>
			<div id="login-content">
				<div id="slogan">
					<h2>Find the food that loves you back.</h2>
					<img src={Heart}></img>
				</div>
				<div id="login-form">
					<form id="login" method="post" onSubmit={handleLogin}>
						<p>
							<label htmlFor="username">Username</label>
							<input
                type="text"
                id="username"
                autoComplete='username'
                required
              />
						</p>
						<p>
							<label htmlFor="password">Password</label>
							<input
                type="password"
                id="password"
                autoComplete='current-password'
                required
              />
						</p>
            {error && (
            <p className="error">{error}</p>
            )}
            <button type="submit">Log In</button>
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