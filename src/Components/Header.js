import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { onAuthStateChanged } from "firebase/auth";
import UserDrop from "./UserDrop";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import CommunitiesDrop from "./CommunitiesDrop";
import CommunityModal from "./CommunityModal";
import Freddit from "../Assets/freddit.jpeg"
import Post from "../Assets/plus.png"
import Message from "../Assets/message.png"
import Moderation from "../Assets/moderation.png"
import Notification from "../Assets/notification.png"
import { Link, useLocation, useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";

const Header = ( { join, setJoin, modalIsTrue, setModalIsTrue, userData, setUserData, communityData, setCommunityData, 
    communityModal, setCommunityModal, setDrop, drop, setAllJoinedPosts, setIsEmpty, isEmpty, allJoinedPosts }) => {
    const [ myUser, setMyUser ] = useState([])
    const [ communityDrop, setCommunityDrop ] = useState(false)
    const [ loggedIn, setLoggedIn ] = useState(false)
    const [ homeIsTrue, setHomeIsTrue ] = useState(true)
    const [ communityIsTrue, setCommunityIsTrue ] = useState(false)
    const [ submitIsTrue, setSubmitIsTrue ] = useState(false)
    const [ userIsTrue, setUserIsTrue ] = useState(false)
    const [ loaded, setLoaded ] = useState(false)
    const user = auth.currentUser;
    const location = useLocation()
    const navigate = useNavigate()

    const handleClick = (e) => { 
        e.preventDefault()
        if (!user) {
            setModalIsTrue(!modalIsTrue)
            } else {
            setDrop(!drop)
        }
    }

    const handleCommunityClick = (e) => {
         if (communityDrop) {
            if (e.target.className === "header-user-profile-login" || e.target.className === "header-user-profile-login-true"
            || e.target.className === "header-item" || e.target.className === "user-left" ) {
                setCommunityDrop(false)
            }
        } else {
            setCommunityDrop(true)
        }
    }

    const createNewPost = () => {
        navigate('submit')
    }

    const getUserInfo = async () => {
        const docRef = doc(db, "users", user.displayName)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        setUserData([data]) 
    }

    useEffect(() => {
        getUserInfo()
    }, [setUserData])


    useEffect(() => {
        if (user) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }, [user])
 
    useEffect( () => { 
        if (user) {
            getUserInfo().then( () => {
                setLoaded(true)
                window.scrollTo({ top:0, behavior:'auto'})
            })
        }
    }, [user]); 

    useEffect(() => {
        if (location.pathname.slice(-6) === 'submit' || location.pathname.slice(-13) === '/submit/submit' ) {
            setHomeIsTrue(false)
            setCommunityIsTrue(false)
            setUserIsTrue(false)
            setSubmitIsTrue(true)
        } else if (location.pathname.indexOf('/f/') === 0 ) {
            setHomeIsTrue(false)
            setSubmitIsTrue(false)
            setUserIsTrue(false)
            setCommunityIsTrue(true)
        }  else if (location.pathname.indexOf('/user/' === 0) && location.pathname !== '/') {
            setHomeIsTrue(false)
            setCommunityIsTrue(false)
            setSubmitIsTrue(false)
            setUserIsTrue(true)
        } else {
            setUserIsTrue(false)
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
                    <Searchbar communityData={communityData}/>
                    <Modal 
                    modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                    join={join} setJoin={setJoin}
                    />
                    <div className="header-button">
                        <button className="header-login-button" onClick={handleClick}>Log In</button>
                    </div>
                </nav>
            </div> 
        )
    } else if (user) { 
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
                                                        <p className={ communityIsTrue ? "user-left" : "input-empty" }>
                                                        {location.pathname.split('/comments')[0]}
                                                        </p>
                                                        <p className={ submitIsTrue ? "user-left" : "input-empty"}>Create Post</p>
                                                        <p className={ userIsTrue ? "user-left" : "input-empty" }> u/{location.pathname.split('/user/')[1]}</p>
                                                    </div>
                                                </div>
                                                <div className="user-drop-left">⌄</div> 
                                            </div>
                                            <div className="drop-down-bar-community">
                                                <CommunitiesDrop 
                                                userData={userData} communityDrop={communityDrop} setCommunityDrop={setCommunityDrop} 
                                                handleCommunityClick={handleCommunityClick}
                                                />
                                            </div>
                                        </div>
                                    </div> 
                                    <Searchbar communityData={communityData}/>
                                    <div className="header-user-profile-icons">
                                        <ul>
                                            <li>
                                                <img src={Moderation} alt="Mod icon"/>
                                            </li>
                                            <li>
                                                <img src={Message} alt="Message icon"/>
                                            </li>
                                            <li>
                                                <img src={Notification} alt="Notification icon"/>
                                            </li>
                                            <li onClick={createNewPost}>
                                                <img src={Post} alt="Post icon"/>
                                            </li>
                                        </ul>
                                    </div>
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
                                                        <span> { loaded ? userData[0].karma : 'unknown' } karma </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="user-drop">⌄</div> 
                                        </div>
                                        <div className="drop-down-bar">
                                            <UserDrop userData={userData} setMyUser={setMyUser} drop={drop} setDrop={setDrop} setModalIsTrue={setModalIsTrue}
                                            communityModal={communityModal} setCommunityModal={setCommunityModal} setLoggedIn={setLoggedIn} 
                                            setAllJoinedPosts={setAllJoinedPosts}
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
    } }

export default Header