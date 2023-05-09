import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import Error from "./Error";
import Modal from "./Modal";
import SidebarDrop from "./SidebarDrop";
import CommunityIcon from "../Assets/communityicon.png"
import PostDetailsCard from "./PostDetailsCard";

const PostDetails = ( {modalIsTrue, setModalIsTrue, communityModal, setCommunityModal, setDrop, drop, join, setJoin} ) => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ pageExists, setPageExists ] = useState(true)
    const [ detail, setDetail ] = useState([ { content: {html: '' }, votes: 'unknown',  comments: []  } ])
    const [ sideBarCommunities, setSideBarCommunities] = useState([])
    const [ isTrue, setIsTrue ] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const user = auth.currentUser

    const handleClick = (e) => {
        e.preventDefault()
        if (!user) {
            setModalIsTrue(!modalIsTrue)
            setJoin(true)
            } else {
            setDrop(!drop)
        }
    }

    const createNewPost = () => {
        navigate(`../../f/${location.pathname.split('f/')[1].split('/comments')[0]}/submit`)
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

    useEffect (() => {
            const getCommunity = async () => {
            const docRef = doc(db, "communities", location.pathname.split('f/')[1].split('/comments')[0])
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
                setFirebaseCommunityData([data])
            }
            getCommunity()
        console.log(firebaseCommunityData)
    }, [])


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        })
        console.log(location.pathname.split('f/')[1].split('/comments')[0])
        console.log(firebaseCommunityData)
    }, [user])


    useEffect(() => {
        if (firebaseCommunityData[0] !== undefined) { 
            if (firebaseCommunityData[0].posts.find( item => item.id === params.id)) {
                setDetail([firebaseCommunityData[0].posts.find( item => item.id === params.id)])
                setPageExists(true)
        } else {
            setPageExists(false)
        }
    } 
    }, [firebaseCommunityData])

    useEffect(() => {
        window.scrollTo({ top:0, behavior:'auto'})
    }, [])

    if (!pageExists) {
        return (
            <Error/>
        )
    } else if (pageExists) {
        return (
                    <div className={ isLoggedIn ? "community-page" : "community-page-logged-out"}>
                        <Link to={`../f/${location.pathname.split('f/')[1].split('/comments')[0]}`}>
                            <div className="community-header-top"></div>
                        </Link>
                        <div className="community-header-bottom">
                            <div className={ isLoggedIn ? "community-header-info" : "community-header-info-logged-out"}>
                                <div className="community-header-info-title">
                                    <img src={CommunityIcon} alt="Community Icon"></img>
                                    <h1>f/{location.pathname.split('f/')[1].split('/comments')[0]}</h1>
                                </div>
                                <div className="community-header-info-subtitle">
                                    f/{location.pathname.split('f/')[1].split('/comments')[0]}
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
                        <div className={isLoggedIn ? "community-body" : "community-body-logged-out"}>
                            <div className={ isLoggedIn ? "community-body-left" : "community-body-left-logged-out"}>
                                <div className={ isLoggedIn ? "community-post-true" : "community-post-false"}>
                                    <img id="community-input-img" src={ user ? user.photoURL : null} alt="User Icon"></img>
                                    <input type="text" placeholder="Create Post" onClick={createNewPost}></input>
                                </div>
                                <PostDetailsCard firebaseCommunityData={firebaseCommunityData} detail={detail} />
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
       
                </div>
            </div>
            <div className={ isLoggedIn ? "community-body" : "community-body-logged-out"}>
                <div className={isLoggedIn ? "community-body-left" : "community-body-left-logged-out"}>
                <div className={ isLoggedIn ? "community-post-true" : "community-post-false"}>
                    <img id="community-input-img" src={user ? user.photoURL : null} alt="User Icon"></img>
                        <input type="text" placeholder="Create Post" onClick={createNewPost}></input>
                    </div>
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



export default PostDetails