import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import Error from "./Error";
import Modal from "./Modal";
import Post from "./Post";
import SidebarDrop from "./SidebarDrop";

const CommunityPage = ( {communityData, communityModal, setCommunityModal, drop, setDrop, modalIsTrue, setModalIsTrue, setJoin, join} ) => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ sideBarCommunities, setSideBarCommunities] = useState([])
    const [ text, setText ] =  useState("Joined")
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ page, setPage ] = useState(true)
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
    }, [])

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
    }, [])


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        })
    }, [user])

    if (params.id && page === false) {
        return (
            <Error/>
        )
    } else if (params.id) {
        return (
            firebaseCommunityData.map(data => {
                return (
                    <div className="community-page">
                        <Link to="">
                            <div className="community-header-top"></div>
                        </Link>
                        <div className="community-header-bottom">
                            <div className="community-header-info">
                                <div className="community-header-info-title">
                                    <img alt="Community Icon"></img>
                                    <h1>{params.id}</h1>
                                    <div className="community-header-buttons">
                                        <button className={ isLoggedIn ? "community-button-true" : "community-button-false" }>Join</button>
                                        <button onMouseOver={setButtonText} onMouseLeave={setButtonText} className={ isLoggedIn ? "community-button-true-joined" : "community-button-false" }>{text}</button>
                                          <button className={ isLoggedIn ? "community-button-true-joined" : "community-button-false" }>Alert</button>
                                   </div>
                                </div>
                                <div className="community-header-info-subtitle">
                                    f/{params.id}
                                </div>
                            </div>
                        </div>
                        <div className="community-body">
                            <div className="community-body-left">
                                <div className={ isLoggedIn ? "community-post-true" : "community-post-false"}>
                                    <img id="community-input-img" src={ user ? user.photoURL : null} alt="User Icon"></img>
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
                                <Post />
                            </div>
                            <div className="community-body-right">
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
            <div className={ isLoggedIn ? "community-body" : "community-body-logged-out"}>
                <div className={isLoggedIn ? "community-body-left" : "community-body-left-logged-out"}>
                <div className={ isLoggedIn ? "community-post-true" : "community-post-false"}>
                    <img id="community-input-img" src={user ? user.photoURL : null} alt="User Icon"></img>
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
                <Post />
            </div>
            <div className={ isLoggedIn ? "community-body-right" : "community-body-right-logged-out"}>
                <CommunityInformation 
                communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
                firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} 
                />
            </div>
        </div>
    </div>
    )
}
}

export default CommunityPage