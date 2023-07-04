import "../styles/SignUp.css";



const SignUp = () => {
    return (
        <div className = "signup-card">
            <h2>Sign Up</h2>
            <form className="signup-form">
                <input type="text" name="firstname" placeholder="Firstname" />
                <input type="text" name="lastname" placeholder="Lastname" />
                <input type="email" name="email" placeholder="Email"/>
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Submit</button>
                <p>Already have an account?</p>
                <span>Login</span>
            </form>       
        </div>
    )
}

export default SignUp;