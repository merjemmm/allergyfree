import '../styles/styles.css'

function Signup() {
    return (
        <>
        <div id="sidebar">
            <h1> Allergy Free Around Me </h1>
        </div>
        <div id="login-content">
            <div id="slogan">
            <h2>Wellness starts with awareness.</h2>
            <img src="/Heart.png"></img>
            </div>
            <div id="login-form">
            <form id="login">
                <p>
                <label for="name">Name</label>
                <input id="name" type="text" name="name" required />
                </p>
                <p>
                <label for="username">Username</label>
                <input id="username" type="text" name="username" required />
                </p>
                <p>
                <label for="password">Password</label>
                <input id="password" type="text" name="password" required />
                </p>
                <input type="submit" value="Register"/>
                <input type="hidden" name="operation" value="register"/>
            </form>
            <p>Already have an account? <a href="">Log in</a></p>
            </div>
        </div>
        </>
    )
}

export default Signup
