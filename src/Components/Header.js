import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { onAuthStateChanged } from "firebase/auth";
import UserDrop from "./UserDrop";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import CommunitiesDrop from "./CommunitiesDrop";
import CommunityModal from "./CommunityModal";
import Freddit from "../Assets/freddit.jpeg"
import { Link, useLocation } from "react-router-dom";

const Header = ( { join, setJoin, modalIsTrue, setModalIsTrue, userData, setUserData, communityData, setCommunityData, communityModal, setCommunityModal, setDrop, drop }) => {
    const [ myUser, setMyUser ] = useState([])
    const [ communityDrop, setCommunityDrop ] = useState(false)
    const [ googleUser, setGoogleUser ] = useState(false)
    const [ myData, setMyData ] = useState([])
    const [ homeIsTrue, setHomeIsTrue ] = useState(true)
    const [ communityIsTrue, setCommunityIsTrue ] = useState(false)
    const [ submitIsTrue, setSubmitIsTrue ] = useState(false)
    const user = auth.currentUser;
    const location = useLocation()

    const handleClick = (e) => {
        e.preventDefault()
        if (!user) {
            setModalIsTrue(!modalIsTrue)
            } else {
            setDrop(!drop)
        }
    }

    const handleCommunityClick = (e) => {
        e.preventDefault()
        if (communityDrop) {
            setCommunityDrop(false)
        } else {
            setCommunityDrop(true)
        }
    }

    useEffect(() => {
        setUserData([{karma: 1}])
    }, [setUserData])
 
    useEffect(() => { 
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const getUserInfo = async () => {
                    const docRef = doc(db, "users", user.displayName)
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    setUserData([data])
                    console.log(userData) 
                } 
            getUserInfo()
            } 
    })}, [user]);

    useEffect(() => {
        if (location.pathname.slice(-7) === '/submit') {
            setHomeIsTrue(false)
            setCommunityIsTrue(false)
            setSubmitIsTrue(true)
        } else if (location.pathname.indexOf('/f/') === 0 && location.pathname.slice(-13) !== 'submit/submit') {
            setHomeIsTrue(false)
            setSubmitIsTrue(false)
            setCommunityIsTrue(true)
        } else {
            setCommunityIsTrue(false)
            setSubmitIsTrue(false)
            setHomeIsTrue(true)
        }
    }, [location.pathname])
    
    if (!user) {
        return (
            <div className="header">
                <nav className="nav-bar">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="logo">
                            <img id="freddit-logo" src={Freddit} alt="Green snoo Logo"></img>
                            <div>freddit</div>
                        </div>
                    </Link>
                    <input id="nav-bar-input" type="search" placeholder="Search Freddit"></input>
                    <Modal 
                    modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} googleUser={googleUser} setGoogleUser={setGoogleUser}
                    join={join} setJoin={setJoin}
                    />
                    <div className="header-button">
                        <button className="header-login-button" onClick={handleClick}>Log In</button>
                    </div>
                </nav>
            </div> 
        )
    } 
    else { 
        return ( 
                        <div key={user.displayName}>
                                <nav className="nav-bar">
                                    <div className="nav-login-left">
                                    <Link to="/" style={{ textDecoration: 'none' }}>
                                        <div className="logo">
                                            <img id="freddit-logo" src={Freddit} alt="Green snoo Logo"></img>
                                            <div>freddit</div>
                                        </div>
                                    </Link>
                                        <div className="drop-login">
                                            <div className={communityDrop ? "header-user-profile-login-true" : "header-user-profile-login" } onClick={handleCommunityClick}>
                                                <div className="user-left">
                                                    <div className="user-info-name-login">
                                                        <p className={ homeIsTrue ? "user-left" : "input-empty" }>Home</p>
                                                        <p className={ communityIsTrue ? "user-left" : "input-empty" }>{location.pathname.substring(1)}</p>
                                                        <p className={ submitIsTrue ? "user-left" : "input-empty"}>Create Post</p>
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
                                                        <span>{ userData ? userData[0].karma : 2} karma</span>
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
                                <CommunityModal 
                                communityData={communityData} setCommunityData={setCommunityData} 
                                communityModal={communityModal} userData={userData} setCommunityModal={setCommunityModal} 
                                />
                            </div>
        )
    }
}

export default Header