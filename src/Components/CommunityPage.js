import { onAuthStateChanged } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import Error from "./Error";
import Modal from "./Modal";
import Post from "./Post";
import SidebarDrop from "./SidebarDrop";
import CommunityIcon from "../Assets/communityicon.png"
import Hot from "../Assets/hot.png"
import New from "../Assets/new.png"
import Top from "../Assets/top.png"

const CommunityPage = ( {userData, setUserData, communityData, communityModal, setCommunityModal, drop, setDrop, modalIsTrue, 
    setModalIsTrue, setJoin, join, allJoinedPosts, isEmpty, setAllJoinedPosts, setIsEmpty, setCommunityData, getCommunities, 
    isMobile} ) => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ sideBarCommunities, setSideBarCommunities] = useState([])
    const [ text, setText ] =  useState("Joined")
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ page, setPage ] = useState(true)
    const [ subscribed, setSubscribed ] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const user = auth.currentUser;

    const setButtonText = () => {
        if (text === "Joined") {
            setText("Leave")
        } else {
            setText("Joined")
        }
    }

    const handleJoin = async (e) => {
        e.preventDefault()
        const userRef = doc(db, 'users', user.displayName)
        await updateDoc(userRef, { joined: arrayUnion(params.id) } )
        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)
            const data = docSnap.data()
            setUserData([data])
            setSubscribed(true) 
        } 
        getUserInfo()
    }

    const handleMobileJoin = async () => {
        if (isLoggedIn) {
            const userRef = doc(db, 'users', user.displayName)
            await updateDoc(userRef, { joined: arrayUnion(params.id) } )
            const getUserInfo = async () => {
                const docSnap = await getDoc(userRef)
                const data = docSnap.data()
                setUserData([data])
                setSubscribed(true) 
            } 
            getUserInfo()
        } else {
            navigate('/register')
        }
    }


    const handleLeave = async (e) => {
        e.preventDefault()
        const userRef = doc(db, 'users', user.displayName)
        await updateDoc(userRef, { joined: arrayRemove(params.id) } )
        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)
            const data = docSnap.data()
            setUserData([data])
            setSubscribed(false) 
        } 
        getUserInfo()
    }

    const handleClick = (e) => {
        e.preventDefault()
        if (user.isAnonymous) {
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

    const createNewPost = () => {
        navigate('submit')
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
        document.title = `${params.id}`
        window.scrollTo({ top:0, behavior:'auto'})
    }, [params.id])

    useEffect (() => {
        if (params.id !== undefined ) {
            const getCommunity = async () => {
            const docRef = doc(db, "communities", params.id)
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
                if (data === undefined) { 
                    setPage(false)
                } else {
                    setFirebaseCommunityData([data])
                    setPage(true)
                }
            }
            getCommunity()
        }
    }, [params.id])

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && !user.isAnonymous) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        })
    }, [user])

    useEffect(() => {
        if (isLoggedIn && userData[0].joined) {
            if (userData[0].joined.includes(params.id) === true) {
                setSubscribed(true) 
            } else { 
                setSubscribed(false) 
            }
        }
    }, [subscribed, params.id, userData])

    if (isMobile) {
        if (params.id && !page) {
            return (
                <Error isMobile={isMobile}/>
            )
        } else if (params.id) {
            return (
                firebaseCommunityData.map(data => {
                    return (
                        <div className="community-page-mobile" style={isLoggedIn ? {height: "auto"} : {}} key={data.name}>
                            <div className="community-header-top"></div>
                            <img src={CommunityIcon} alt="Community Icon"></img>
                            <div className="community-mobile-info">
                            <div className="community-header-bottom">
                                <div className="community-header-info">
                                    <div className="community-header-info-title">
                                        <h1>{params.id}</h1>
                                    </div>
                                    <div className="community-header-info-subtitle">
                                        f/{params.id}
                                    </div>
                                    <div className="community-header-info-about">
                                        {data.about}
                                    </div>
                                    <div className="community-header-mobile-button">
                                        <button onClick={handleMobileJoin} className={!isLoggedIn ? "community-button-true" : "input-empty" }> Join</button>
                                        <button onClick={handleMobileJoin} className={ (isLoggedIn && !subscribed) ? "community-button-true" : "community-button-false" }>Join</button>
                                        <button onClick={handleLeave} onMouseLeave={setButtonText} className={ isLoggedIn && subscribed ? "community-button-true-joined" : "community-button-false" }>{text}</button>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className={"community-body"}>
                                <div className={"community-body-left"}>
                                    <Post firebaseCommunityData={firebaseCommunityData} getCommunities={getCommunities}
                                        setFirebaseCommunityData={setFirebaseCommunityData} setUserData={setUserData}
                                        createNewPost={createNewPost} isLoggedIn={isLoggedIn}
                                        allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts}
                                        setIsEmpty={setIsEmpty} setCommunityData={setCommunityData} isMobile={isMobile}
                                        />
                                </div>
                            </div>
                        </div>
                    )
                })
            ) 
        } else {
            return (
                <div className="community-body-mobile">
                    <div className={ isLoggedIn ? "input-empty" : "community-body-mobile-top" }>
                        Popular
                    </div>
                    <div className="community-body-left">
                    <Post 
                    firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData}  
                    createNewPost={createNewPost} isLoggedIn={isLoggedIn} getCommunities={getCommunities}
                    communityData={communityData} allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts}
                    setIsEmpty={setIsEmpty} setCommunityData={setCommunityData} setUserData={setUserData} isMobile={isMobile}
                    />
                </div>
            </div>
        )
    }       
  } else {
        if (params.id && !page) {
        return (
            <Error/>
        )
    } else if (params.id) {
        return (
            firebaseCommunityData.map(data => {
                return (
                    <div className={ isLoggedIn ? "community-page" : "community-page-logged-out"} key={data.name}>
                        <Link to={`../f/${data.name}`}>
                            <div className="community-header-top"></div>
                        </Link>
                        <div className="community-header-bottom">
                            <div className={ isLoggedIn ? "community-header-info" : "community-header-info-logged-out"}>
                                <div className="community-header-info-title">
                                    <img src={CommunityIcon} alt="Community Icon"></img>
                                    <h1>{params.id}</h1>
                                    <div className="community-header-buttons">
                                        <button onClick={handleJoin} className={ (isLoggedIn && !subscribed) ? "community-button-true" : "community-button-false" }>Join</button>
                                        <button onClick={handleLeave} onMouseOver={setButtonText} onMouseLeave={setButtonText} className={ isLoggedIn && subscribed ? "community-button-true-joined" : "community-button-false" }>{text}</button>
                                          <button className={ isLoggedIn && subscribed ? "community-button-true-joined" : "community-button-false" }>Alert</button>
                                   </div>
                                </div>
                                <div className="community-header-info-subtitle">
                                    f/{params.id}
                                </div>
                            </div>
                        </div>
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
                                                <SidebarDrop x={x} item={item}/>
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
                        <div className={isLoggedIn ? "community-body" : "community-body-logged-out"}>
                            <div className={ isLoggedIn ? "community-body-left" : "community-body-left-logged-out"}>
                                <div className={ isLoggedIn ? "community-post-true" : "community-post-false"}>
                                    <img id="community-input-img" src={ isLoggedIn ? user.photoURL : null} alt="User Icon"></img>
                                    <input type="text" placeholder="Create Post" onClick={createNewPost}></input>
                                </div>
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
                                <Post firebaseCommunityData={firebaseCommunityData} getCommunities={getCommunities}
                                    setFirebaseCommunityData={setFirebaseCommunityData} setUserData={setUserData}
                                    createNewPost={createNewPost} isLoggedIn={isLoggedIn}
                                    allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts}
                                    setIsEmpty={setIsEmpty} setCommunityData={setCommunityData}
                                    />
                            </div>
                            <div className={ isLoggedIn ? "community-body-right" : "community-body-right-logged-out"}>
                                <CommunityInformation 
                                    communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
                                    createNewPost={createNewPost} isLoggedIn={isLoggedIn} firebaseCommunityData={firebaseCommunityData} 
                                    setFirebaseCommunityData={setFirebaseCommunityData} 
                                />
                            </div>
                        </div>
                    </div>
                )
            })
        ) 
    } else {
        return (
        <div className="community-page-logged-out">
            <div className={isLoggedIn ? "input-empty" : "side-bar" }>
                <div className="side-bar-top">
                    <div className="side-bar-list-top">
                        <h6>FEEDS</h6>
                        <div><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Home</Link></div>
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
                                                <SidebarDrop x={x} item={item}/>
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
            <div className={ isLoggedIn ? "community-body" : "community-body-logged-out"}>
                <div className={isLoggedIn ? "community-body-left" : "community-body-left-logged-out"}>
                <div className={ isLoggedIn ? "community-post-true" : "community-post-false"}>
                    <img id="community-input-img" src={ isLoggedIn ? user.photoURL : null} alt="User Icon"></img>
                        <input type="text" placeholder="Create Post" onClick={createNewPost}></input>
                    </div>
                    <div className="community-filters">
                        <ul>
                            <li>
                                <img src={Hot} alt="Hot icon"/>
                                Hot
                            </li>
                            <li>
                            <img src={New} alt="New icon"/>
                                New
                            </li>
                            <li>
                            <img src={Top} alt="Top icon"/>
                                Top
                            </li>
                            <li>
                                ...
                            </li>
                        </ul>
                    </div>
                <Post 
                firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData}  
                createNewPost={createNewPost} isLoggedIn={isLoggedIn} getCommunities={getCommunities}
                communityData={communityData} allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts}
                setIsEmpty={setIsEmpty} setCommunityData={setCommunityData} setUserData={setUserData}
                />
            </div>
            <div className={ isLoggedIn ? "community-body-right" : "community-body-right-logged-out"}>
                <CommunityInformation 
                communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
                firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData}
                isLoggedIn={isLoggedIn}
                />
            </div>
        </div>
    </div>
    )
}
    } 
}


export default CommunityPage