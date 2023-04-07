import React from "react";
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

const Anonymous = () => {
    
    const auth = getAuth()

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

    return (
        <div>
        <div className="modal-text-top">
        <span id="modal-text-header">You can comment on any post with a Freddit account</span>
        <span id="modal-text-agreement">By continuing, you agree are setting up a Freddit account and agree to our User Agreement and Privacy Policy.</span>
        <button className="modal-sign-in" onClick={signInWithGoogle}>Continue with Google</button>
    </div>
    <div className="modal-divider">
    <span className="modal-divider-text">OR</span>
    </div>
    <form>
        <input type="email" placeholder="Email"></input>
        <div className="modal-text-buttons">
        <button type="submit" className="login-button">Continue</button>
        </div>
        <span>Already a fredditor? <span className="modal-links" onClick={displayLogin}>Log In</span></span>
    </form>
    </div>
    )

}

export default Anonymous