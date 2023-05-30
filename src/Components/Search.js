import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommunityIcon from "../Assets/communityicon.png"
import { auth, db } from "../firebase-config";
import Modal from "./Modal";
import SidebarDrop from "./SidebarDrop";

const Search = ( {communityData, setUserData, drop, setDrop, setJoin, modalIsTrue, setModalIsTrue, join } ) => {
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ sideBarCommunities, setSideBarCommunities] = useState([])
    const user = auth.currentUser

    const handleJoin = async (e) => {
        e.preventDefault()
        const userRef = doc(db, 'users', user.displayName)
        await updateDoc(userRef, { joined: arrayUnion(e.target.id) } )
        const getUserInfo = async () => {
            const docSnap = await getDoc(userRef)
            const data = docSnap.data()
            setUserData([data])
        } 
        getUserInfo()
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
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [user])


    return (
        <div className={isLoggedIn ? "community-page" : "community-page-logged-out"}>
            <div className={ isLoggedIn ? "search-page" : "search-page-logged-out" }>
            {communityData.map(community => {
                return (
                    <div className="community-card">
                        <Link to={`../f/${community.name}`}>
                        <div className="community-card-left">
                            <div className="community-card-logo">
                                <img src={CommunityIcon} alt="Community icon"></img>
                            </div>
                            <div className="community-card-information">
                                <div className="community-card-title">
                                    f/{community.name}
                                </div>
                                <div className="community-card-about">
                                    {community.about}
                                </div>
                            </div>
                        </div>
                        </Link>
                        <div className="community-card-join">
                            <button onClick={ isLoggedIn ? handleJoin : handleClick} id={community.name}>Join</button>
                        </div>
                    </div>
                )
            })}
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
        </div>
    )
}
export default Search