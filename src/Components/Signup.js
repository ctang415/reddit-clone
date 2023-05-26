import React, { useEffect, useState } from "react";
import CreateUser from "./CreateUser";
import {
    GoogleAuthProvider,
    signInWithPopup, 
    updateProfile,
    getAdditionalUserInfo,
    reload
  } from 'firebase/auth';
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import Profile from  '../Assets/snoo.png'
import { generateUsername } from 'friendly-username-generator';

const Signup = ( { setSignUp, signUp, setLogin, setModalIsTrue, loggedIn, setLoggedIn } ) => {
    const [ email, setEmail ] = useState("")
    const [ createUser, setCreateUser ] = useState(false)
    const [ generatedUser, setGeneratedUser] = useState('')

    useEffect(() => {
        const options = {
          useHyphen: false,
          useRandomNumber: true
        }
          setGeneratedUser(generateUsername(options) )
  
      }, [])

    const createCollection = async () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today  = new Date();
        await setDoc(doc(db, "users", generatedUser), {
            email: auth.currentUser.email,
            username: generatedUser,
            id: auth.currentUser.uid,
            karma: 1,
            created: today.toLocaleDateString("en-US", options),
            posts: [],
            comments: [],
            joined: [],
            dark: false
        })
    }

    const signInWithGoogle = async () => {
        // Sign in Firebase using popup auth and Google as the identity provider.
        var provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'})
        await signInWithPopup(auth, provider).then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            if (getAdditionalUserInfo(result).isNewUser) {
                createCollection().then(async () => {
                    await updateProfile(user, {
                        displayName: generatedUser, photoURL: Profile
                    }).then ( async () => {
                        await reload(auth.currentUser)
                    }).then ( async () => {
                        setLoggedIn(true) 
                    })
                })
            } else {
                setLoggedIn(true)
        }
        })
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