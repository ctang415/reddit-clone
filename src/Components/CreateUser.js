import React, { useState } from "react";
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
  } from 'firebase/auth';
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

  const CreateUser = ( {createUser, setSignUp, setCreateUser, email, setLogin, setModalIsTrue }) => {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const auth = getAuth()

    const createCollection = async () => {
        await setDoc(doc(db, "users", username), {
            email: email,
            username: username,
            id: auth.currentUser,
            avatar: "",
            karma: "",
            created: "",
            posts: [],
            comments: [],
            joined: [],
            upvoted: [],
            downvoted: [],
            dark: false
        })
    }

    const createAccount = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            setCreateUser(false)
            setModalIsTrue(false)
            setLogin(true)
            createCollection()
            
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
          }).then(() => {
            updateProfile(auth.currentUser, {
                displayName: username, photoURL: "https://i.redd.it/jxhx462xs9r71.png"
            })
          })
    }



    const returnToPage = (e) => {
        setCreateUser(false)
        setSignUp(true)
    }

    if (createUser) {
        return (
            <div>
                <div className="modal-text-top">
                    <div className="modal-arrow-div">
                        <div onClick={returnToPage} id="modal-arrow-button">
                            ←
                        </div>
                    </div> 
                    <span id="modal-text-header">Create your username and password</span>
                    <span id="modal-text-agreement">
                        Reddit is anonymous, so your username is what you'll go by here. 
                        Choose wisely—because once you get a name, you can't change it.
                    </span>
                </div>
                <form onSubmit={createAccount}>
                    <input type="text" placeholder="Username" minLength="3" maxLength="20" onInput={(e) => setUsername(e.target.value) } required></input>
                    <input type="password" placeholder="Password" minLength="8" onInput={(e)=> setPassword(e.target.value) } required></input>
                    <button type="submit" className={ email ? "login-button" : "login-button-false"} >Continue</button>
                    <span id="text-warning">*Please do not put your real information!*</span>
                </form>
            </div>
        )
    }

  }

  export default CreateUser