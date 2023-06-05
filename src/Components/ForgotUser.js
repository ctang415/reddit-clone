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

    const handleButton = (e) => {
        e.preventDefault()
    }

    if (forgotUser) {
        return (
            <div className="modal-pop-ups">
                <div className="modal-text-top">
                    <span id="modal-text-header">Recover your username</span>
                    <span id="modal-text-agreement">Tell us the email address associated with your Freddit account, and we'll send you an email with your username.</span>
                </div>
                <form>
                    <input type="email" placeholder="Email" required></input>
                    <button type="submit" onSubmit={handleButton} className="login-button">Email Me</button>
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

export default ForgotUser