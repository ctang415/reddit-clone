import React from "react";

const Login = ( {signInWithEmailAndPassword, setSignUp, login, setLogin, setForgotUser, setForgotPassword} ) => {
    
    const displaySignUp = (e) => {
        setSignUp(true)
        setLogin(false)
    }

    const displayForgotUser = (e) => {
        setLogin(false)
        setForgotUser(true)
    }

    const displayForgotPassword = (e) => {
        setLogin(false)
        setForgotPassword(true)
    }

    if (login) {
        return (
            <div>
                <div className="modal-text-top">
                <span id="modal-text-header">Log In</span>
                <span>By continuing, you agree are setting up a Freddit account and agree to our User Agreement and Privacy Policy.</span>
            </div>
            <form>
                <input type="text"></input>
                <input type="password"></input>
                <span>
                    Forget your <span className="modal-links" onClick={displayForgotUser}>username</span> or <span className="modal-links" onClick={displayForgotPassword}>password</span> ?
                </span>
                <button type="submit" onSubmit={(e) => signInWithEmailAndPassword} className="login-button">Log In</button>
                <span>New to Freddit? <span className="modal-links" onClick={displaySignUp}>Sign up</span></span>
            </form>
            </div>
        )
    }
}

export default Login