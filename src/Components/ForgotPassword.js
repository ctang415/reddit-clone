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

    const handleReset = (e) => {
        e.preventDefault()
    }

    if (forgotPassword) {
        return (
            <div className="modal-pop-ups">
                <div className="modal-text-top">
                    <span id="modal-text-header">Reset your password</span>
                    <span id="modal-text-agreement">Tell us the email address associated with your Freddit account, and we'll send you an email with your username.</span>
                </div>
                <form>
                    <input type="text" placeholder="Username" required></input>
                    <input type="email" placeholder="Email" required></input>
                    <div className="modal-links-signup">
                        Forget your <span className="modal-links" onClick={displayForgotUser}>username</span> ?
                    </div>
                    <button type="submit" onSubmit={handleReset} className="login-button">Reset password</button>
                    <div className="modal-links-signup">
                        Don't have an email or need assistance logging in? <span className="modal-links">Get Help</span>
                    </div>
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