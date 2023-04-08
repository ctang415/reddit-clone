import React, { useState } from "react";
import CreateUser from "./CreateUser";
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithRedirect
  } from 'firebase/auth';

const Signup = ( { setSignUp, signUp, setLogin, setModalIsTrue} ) => {
    const [ email, setEmail ] = useState("")
    const [ createUser, setCreateUser ] = useState(false)

    const auth = getAuth();

    const signInWithGoogle = async () => {
        // Sign in Firebase using popup auth and Google as the identity provider.
        var provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'})
        await signInWithPopup(auth, provider);
      }

    const displayLogin = (e) => {
        setSignUp(false)
        setLogin(true)
    }

    const handleEmail = (e) => {
        e.preventDefault()
        console.log(email)
        setSignUp(false)
        setCreateUser(true)
    }

    if (signUp) {
        return (
            <div className="modal-pop-ups">
                <div className="modal-text-top">
                    <span id="modal-text-header">Sign Up</span>
                    <span id="modal-text-agreement">By continuing, you agree are setting up a Freddit account and agree to our User Agreement and Privacy Policy.</span>
                    <button className="modal-sign-in" onClick={signInWithGoogle}>Continue with Google</button>
                </div>
                <div className="modal-divider">
                    <span className="modal-divider-text">OR</span>
                </div>
                <form onSubmit={handleEmail}>
                    <input type="email" placeholder="Email" onInput={(e) => setEmail(e.target.value)} required></input>
                    <button type="submit" className={ email ? "login-button" : "login-button-false"}>Continue</button>
                    <span>Already a fredditor? <span className="modal-links" onClick={displayLogin}>Log In</span></span>
                </form>
            </div>
        )
    }
    else {
        return (
            <CreateUser email={email} createUser={createUser} setCreateUser={setCreateUser}
            setModalIsTrue={setModalIsTrue} setSignUp={setSignUp} setLogin={setLogin}
            />
        )
    }
}

export default Signup