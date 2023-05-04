import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import parse from 'html-react-parser';
import * as sanitizeHtml from 'sanitize-html';
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Comment from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"

const ProfilePosts = ( ) => {
    const [ userInfo, setUserInfo ] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ edit, setEdit ] = useState(false)
    const params = useParams()
    const location = useLocation()
    const user = auth.currentUser

    const getUserInfo = async () => {
        const docRef = doc(db, "users", params.id)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        setUserInfo([data.posts])
        console.log(userInfo)

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
        console.log(userInfo)
    }, [user])
  

    return (
        userInfo.map((info) => {
            return (
                info.map((data) => {
                    return (
                <div>
                    <div className={ info.poster ? "input-empty" : "post"}>
                        <div className="post-left">
                            <div className="post-votes">
                                <img src={Up} alt="Up arrow"></img>
                                    {data.votes}
                                <img src={Down} alt="Down arrow"></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <div className="post-right-profile">
                                <p className="post-pinned-community"><Link to={`../f/${data.community}`}>f/{data.community}</Link></p>
                                <p className="post-pinned-author">Posted by <Link to={`../user/${data.author}`}>u/{data.author}</Link></p>
                            </div>
                            <p className="post-pinned-header">
                                {data.title}
                            </p>
                            <div className="post-media-true">
                                {parse(`${data.content.html}`)}
                            </div>
                            <ul>
                                <li><img src={Comment} alt="Comment bubble"/> {data.comments.length} Comments</li>
                                <li><img src={Share} alt="Share button" /> Share</li>
                                <li><img src={Save} alt="Save button" /> Save</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                    <div className={info.poster ? "profile-post": "input-empty"}>
                        <div className="profile-post-top">
                        <Link to="">
                            <p className="profile-post-username">USERNAME</p>
                        </Link> commented on 
                        <p className="profile-post-title">{info.title}</p> in *
                        <p className="profile-post-community-name">{info.community}</p> * Posted by 
                        <p className="profile-post-poster">{info.author}</p>
                    </div>
                    <div className="profile-post-bottom">
                        <Link to="">
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
                        </Link>
                    </div>
                </div>
            </div>
                    )
                })
        )
    })
    )
}

export default ProfilePosts