import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import Post from "./Post";


const CommunityPage = ( { } ) => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [text, setText] =  useState("Joined")
    const params = useParams()
    const navigate = useNavigate()
    const user = auth.currentUser;

    const buttonText = () => {
        if (text === "Joined") {
            setText("Leave")
        } else {
            setText("Joined")
        }
    }

    const createNewPost = () => {
        navigate('submit')
    }

    useEffect (() => {
        if (params.id !== undefined) {
        const getCommunity = async () => {
        const docRef = doc(db, "communities", params.id)
        const docSnap = await getDoc(docRef);
        const data = docSnap.data()
        setFirebaseCommunityData([data])
    }
    getCommunity()
}
    }, [])

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true)
                console.log(isLoggedIn) 
            } else {
                setIsLoggedIn(false)
                console.log(isLoggedIn) 
            }
        })
    }, [user])

    if (params.id) {
        return (
        firebaseCommunityData.map(data => {
            return (
        <div className="community-page">
            <Link to="">
                <div className="community-header-top">
                </div>
            </Link>
            <div className="community-header-bottom">
                <div className="community-header-info">
                    <div className="community-header-info-title">
                        <img></img>
                        <h1>{params.id}</h1>
                        <div className="community-header-buttons">
                        <button className={ isLoggedIn ? "community-button-true" : "community-button-false" }>Join</button>
                        <button onMouseOver={buttonText} onMouseLeave={buttonText} className={ isLoggedIn ? "community-button-true-joined" : "community-button-false" }>{text}</button>
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
                    <img id="community-input-img" src={ isLoggedIn ? user.photoURL : null }></img>
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
                    <CommunityInformation createNewPost={createNewPost} isLoggedIn={isLoggedIn} firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} />
                </div>
            </div>
        </div>
    )
})
    )   
} else {
    return (
        <div className="community-page">
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
                <Post />
            </div>
            <div className="community-body-right">
                <CommunityInformation firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} />
            </div>
        </div>
    </div>
    )
}
}

export default CommunityPage