import React, { useState } from "react";
import Modal from "./Modal";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Header = () => {
    const auth = getAuth();
/*
    // Initialize firebase auth
const initFirebaseAuth = () => {
    onAuthStateChanged(getAuth(), authStateObserver);
    };


const authStateObserver = (user) => {
    if (user) { // User is signed in!
      // Get the signed-in user's profile pic and name.
      var profilePicUrl = getProfilePicUrl();
      var userName = getUserName();
  
      // Set the user's profile pic and name.
      userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
      userNameElement.textContent = userName;
  
      // Show user's profile and sign-out button.
      userNameElement.removeAttribute('hidden');
      userPicElement.removeAttribute('hidden');
      signOutButtonElement.removeAttribute('hidden');
  
      // Hide sign-in button.
      signInButtonElement.setAttribute('hidden', 'true');
  
      // We save the Firebase Messaging Device token and enable notifications.
      saveMessagingDeviceToken();
    } else { // User is signed out!
      // Hide user's profile and sign-out button.
      userNameElement.setAttribute('hidden', 'true');
      userPicElement.setAttribute('hidden', 'true');
      signOutButtonElement.setAttribute('hidden', 'true');
  
      // Show sign-in button.
      signInButtonElement.removeAttribute('hidden');
    }
  }

  function getProfilePicUrl() {
    return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
  }

  function getUserName() {
    return getAuth().currentUser.displayName;
  }
*/
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

    const [ modalIsTrue, setModalIsTrue ] = useState(false)
    const handleClick = (e) => {
        e.preventDefault()
        setModalIsTrue(true)
    }

    return (
        <nav className="nav-bar">
            <span>freddit</span>
            <input id="nav-bar-input" type="search" placeholder="Search Freddit"></input>
            <Modal modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} 
            />
            <button className="header-login-button" onClick={handleClick}>Log In</button>
        </nav>
    )
}

export default Header