import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import UserDrop from "./UserDrop";
import { auth } from "../firebase-config";

const Header = () => {
    const [ modalIsTrue, setModalIsTrue ] = useState(false)
    const [ drop, setDrop ] = useState(false)
    const user = auth.currentUser;
    const [ myUser, setMyUser ] = useState([])
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setMyUser([user])
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              // ...
            }
        })
    }, [myUser]); 

    const handleClick = (e) => {
        e.preventDefault()
        if (!user) {
            setModalIsTrue(!modalIsTrue)
            } else {
            setDrop(!drop)
            console.log(user)

        }
    }
 
    if (!user) {
        return (
            <div className="header">
                <nav className="nav-bar">
                    <span>freddit</span>
                    <input id="nav-bar-input" type="search" placeholder="Search Freddit"></input>
                    <Modal modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} 
                    />
                    <div className="header-button">
                        <button className="header-login-button" onClick={handleClick}>Log In</button>
                    </div>
                </nav>
            </div>
        )
    } else {
        return ( 
            myUser.map(user => {
                return (
                    <nav key={user.displayName} className="nav-bar">
                        <span>freddit</span>
                        <input id="nav-bar-input" type="search" placeholder="Search Freddit"></input>
                        <div className="drop">
                            <div className="header-user-profile" onClick={handleClick}>
                                <div className="user-right">
                                    <div className="user-avatar">
                                        <img id="nav-bar-image" src={user.photoURL} alt="Snoo character"></img>
                                    </div> 
                                    <div className="user-info">
                                        <div className="user-info-name">
                                            <span>{user.displayName}</span>
                                        </div>
                                        <div id="karma">
                                            <span>karma</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="user-drop">⌄</div> 
                            </div>
                            <div className="drop-down-bar">
                                <UserDrop setMyUser={setMyUser} drop={drop} setDrop={setDrop} setModalIsTrue={setModalIsTrue}/>
                            </div>
                        </div>
                    </nav>
                )
            })

        )
    }
}

export default Header