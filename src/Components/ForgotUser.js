import React from "react";

const ForgotUser = ( { setSignUp, setLogin, forgotUser, setForgotUser } ) => {

    const displayLogin = (e) => {
        setForgotUser(false)
        setLogin(true)
    }

    const displaySignUp = (e) => {
        setForgotUser(false)
        setSignUp(true)
    }

    if (forgotUser) {
        return (
            <div>
                <div className="modal-text-top">
                    <span id="modal-text-header">Recover your username</span>
                    <span>Tell us the email address associated with your Freddit account, and we'll send you an email with your username.</span>
                </div>
                <form>
                    <input type="email"></input>
                    <button type="submit" className="login-button">Email Me</button>
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

export default ForgotUser