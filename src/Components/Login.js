import React, { useEffect, useState } from "react";
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    signInWithEmailAndPassword,
    updateProfile,
    getAdditionalUserInfo,
    reload
  } from 'firebase/auth';
import { auth, db } from "../firebase-config";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import Profile from  '../Assets/snoo.png'

const Login = ( { setSignUp, login, setLogin, setForgotUser, setForgotPassword, setModalIsTrue, googleUser, setGoogleUser } ) => {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ passwordError, setPasswordError ] = useState(false)
    const [ userError, setUserError ] = useState(false)

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

    const createCollection = async () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today  = new Date();
        await setDoc(doc(db, "users", auth.currentUser.email), {
            email: auth.currentUser.email,
            username: auth.currentUser.email,
            id: auth.currentUser.uid,
            karma: 1,
            created: today.toLocaleDateString("en-US", options),
            posts: [],
            comments: [],
            joined: [],
            upvoted: [],
            downvoted: [],
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
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            if (getAdditionalUserInfo(result).isNewUser) {
                setGoogleUser(true)
                createCollection().then( async () => {
                    await updateProfile(user, {
                        displayName: user.email, photoURL: Profile
                    })
                    console.log('update profile')
                }).then( async () => {
                 await reload(auth.currentUser).then(() =>{
                        console.log('profile reloaded')
                    })
            })
            }
        })
      }

      const signInWithRedirect = async () => {
        var provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'})
        await signInWithPopup(auth, provider).then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            setGoogleUser(user.uid)
            if (getAdditionalUserInfo(result).isNewUser) {
                createCollection().then(() => {
                    updateProfile(user, {
                        displayName: user.email, photoURL: Profile
                    })
                }).then(() => {
                reload(auth.currentUser); 
            })
            }
        })
      }
      
      const signIn =  async () => {
            const docRef = doc(db, "users", username)
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            if (data === undefined) {
                setUserError(true)
            } else {
                signInWithEmailAndPassword(auth, data.email, password).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      }).catch((error) => {
        setPasswordError(true)
      })
    }
    }
    
      const handleSubmit = (e) => {
        e.preventDefault()
        signIn()
        if (auth.currentUser) {
            setModalIsTrue(false)
        }
        setUserError(false)
        setPassword(false)
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
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" id="username" placeholder="Username" onInput={(e) => setUsername(e.target.value)} required></input>
                <span htmlFor="username" className={ userError ? "password-error-true" : "password-error-false"}>Username does not exist</span>
                <input type="password" name="password" id="password" placeholder="Password" onInput={(e) => setPassword(e.target.value)} required></input>
                <span htmlFor="password" className={ passwordError ? "password-error-true" : "password-error-false"}>Password is incorrect</span>
                <span className="modal-text-box">
                    Forget your <span className="modal-links" onClick={displayForgotUser}>username</span> or <span className="modal-links" onClick={displayForgotPassword}>password</span> ?
                </span>
                <div className="modal-text-buttons">
                <button type="submit" className="login-button">Log In</button>
                </div>
                <span>New to Freddit? <span className="modal-links" onClick={displaySignUp}>Sign up</span></span>
            </form>
            </div>
        )
    }
}

export default Login