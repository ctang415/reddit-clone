import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { signInAnonymously, signOut } from "firebase/auth";
import UserDrop from "./UserDrop";
import { auth, db } from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import CommunitiesDrop from "./CommunitiesDrop";
import CommunityModal from "./CommunityModal";
import Freddit from "../Assets/freddit2.png"
import Post from "../Assets/plus.png"
import Message from "../Assets/message.png"
import Moderation from "../Assets/moderation.png"
import Notification from "../Assets/notification.png"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Searchbar from "./Searchbar";
import Menu from "../Assets/menu.png"
import X from "../Assets/x.png"
import Create from "../Assets/create.png"
import Back from "../Assets/back.png"
import Avatar from "../Assets/snoo.png"
import Inbox from "../Assets/inbox.png"
import Help from "../Assets/help.png"
import Terms from "../Assets/terms.png"
import Communities from "../Assets/communities.png"
import Settings from "../Assets/settings.png"

const Header = ( { join, setJoin, modalIsTrue, setModalIsTrue, userData, setUserData, communityData, setCommunityData, 
    communityModal, setCommunityModal, setDrop, drop, setAllJoinedPosts, setIsEmpty, isEmpty, allJoinedPosts, isMobile,
    click, setClick }) => {
    const [ myUser, setMyUser ] = useState([])
    const [ communityDrop, setCommunityDrop ] = useState(false)
    const [ loggedIn, setLoggedIn ] = useState(false)
    const [ homeIsTrue, setHomeIsTrue ] = useState(true)
    const [ communityIsTrue, setCommunityIsTrue ] = useState(false)
    const [ submitIsTrue, setSubmitIsTrue ] = useState(false)
    const [ userIsTrue, setUserIsTrue ] = useState(false)
    const [ loaded, setLoaded ] = useState(false)
    const [ searchIsTrue, setSearchIsTrue ] = useState(false)
    const [ register, setRegister ] = useState(false)
    const user = auth.currentUser;
    const location = useLocation()
    const navigate = useNavigate()
    const params = useParams()

    const handleClick = (e) => { 
        e.preventDefault()
        if (user.isAnonymous) {
            setModalIsTrue(!modalIsTrue)
            } else {
            setDrop(!drop)
        }
    }

    const handleCommunityClick = (e) => {
         if (communityDrop) {
            if (e.target.className === "header-user-profile-login" || e.target.className === "header-user-profile-login-true"
            || e.target.className === "header-item" || e.target.className === "user-left" || e.target.className === "my-communities" ) {
                setCommunityDrop(false)
            }
        } else {
            setCommunityDrop(true)
        }
    }
    
    const handleMobileCommunityClick = (e) => {
        if (communityDrop) {
            if ( e.target.className === "my-communities" ) {
                setCommunityDrop(false)
            }
        } else {
            setCommunityDrop(true)
        }
    }

    const createNewPost = () => {
        navigate('submit')
    }

    const handleMobileClick = (e) => {
        if (click) {
            if (e.target.alt !== "Menu icon") {
                setClick(false)
                navigate('/register')
            } else if (location.pathname.includes('/register')) {
                navigate('/')
                setClick(false)
            } else {
                setClick(false)
                setCommunityDrop(false)
            }
        } else {
            setClick(true)
        }
    }

    const handleMobileLogin = (e) => {
        navigate('/register')
    }

    const handleRegister = () => {
        if (register) {
            navigate('/')
        } else {
            setClick(!click)
        }
    }

    const handleLogOut = (e) => {
        e.preventDefault()
        signOut(auth).then(() => {
            setDrop(false)
            setModalIsTrue(false)
            setLoggedIn(false)
            setMyUser([])
            setAllJoinedPosts([])
            signInAnonymously(auth)
            window.scrollTo({ top:0, behavior:'auto'})
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          })
    }

    const handleMobileLogOut = (e) => {
        e.preventDefault()
        signOut(auth).then(() => {
            setDrop(false)
            setModalIsTrue(false)
            setLoggedIn(false)
            setMyUser([])
            setAllJoinedPosts([])
            setClick(false)
            signInAnonymously(auth)
            window.scrollTo({ top:0, behavior:'auto'})
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          })
    }    

    const getUserInfo = async () => {
        const docRef = doc(db, "users", user.displayName)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        setUserData([data]) 
    }

    const handlePost = (e) => {
         if (location.pathname !== ('/')  && location.pathname.indexOf('/comments/') !== -1) {
            navigate(`f/${location.pathname.split('/comments')[0].split('f/')[1]}/submit`)
        } else if (location.pathname === ('/') || location.pathname.indexOf('/user/') > -1) {
            navigate('/submit')
        } else if (location.pathname.indexOf('/f/') !== -1 && location.pathname.indexOf('/submit') === -1) {            
            navigate(`${location.pathname}/submit`)
        } else {
            navigate('../submit')
        }
    }

    useEffect(() => {
        if (user && !user.isAnonymous) {
            getUserInfo()
        }
    }, [setUserData, location.pathname])

    useEffect(() => {
        if (user && !user.isAnonymous) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }, [user])
 
    useEffect( () => { 
        if (loggedIn) {
            getUserInfo().then( () => {
                setLoaded(true)
                window.scrollTo({ top:0, behavior:'auto'})
            })
        }
    }, [loggedIn]); 

    useEffect(() => {
        if (isMobile && location.pathname === "/register") {
            setRegister(true)
        } else {
            setRegister(false)
        }
    }, [location.pathname])

    useEffect(() =>{
        if (isMobile) {
            setCommunityDrop(false)
            setClick(false)
        }
    }, [location.pathname])

    useEffect(() => {
        if (location.pathname.slice(-6) === 'submit' || location.pathname.slice(-13) === '/submit/submit' ) {
            setHomeIsTrue(false)
            setCommunityIsTrue(false)
            setUserIsTrue(false)
            setSearchIsTrue(false)
            setSubmitIsTrue(true)
        } else if (location.pathname.indexOf('/f/') === 0 ) {
            setHomeIsTrue(false)
            setSubmitIsTrue(false)
            setUserIsTrue(false)
            setSearchIsTrue(false)
            setCommunityIsTrue(true)
        }   else if (location.pathname.indexOf('/search') === 0) {
            setUserIsTrue(false)
            setCommunityIsTrue(false)
            setSubmitIsTrue(false)
            setHomeIsTrue(false)
            setSearchIsTrue(true)
        } else if (location.pathname.indexOf('/user/' === 0) && location.pathname !== '/') {
            setHomeIsTrue(false)
            setCommunityIsTrue(false)
            setSubmitIsTrue(false)
            setSearchIsTrue(false)
            setUserIsTrue(true)
        } else {
            setUserIsTrue(false)
            setCommunityIsTrue(false)
            setSubmitIsTrue(false)
            setSearchIsTrue(false)
            setHomeIsTrue(true)
        }
    }, [location.pathname])

    if (isMobile) {
        if (!loggedIn) {
        return (
                <nav className="nav-bar">
                    <div className="nav-bar-mobile">
                        <div className={register ? "input-empty" : "user-left"}>
                        <img src={click ? X : Menu} alt="Menu icon" onClick={handleMobileClick}></img>
                        </div>
                        <div className={register ? "user-left" : "input-empty"}>
                            <img src={register ? Back : Menu} alt="Back icon" onClick={handleRegister}/>
                        </div>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="logo">
                                <img id="freddit-logo" src={Freddit} alt="Green snoo Logo"></img>
                            </div>
                        </Link>
                    </div>
                    <div className={click ? "nav-bar-mobile-drop" : "input-empty"}>
                            <Searchbar setClick={setClick} isMobile={isMobile} click={click} communityData={communityData}/>
                            <ul>
                                <li>Explore</li>
                                <li>Popular Posts</li>
                                <li>Settings</li>
                                <li>Help Center</li>
                                <li>More</li>
                                <li>Terms & Policies</li>
                            </ul>
                            <button className="header-login-button-mobile" onClick={handleMobileClick}>Sign up or Log in</button>
                        </div>
                    <div className="header-button">
                        <button className="header-login-button" onClick={handleMobileLogin}>Log In</button>
                    </div>
                </nav>
        )
    } else {
        return (
            <nav className="nav-bar">
                <div className="nav-bar-mobile">
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <div className="logo">
                            <img id="freddit-logo" src={Freddit} alt="Green snoo Logo"></img>
                            <div id="freddit">freddit</div>
                        </div>
                    </Link>
                </div>
                <div className={click ? "nav-bar-mobile-drop" : "input-empty"}>
                    <Searchbar setClick={setClick} isMobile={isMobile} click={click}  communityData={communityData}/>
                    <ul>
                        <li onClick={() =>  {setClick(!click); navigate(`/user/${user.displayName}`)}}>
                            <img src={Avatar} alt="Avatar icon"/>
                            {user.displayName}
                        </li>
                        <li>
                            <img src={Inbox} alt="Inbox icon"/>
                            Inbox
                        </li>
                        <li className="my-communities" onClick={handleMobileCommunityClick}>
                            <img src={Communities} alt="Community icon"/>
                            My Communities
                        </li>        
                        <li className={communityDrop ? "header-user-profile-login-true" : "header-user-profile-login" } style={{ border: "none", width: "100%"}} >
                            <CommunitiesDrop
                               userData={userData} communityDrop={communityDrop} setCommunityDrop={setCommunityDrop} setClick={setClick}
                               handleCommunityClick={handleCommunityClick} isMobile={isMobile}  handleMobileCommunityClick={handleMobileCommunityClick}
                            />
                        </li>
                        <li>
                            <img src={Settings} alt="Settings icon"/>
                            Settings
                        </li>
                        <li>
                            <img src={Help} alt="Help icon"/>
                            Help Center
                        </li>
                        <li>
                            <img src={Terms} alt="Terms icon"/>
                            Terms & Policies
                        </li>
                    </ul>
                    <button className="header-login-button-mobile" onClick={handleMobileLogOut}>Log out</button>
                </div>
                <div className="header-mobile-icons">
                <div className={register ? "input-empty" : "user-left"}>
                    <img src={Create} alt="Post icon" onClick={handlePost}></img>
                </div>
                <div className={register ? "input-empty" : "user-left"}>
                    <img src={click ? X : Menu} alt="Menu icon" onClick={handleMobileClick}></img>
                </div>
                <div className={register ? "user-left" : "input-empty"}>
                    <img src={register ? Back : Menu} alt="Back icon" onClick={handleRegister}/>
                </div>
                </div>
        </nav>
        )
    } 
} else {
    if (!loggedIn) {
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
    } else if (loggedIn) { 
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
                                                        <p className={ searchIsTrue ? "user-left" : "input-empty" }>Search Results</p>
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
                                    <div className="nav-login-right">
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
                                    setAllJoinedPosts={setAllJoinedPosts} handleLogOut={handleLogOut}
                                    />
                                </div>
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
}

export default Header