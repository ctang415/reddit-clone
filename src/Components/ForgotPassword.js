import React from "react";

const ForgotPassword = ( {forgotPassword, setForgotPassword, setLogin, setSignUp, setForgotUser} ) => {

    const displaySignUp = (e) => {
        setForgotPassword(false)
        setSignUp(true)
    }

    const displayLogin = (e) => {
        setForgotPassword(false)
        setLogin(true)
    }

    const displayForgotUser = (e) => {
        setForgotPassword(false)
        setForgotUser(true)
    }

    if (forgotPassword) {
        return (
            <div>
                <div className="modal-text-top">
                    <span id="modal-text-header">Reset your password</span>
                    <span>Tell us the email address associated with your Freddit account, and we'll send you an email with your username.</span>
                </div>
                <form>
                    <input type="text"></input>
                    <input type="email"></input>
                    <span>
                        Forget your <span className="modal-links" onClick={displayForgotUser}>username</span> ?
                    </span>
                    <button type="submit" className="login-button">Reset password</button>
                    <span>
                        Don't have an email or need assistance logging in? <span className="modal-links">Get Help</span>
                    </span>
                    <div className="forgot-user-links">
                        <span className="modal-links" onClick={displaySignUp}>Sign up</span>
                        <span id="modal-links-dot">•</span>
                        <span className="modal-links" onClick={displayLogin}>Log In</span>
                    </div>
                </form>
            </div>
        )
    }
}

export default ForgotPassword