import './App.css'

function App() {

	return (
		<>
			<div id="sidebar">
				<h1> Allergy Free Around Me </h1>
			</div>
			<div id="login-content">
				<div id="slogan">
					<h2>Find the food that loves you back.</h2>
					<img src="/Heart.png"></img>
				</div>
				<div id="login-form">
					<form id="login">
						<p>
							<label for="username">Username</label>
							<input id="username" type="text" name="username" required />
						</p>
						<p>
							<label for="password">Password</label>
							<input id="password" type="text" name="password" required />
						</p>
						<input type="submit" value="login" />
						<input type="hidden" name="operation" value="login" />
					</form>
					<p>Don't have an account? <a href="">Sign up</a></p>
				</div>
			</div>
		</>
	)
}

export default App
