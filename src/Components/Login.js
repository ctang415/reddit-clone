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
import { app } from "../firebase-config";

const Login = ( {signInWithEmailAndPassword, setSignUp, login, setLogin, setForgotUser, setForgotPassword} ) => {
    const auth = getAuth();

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
    
    const signInWithGoogle = async () => {
        // Sign in Firebase using popup auth and Google as the identity provider.
        var provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'})
        await signInWithPopup(auth, provider);
      }

      const signInWithRedirect = async () => {
        var provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'})
        await signInWithPopup(auth, provider);
      }

    if (login) {
        return (
            <div>
                <div className="modal-text-top">
                <span id="modal-text-header">Log In</span>
                <span id="modal-text-agreement">By continuing, you agree are setting up a Freddit account and agree to our User Agreement and Privacy Policy.</span>
                <button className="modal-sign-in" onClick={signInWithGoogle}>Continue with Google</button>
            </div>
            <div className="modal-divider">
            <span className="modal-divider-text">OR</span>
            </div>
            <form>
                <input type="text"></input>
                <input type="password"></input>
                <span className="modal-text-box">
                    Forget your <span className="modal-links" onClick={displayForgotUser}>username</span> or <span className="modal-links" onClick={displayForgotPassword}>password</span> ?
                </span>
                <div className="modal-text-buttons">
                <button type="submit" onSubmit={(e) => signInWithEmailAndPassword} className="login-button">Log In</button>
                </div>
                <span>New to Freddit? <span className="modal-links" onClick={displaySignUp}>Sign up</span></span>
            </form>
            </div>
        )
    }
}

export default Login