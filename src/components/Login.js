import "../styles/Login.css"

const Login = () => {
    return (
        <div className = "login-card">
            <h2>Login</h2>
            <form className="login-form">
                <input type="text" name="username" placeholder="Username"/>
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Submit</button>
                <p>Don't have an account?</p>
                <span>Signup</span>
            </form>       
        </div>
    )
}

export default Login;