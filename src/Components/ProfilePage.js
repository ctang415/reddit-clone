import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import Modal from "./Modal";
import ProfilePosts from "./ProfilePosts";
import SidebarDrop from "./SidebarDrop";

const ProfilePage = ( { userData, setDrop, drop, modalIsTrue, setModalIsTrue, join, setJoin, firebaseCommunityData, 
                    setUserData } ) => {
    const [ profileData, setProfileData ] = useState([{avatar: null, created: 'unknown', karma: 'unknown'}]) 
    const [ sideBarCommunities, setSideBarCommunities] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ matchingUser, setMatchingUser ] = useState(false)
    const [ overview, setOverview ] = useState(true)
    const [ postsOnly, setPostsOnly ] = useState(false)
    const [ commentsOnly, setCommentsOnly ] = useState(false)
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const user = auth.currentUser

    const createNewPost = () => {
        navigate('../submit')
    }

    const handleOverview = () => {
        setOverview(true)
        setPostsOnly(false)
        setCommentsOnly(false)
    }

    const handlePosts = () => {
        setPostsOnly(true)
        setOverview(false)
        setCommentsOnly(false)
    }

    const handleComments = () => {
        setCommentsOnly(true)
        setOverview(false)
        setPostsOnly(false)
    }

    const profileNav = [ 
        { title: 'OVERVIEW', method: handleOverview }, { title: 'POSTS', method: handlePosts }, 
        { title: 'COMMENTS', method: handleComments }, {title: 'HISTORY'}, {title: 'SAVED'}, {title: 'HIDDEN'}, 
        {title: 'UPVOTED'} , {title: 'DOWNVOTED'}, {title: 'AWARDS RECEIVED'} , {title: 'AWARDS GIVEN' }
    ]

    const handleClick = (e) => {
        e.preventDefault()
        if (!user) {
            setModalIsTrue(!modalIsTrue)
            setJoin(true)
            } else {
            setDrop(!drop)
        }
    }
    const handleCommunityDrop = (e) => {
        const newCom = sideBarCommunities.map(x => {
            if (x.drop === true && (e.target.className !== 'side-bar-dropbox-list')) {
                x.drop = !x.drop
                return x
            }
            if ((x.header === e.currentTarget.className) && (e.target.className !== 'side-bar-dropbox-list') ) {
                x.drop = !x.drop
                return x
            }
        return x
    }
    )
        setSideBarCommunities(newCom)
    }

    useEffect(() => {
        const communityList = [ 
            {header: "Gaming", list: ["Valheim", "Genshin Impact", "MineCraft", "Pokimane", "Halo Infinite", "Path of Exile", "Escape from Tarkov", "Call of Duty: Warzone"], drop: false}, 
            {header: "Sports", list: ["NFL", "NBA", "Atlanta Hawks", "Los Angeles Lakers", "Boston Celtics", "UFC", "Philadelphia 76ers"], drop: false}, 
            {header: "Crypto", list: ["Cardano", "Dogecoin", "Algorand", "Bitcoin", "Litecoin"], drop: false},
            {header: "Television", list: ["The Bachelor", "Wife Swap", "The Real Housewives of Atlanta", "Sister Wives", "90DayFiance", "Married at First Sight"], drop:false},
            {header: "Celebrity", list: ["Kim Kardashian", "Doja Cat", "Henry Cavill", "Tom Hiddleston", "Keanu Reeves"], drop:false}
         ]
        setSideBarCommunities(communityList)
      }, [])
    
    useEffect(() => {
            const getUserInfo = async () => {
                const docRef = doc(db, "users", params.id)
                const docSnap = await getDoc(docRef)
                const data = docSnap.data()
                setProfileData([data])
                console.log(profileData) 
            } 
        getUserInfo() 
    }, [setProfileData])

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [user]) 

    useEffect(() => {
        if (user) {
            if (user.displayName === params.id) {
                setMatchingUser(true)
            } else {
                setMatchingUser(false)
            }
        } else {
            setMatchingUser(false)
        }
    }, [user])

    useEffect(() => {
        document.title = `${params.id} (u/${params.id})`
        window.scrollTo({ top:0, behavior:'auto'})
    }, [location.pathname])
    
    if (!isLoggedIn && !matchingUser) {
        return (
            <div className="community-page-logged-out">
                  <div className={isLoggedIn ? "input-empty" : "side-bar" }>
                <div className="side-bar-top">
                    <div className="side-bar-list-top">
                        <h6>FEEDS</h6>
                        <div>Home</div>
                        <div>Popular</div>
                    </div>
                    <div className="side-bar-list-top">
                        <h6>TOPICS</h6>
                        <ul className="side-bar-list">
                            {sideBarCommunities.map(item => {
                                return (
                                    <li key={item.header} className={item.header} onClick={handleCommunityDrop}>
                                        <div className="list-item">
                                            <div>{item.header}</div>    
                                            <div>⌄</div>
                                        </div>
                                        <div className="side-bar-list-item">
                                        {item.list.map( x => {
                                            return (
                                                <SidebarDrop key={x} x={x} item={item}/>
                                            )
                                        })}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <div className="side-bar-bottom">
                    <div className="side-bar-divider"></div>
                    <div className="side-bar-text">Create an account to follow your favorite communities and start taking part in conversations.</div>
                    <button className="join-button" onClick={handleClick}>Join Freddit</button>
                    <Modal 
                    modalIsTrue={modalIsTrue}
                    setModalIsTrue={setModalIsTrue}
                    join={join} setJoin={setJoin} 
                    />
                </div>
            </div>
                <div className="profile-page">
                    <ul>
                        <li onClick={handleOverview}>
                            OVERVIEW
                        </li>
                        <li onClick={handlePosts}>
                            POSTS
                        </li>
                        <li onClick={handleComments}>
                            COMMENTS
                        </li>
                        <li>
                            AWARDS RECEIVED
                        </li>
                    </ul>
                </div>
                <div className="community-body-logged-out">
                    <div className="community-body-left-logged-out">
                        <div className="community-filters">
                            <ul>
                                <li>
                                    Hot
                                </li>
                                <li>
                                    New
                                </li>
                                <li>
                                    Top
                                </li>
                                <li>
                                    ...
                                </li>
                            </ul>
                        </div>
                        <ProfilePosts matchingUser={matchingUser} overview={overview} commentsOnly={commentsOnly} postsOnly={postsOnly}
                        setOverview={setOverview} setCommentsOnly={setCommentsOnly} setPostsOnly={setPostsOnly} setUserData={setUserData}
                        />
                    </div>
                    {profileData.map((item) => {
                        return (
                    <div className="community-body-right-logged-out" key={item}>
                        <div className="community-info-bar">
                            <div className="community-info">
                                <div className="profile-info-top"></div>
                                <div className="profile-avatar">
                                    <img src={item.avatar} alt="Avatar"></img>
                                </div>
                                <div className="profile-info-text">
                                    <h3>{params.id}</h3>
                                    <h6>u/{params.id}</h6>
                                    <button className="avatar-button">Create Your Own Avatar</button>
                                    <div className="profile-info-subtext">
                                        <div>
                                            <p className="subtext-bold">Karma</p>
                                            <p>{item.karma}</p>
                                        </div>
                                        <div>
                                            <p className="subtext-bold">Cake Day</p>
                                            <p>{item.created}</p>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            <div className="top-button">
                                <button className="back-to-top" onClick={(e) => window.scrollTo({ top:0, behavior:'auto'}) }>Back to Top</button>
                            </div>
                        </div>
                    </div>
                        )
                    })}
                </div>
            </div>
        )
    } else if (isLoggedIn && matchingUser) {
        return (
            <div className="community-page">
                    <div className="profile-page">
                        <ul>
                            {profileNav.map(item => {
                                return (
                                    <li key={item.title} onClick={item.method}>
                                    {item.title}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                <div className="community-body">
                    <div className="community-body-left">
                        <div className="community-filters">
                            <ul>
                                <li>
                                    Hot
                                </li>
                                <li>
                                    New
                                </li>
                                <li>
                                    Top
                                </li>
                                <li>
                                    ...
                                </li>
                            </ul>
                        </div>
                        <ProfilePosts matchingUser={matchingUser} overview={overview} commentsOnly={commentsOnly} postsOnly={postsOnly}
                        setOverview={setOverview} setCommentsOnly={setCommentsOnly} setPostsOnly={setPostsOnly} setUserData={setUserData}
                        />
                    </div>
                    <div className="community-body-right">
                    <div className="community-info-bar">
                <div className="community-info">
                    <div className="profile-info-top"></div>
                    <div className="profile-avatar">
                        <img src={userData[0].avatar} alt="Avatar"></img>
                    </div>
                    <div className="profile-info-text">
                        <h3>{params.id}</h3>
                        <h6>u/{params.id}</h6>
                        <button className="avatar-button">Style Avatar</button>
                        <div className="profile-info-subtext">
                        <div>
                            <p className="subtext-bold">Karma</p>
                            <p>{userData[0].karma}</p>
                        </div>
                        <div>
                            <p className="subtext-bold">Cake Day</p>
                            <p>{userData[0].created}</p>
                        </div>
                        </div>
                    </div>
                    <div className="create-button">
                        <button className="community-post-button" onClick={createNewPost}>New Post</button>
                    </div>
                </div>
                <div className="top-button">
                        <button className="back-to-top" onClick={(e) => window.scrollTo({ top:0, behavior:'auto'}) }>Back to Top</button>
                    </div>
            </div>
      
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="community-page">
                    <div className="profile-page">
                        <ul>
                            {profileNav.map(item => {
                                return (
                                    <li key={item.title} onClick={item.method}>
                                    {item.title}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                <div className="community-body">
                    <div className="community-body-left">
                        <div className="community-filters">
                            <ul>
                                <li>
                                    Hot
                                </li>
                                <li>
                                    New
                                </li>
                                <li>
                                    Top
                                </li>
                                <li>
                                    ...
                                </li>
                            </ul>
                        </div>
                        <ProfilePosts matchingUser={matchingUser} overview={overview} commentsOnly={commentsOnly} postsOnly={postsOnly}
                        setOverview={setOverview} setCommentsOnly={setCommentsOnly} setPostsOnly={setPostsOnly} setUserData={setUserData}
                        />
                    </div>
                    <div className="community-body-right">
                    <div className="community-info-bar">
                <div className="community-info">
                    <div className="profile-info-top"></div>
                    <div className="profile-avatar">
                    <img src={profileData[0].avatar} alt="Avatar"></img> 
                    </div>
                    <div className="profile-info-text">
                        <h3>{params.id}</h3>
                        <h6>u/{params.id}</h6>
                        <div className="profile-info-subtext">
                        <div>
                            <p className="subtext-bold">Karma</p>
                            <p>{profileData[0].karma}</p>
                        </div>
                        <div>
                            <p className="subtext-bold">Cake Day</p>
                            <p>{profileData[0].created}</p>
                        </div>
                        </div>
                    </div>
                    <div className="create-button">
                        <button className="community-user-button">Follow</button>
                        <button className="community-user-button">Chat</button>
                    </div>
                </div>
                <div className="top-button">
                        <button className="back-to-top" onClick={(e) => window.scrollTo({ top:0, behavior:'auto'}) }>Back to Top</button>
                    </div>
            </div>
      
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfilePage