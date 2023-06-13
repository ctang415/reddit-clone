import React, { useState } from "react";
import {
    createUserWithEmailAndPassword,
    reload,
    updateProfile
  } from 'firebase/auth';
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Profile from  '../Assets/snoo.png'
import { useNavigate } from "react-router-dom";

const CreateUser = ( {createUser, setSignUp, setCreateUser, email, setLogin, setModalIsTrue, click, setClick, isMobile }) => {
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ alreadyExists, setAlreadyExists ] = useState(false)
    const navigate = useNavigate()
    
    const createCollection = async () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today  = new Date();
        await setDoc(doc(db, "users", username), {
            email: email,
            username: username,
            id: auth.currentUser.uid,
            avatar: Profile,
            karma: 1,
            created: today.toLocaleDateString("en-US", options),
            posts: [],
            comments: [],
            joined: [],
            dark: false
        })
    }

    const createAccount = async (e) => {
        if (isMobile) {
            e.preventDefault()
            const docRef = doc(db, "users", username)
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            if (data === undefined) {
            createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {       
                const user = userCredential.user;     
                await updateProfile(user, {
                displayName: username, photoURL: Profile
            }).then( async () => {
                 await reload(auth.currentUser)
        })
                setCreateUser(false)
                setModalIsTrue(false)
                setLogin(true)
                createCollection()
                navigate('/')
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
              })
            }
            else {
                setAlreadyExists(true)
            }
        } else {
        e.preventDefault()
        const docRef = doc(db, "users", username)
        const docSnap = await getDoc(docRef);
        const data = docSnap.data()
        if (data === undefined) {
        createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {       
            const user = userCredential.user;     
            await updateProfile(user, {
            displayName: username, photoURL: Profile
        }).then( async () => {
             await reload(auth.currentUser)
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
        else {
            setAlreadyExists(true)
        }
    }
    }

    const returnToPage = (e) => {
        setAlreadyExists(false)
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
                    <span className={alreadyExists ? "password-error-true" : "password-error-false"}>Username already exists</span>
                    <input type="password" placeholder="Password" minLength="8" maxLength="16" onInput={(e)=> setPassword(e.target.value) } required></input>
                    <button type="submit" className={ email ? "login-button" : "login-button-false"} >Continue</button>
                    <span id="text-warning">*Please do not put your real information!*</span>
                </form>
            </div>
        )
    }

  }

  export default CreateUser