import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import Post from "./Post";

const ProfilePage = ( { userData } ) => {
    const profileNav = ['OVERVIEW', 'POSTS', 'COMMENTS', 'HISTORY', 'SAVED', 'HIDDEN', 'UPVOTED', 'DOWNVOTED', 'AWARDS RECEIVED', 'AWARDS GIVEN']
    const [ profileData, setProfileData ] = useState([{created: 'unknown', karma: 'unknown'}]) 
    const navigate = useNavigate()
    const params = useParams()
    const user = auth.currentUser

    const createNewPost = () => {
        navigate('../submit')
    }
    
    useEffect(() => {
        if (!user) {
            const getUserInfo = async () => {
                const docRef = doc(db, "users", params.id)
                const docSnap = await getDoc(docRef)
                const data = docSnap.data()
                setProfileData([data])
                console.log(profileData) 
            } 
        getUserInfo() 
        }
    }, [setProfileData])
    
    if (!user) {
        return (
            <div className="community-page">
                <div className="profile-page">
                    <ul>
                        {profileNav.map(item => {
                            return (
                                <li key={item}>
                                    {item}
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
                        <Post />
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
                                    <button className="avatar-button">Create Your Own Avatar</button>
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
                            </div>
                            <div className="top-button">
                                <button className="back-to-top" onClick={(e) => window.scrollTo({ top:0, behavior:'auto'}) }>Back to Top</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else if (user && (user.displayName === params.id)) {
        return (
            <div className="community-page">
                    <div className="profile-page">
                        <ul>
                            {profileNav.map(item => {
                                return (
                                    <li key={item}>
                                    {item}
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
                        <Post />
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
                                    <li key={item}>
                                    {item}
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
                        <Post />
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