import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";

const CreatePost = () => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const user = auth.currentUser;

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
})

    useEffect(() => {
        if (!isLoggedIn)
        {
            navigate('/')
        }
    }, [])

    if (isLoggedIn) {
    return (
        <div className="community-page">
        <div className="community-body">
            <div className="community-body-left">
                <div className="community-post-header">
                    <div>
                        Create a post
                    </div>
                    <div id="community-draft">
                        DRAFTS 
                        <div>0</div>
                    </div>
                </div>
                <div className="community-header-divider"></div>
                <div>
                    <input type="text"></input>
                </div>
                <div className="community-post">
                    <form>
                    <div className="community-post-options">
                        <ul>
                            <li>
                                Post
                            </li>
                            <li>
                                Images & Video
                            </li>
                            <li>
                                Link
                            </li>
                            <li>
                                Poll
                            </li>
                        </ul>
                    </div>
                    <div className="community-post-section">
                    <div className="community-post-title">
                        <input type="text" maxLength="300" placeholder="Title"></input>
                        <input type="textarea" placeholder="Text (optional)"></input>
                    </div>
     
                    <div className="community-post-divider"></div>
         
                    <div className="community-post-buttons">
                        <button id="community-save-button">Save Draft</button>
                        <button id="community-post-button">Post</button>
                    </div>
                    </div>
                    <div className="community-post-bottom">
                    </div>
                    </form>
                </div>
            </div>
            <div className="community-body-right">
            <CommunityInformation firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} />
            </div>
        </div>
    </div>
    )
    }
}

export default CreatePost