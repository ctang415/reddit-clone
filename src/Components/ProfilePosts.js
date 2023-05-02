import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";

const ProfilePosts = ( ) => {
    const [userInfo, setUserInfo ] = useState([])
    const [isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ edit, setEdit ] = useState(false)
    const params = useParams()
    const location = useLocation()
    const user = auth.currentUser

    const getUserInfo = async () => {
        const docRef = doc(db, "users", params.id)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        setUserInfo([data])
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [user])

    useEffect(() => {
        if (user) {
            if (params.id === user.displayName) {
                setEdit(true)
            } else {
                setEdit(false)
            }
        }
    }, [user])

    return (
        userInfo.map((info) => {
            return ( 
                <div className="profile-post">
                        <div className="profile-post-top">
                                <Link to=""><p className="profile-post-username">USERNAME</p></Link> commented on 
                                <p className="profile-post-title">POST TITLE</p> in *
                                <p className="profile-post-community-name">COMMUNITYNAME</p> * Posted by 
                                <p className="profile-post-poster">POST AUTHOR</p>
                        </div>
                        <div className="profile-post-bottom">
                            <div>
                            <div className="profile-post-poster-information">
                                <p className="profile-post-title">USERNAME</p> 
                                # POINTS * # DAYS AGO
                            </div>
                            <p>POST TEXT</p>
                            <ul>
                                <li>Reply</li>
                                <li>Share</li>
                                <li>Save</li>
                                <li className={""}>Edit</li>
                                <li>Delete</li>
                            </ul>
                        </div>
                        </div>
                </div>
            )
        })
    )
}

export default ProfilePosts