import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserDrop from "./UserDrop";

const Header = () => {
    const [ modalIsTrue, setModalIsTrue ] = useState(false)
    const [ drop, setDrop ] = useState(false)
    const auth = getAuth();
    const user = auth.currentUser;
    const [ myUser, setMyUser ] = useState([])
    
    useEffect(() => {
        if (user !== null) {
            setMyUser([user])
        }
    }, [user]);

/*
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

    const handleClick = (e) => {
        e.preventDefault()
        if (!user) {
            setModalIsTrue(true)
            }
        else {
            setDrop(!drop)
            console.log(user)
        }
    }


    if (!user) {
        return (
            <div>
                <nav className="nav-bar">
                    <span>freddit</span>
                    <input id="nav-bar-input" type="search" placeholder="Search Freddit"></input>
                    <Modal modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} 
                    />
                    <button className="header-login-button" onClick={handleClick}>Log In</button>
                </nav>
            </div>
        )
    } else {
        return (
        <div>
        {myUser.map(user => {
        return (
            <nav key={user.displayName} className="nav-bar">
                <span>freddit</span>
                <input id="nav-bar-input" type="search" placeholder="Search Freddit"></input>
            <div className="drop">
                <div className="header-user-profile" onClick={handleClick}>
                    <div className="user-right">
                        <div className="user-avatar">
                            <img id="nav-bar-image" src={user.photoURL}></img>
                        </div> 
                        <div className="user-info">
                            <div className="user-info-name">{user.displayName}</div>
                            <div id="karma">karma</div>
                        </div>
                    </div>
                    <div className="user-drop">⌄</div> 
                </div>
                         <div>
                <UserDrop drop={drop}/>
                </div>
                </div>
            </nav>
        )
            })}
            </div>
        )
    }
}

export default Header