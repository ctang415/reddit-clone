import React, { useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from 'firebase/auth';


const Signup = ( { setSignUp, signUp, setLogin} ) => {
    const [ email, setEmail ] = useState(false)
    const [ password, setPassword ] = useState("")
    const auth = getAuth()

    const createUser = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password)
    }


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
                    <button type="submit" onSubmit={() => createUser} className={ email ? "login-button" : "login-button-false"} >Continue</button>
                    <span>Already a fredditor? <span className="modal-links" onClick={displayLogin}>Log In</span></span>
                </form>
            </div>
        )
    }
}

export default Signup