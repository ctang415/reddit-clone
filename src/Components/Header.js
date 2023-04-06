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
import { app } from "../firebase-config";
import Modal from "./Modal";

const Header = () => {
    const auth = getAuth(app);
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    createUserWithEmailAndPassword (auth, email, password)
    .then((userCredential) => {
    // Signed in 
        const user = userCredential.user;
    // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    // ..
    });

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

    onAuthStateChanged(auth, (user) => {
        if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
    });

/*
getAuth()
.createUser({
  email: 'user@example.com',
  emailVerified: false,
  phoneNumber: '+11234567890',
  password: 'secretPassword',
  displayName: 'John Doe',
  photoURL: 'http://www.example.com/12345678/photo.png',
  disabled: false,
})
.then((userRecord) => {
  // See the UserRecord reference doc for the contents of userRecord.
  console.log('Successfully created new user:', userRecord.uid);
})
.catch((error) => {
  console.log('Error creating new user:', error);
});
*/
/*
async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  await signInWithPopup(getAuth(), provider);
}



// Signs-out of Friendly Chat.
function signOutUser() {
// Sign out of Firebase.
signOut(getAuth());
}
/*
// Initialize firebase auth
function initFirebaseAuth() {
// Listen to auth state changes.
onAuthStateChanged(getAuth(), authStateObserver);
}
*/

    const [ modalIsTrue, setModalIsTrue ] = useState(false)
    const handleClick = (e) => {
        setModalIsTrue(true)
    }

    return (
        <nav className="nav-bar">
            <span>freddit</span>
            <input type="search"></input>
            <Modal modalIsTrue={modalIsTrue} createUserWithEmailAndPassword={createUserWithEmailAndPassword} 
            signInWithEmailAndPassword={signInWithEmailAndPassword} />
            <button onClick={handleClick}>Log In</button>
        </nav>
    )
}

export default Header