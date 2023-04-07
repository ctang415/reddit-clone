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

  const CreateUser = ( {createUser, setSignUp, setCreateUser, email, setModalIsTrue }) => {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const auth = getAuth()

    const createAccount = (e) => {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
          });
          setCreateUser(false)
          setModalIsTrue(false)
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
                    <input type="text" placeholder="Username" onInput={(e) => setUsername(e.target.value) } required></input>
                    <input type="password" placeholder="Password" onInput={ (e)=> setPassword(e.target.value) } required></input>
                    <button type="submit" className={ email ? "login-button" : "login-button-false"} >Continue</button>
                </form>
            </div>
        )
    }

  }

  export default CreateUser