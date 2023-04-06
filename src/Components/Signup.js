import React from "react";

const Signup = ( {createUserWithEmailAndPassword, setSignUp, signUp, setLogin} ) => {

    const displayLogin = (e) => {
        setSignUp(false)
        setLogin(true)
    }

    if (signUp) {
        return (
            <div>
                <div className="modal-text-top">
                    <span id="modal-text-header">Sign Up</span>
                    <span>By continuing, you agree are setting up a Freddit account and agree to our User Agreement and Privacy Policy.</span>
                </div>
                <form>
                    <input type="email"></input>
                    <button type="submit" onSubmit={(e) => createUserWithEmailAndPassword} className="login-button">Continue</button>
                    <span>Already a fredditor? <span className="modal-links" onClick={displayLogin}>Log In</span></span>
                </form>
            </div>
        )
    }
}

export default Signup