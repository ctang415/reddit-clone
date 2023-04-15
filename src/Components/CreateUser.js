import React, { useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    updateProfile
  } from 'firebase/auth';
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Profile from  '../Assets/snoo.png'

const CreateUser = ( {createUser, setSignUp, setCreateUser, email, setLogin, setModalIsTrue }) => {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    
    const createCollection = async () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today  = new Date();
        await setDoc(doc(db, "users", username), {
            email: email,
            username: username,
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

    const createAccount = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {       
            const user = userCredential.user;     
            updateProfile(user, {
            displayName: username, photoURL: Profile
        }).then(() => {
            user.reload()
            })
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
                    <input type="text" placeholder="Username" minLength="3" maxLength="20" onInput={(e) => setUsername(e.target.value) } pattern={'^[a-zA-Z0-9](?!.*--)[a-zA-Z0-9-_]*[a-zA-Z0-9]$'} required></input>
                    <input type="password" placeholder="Password" minLength="8" maxLength="16" onInput={(e)=> setPassword(e.target.value) } required></input>
                    <button type="submit" className={ email ? "login-button" : "login-button-false"} >Continue</button>
                    <span id="text-warning">*Please do not put your real information!*</span>
                </form>
            </div>
        )
    }

  }

  export default CreateUser