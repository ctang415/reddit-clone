import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import Post from "./Post";

const CommunityPage = ( { } ) => {
    const [ post, setPost] = useState(false)
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const params = useParams()
    const user = auth.currentUser;

    useEffect (() => {
        if (params.id === undefined) {
            console.log('hey')
        } else {
        const getCommunity = async () => {
        const docRef = doc(db, "communities", params.id)
        const docSnap = await getDoc(docRef);
        const data = docSnap.data()
        setFirebaseCommunityData([data])
    }
    getCommunity()
}
    console.log(params) 
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
            <div className="community-header-top">

            </div>
            <div className="community-header-bottom">
                <div className="community-header-info">
                    <div className="community-header-info-title">
                        <img></img>
                        <h1>{params.id}</h1>
                        <button className={ isLoggedIn ? "community-button-true" : "community-button-false" }>Join</button>
                        <button className={ isLoggedIn ? "community-button-true" : "community-button-false" }>Alert</button>
                    </div>
                    <div className="community-header-info-subtitle">
                        f/{params.id}
                    </div>
                </div>
            </div>
            <div className="community-body">
                <div className="community-body-left">
                    <div className={ post ? "community-post-true" : "community-post-false"}>
                        <img></img>
                        <input type="text"></input>
                        <button>IMG</button>
                        <button>LNK</button>
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
                    <CommunityInformation firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} />
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
                <div className={ post ? "community-post-true" : "community-post-false"}>
                    <img></img>
                    <input type="text"></input>
                    <button>IMG</button>
                    <button>LNK</button>
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
                <CommunityInformation params={params} firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} />
            </div>
        </div>
    </div>
    )
}
}

export default CommunityPage