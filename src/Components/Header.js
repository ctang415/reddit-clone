import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { onAuthStateChanged } from "firebase/auth";
import UserDrop from "./UserDrop";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import CommunitiesDrop from "./CommunitiesDrop";
import CommunityModal from "./CommunityModal";

const Header = ( { userData, setUserData }) => {
    const [ modalIsTrue, setModalIsTrue ] = useState(false)
    const [ drop, setDrop ] = useState(false)
    const [ myUser, setMyUser ] = useState([])
    const [ communityDrop, setCommunityDrop ] = useState(false)
    const [ communityModal, setCommunityModal ] = useState(false)

    const user = auth.currentUser;

    const handleClick = (e) => {
        e.preventDefault()
        if (!user) {
            setModalIsTrue(!modalIsTrue)
            } else {
            setDrop(!drop)
            console.log(user)
        }
    }

    const handleCommunityClick = (e) => {
        e.preventDefault()
            setCommunityDrop(!communityDrop)
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setMyUser([user])
                const getUserInfo =  async () => {
                    const docRef = doc(db, "users", user.displayName)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    setUserData([data])
                    console.log(userData)
                }
                getUserInfo()
            }
        })
    }, [setMyUser]); 


 
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
                    userData.map(data => { 
                        return (
                            <div key={data.displayName}>
                                <nav key={user.displayName} className="nav-bar">
                                    <div className="nav-login-left">
                                        <span>freddit</span>
                                        <div className="drop-login">
                                            <div className={communityDrop ? "header-user-profile-login-true" : "header-user-profile-login" } onClick={handleCommunityClick}>
                                                <div className="user-left">
                                                    <div className="user-info-name-login">
                                                        <span>Home</span>
                                                    </div>
                                                </div>
                                                <div className="user-drop-left">⌄</div> 
                                            </div>
                                            <div className="drop-down-bar-community">
                                                <CommunitiesDrop userData={userData} communityDrop={communityDrop} setCommunityDrop={setCommunityDrop} />
                                            </div>
                                        </div>
                                    </div>
                                    <input id="nav-bar-input-login" type="search" placeholder="Search Freddit"></input>
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
                                                        <span>{data.karma} karma</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="user-drop">⌄</div> 
                                        </div>
                                        <div className="drop-down-bar">
                                            <UserDrop userData={userData} setMyUser={setMyUser} drop={drop} setDrop={setDrop} setModalIsTrue={setModalIsTrue}
                                            communityModal={communityModal} setCommunityModal={setCommunityModal} 
                                            />
                                        </div>
                                    </div>
                                </nav>
                                <CommunityModal communityModal={communityModal} userData={userData} setCommunityModal={setCommunityModal} />
                            </div>
                        )
                    })
                )
            })
        )
    }
}

export default Header