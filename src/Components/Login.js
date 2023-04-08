import React, { useState } from "react";
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

const Login = ( {signInWithEmailAndPassword, setSignUp, login, setLogin, setForgotUser, setForgotPassword, setModalIsTrue} ) => {
    const auth = getAuth();
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

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
      
      const signInWithEmail = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
      });
    }

      const handleSubmit = (e) => {
        e.preventDefault()
        signInWithEmail()
        setModalIsTrue(false)
      }

    if (login) {
        return (
            <div className="modal-pop-ups">
                <div className="modal-text-top">
                <span id="modal-text-header">Log In</span>
                <span id="modal-text-agreement">By continuing, you agree are setting up a Freddit account and agree to our User Agreement and Privacy Policy.</span>
                <button className="modal-sign-in" onClick={signInWithGoogle}>Continue with Google</button>
            </div>
            <div className="modal-divider">
            <span className="modal-divider-text">OR</span>
            </div>
            <form>
                <input type="text" placeholder="Username" onInput={(e) => setUsername(e.target.value)} required></input>
                <input type="password" placeholder="Password" onInput={(e) => setPassword(e.target.value)} required></input>
                <span className="modal-text-box">
                    Forget your <span className="modal-links" onClick={displayForgotUser}>username</span> or <span className="modal-links" onClick={displayForgotPassword}>password</span> ?
                </span>
                <div className="modal-text-buttons">
                <button type="submit" onSubmit={handleSubmit} className="login-button">Log In</button>
                </div>
                <span>New to Freddit? <span className="modal-links" onClick={displaySignUp}>Sign up</span></span>
            </form>
            </div>
        )
    }
}

export default Login