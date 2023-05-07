import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    const navigate = useNavigate()
    const user = auth.currentUser

    const getUserInfo = async () => {
        const docRef = doc(db, "users", params.id)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data() 
        setUserInfo(data.comments)
        setUserInfo(prev => [...prev, data.posts[0]])  
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
        userInfo.map((data) => {
            return (
                <div className="post-width">
                    <div className={ data.poster ? "post" : "input-empty"}>
                        <div className="post-left">
                            <div className="post-votes">
                                <img src={Up} alt="Up arrow"></img>
                                    {data.votes}
                                <img src={Down} alt="Down arrow"></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <div className="post-right-profile">
                                <div className="post-pinned-community"><Link to={`../f/${data.community}`}>f/{data.community}</Link></div>
                                <div className="post-pinned-author">Posted by <Link to={`../user/${params.id}`}>u/{params.id}</Link></div>
                            </div>
                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                <div className="post-pinned-header"> 
                                    {data.title}
                                </div>
                                <div className="post-media-true">
                                    {parse(`${data.content.html}`)}
                                </div>
                            </Link>
                            <ul>
                                <li><img src={Comment} alt="Comment bubble"/> { data.poster ? data.comments.length : null } Comments</li> 
                                <li><img src={Share} alt="Share button" /> Share</li>
                                <li><img src={Save} alt="Save button" /> Save</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                    <div className={data.poster ? "input-empty" : "profile-post" }>
                        <div className="profile-post-top">
                        <Link to={`../user/${data.username}`}>
                            <div className="profile-post-username">{data.username}</div> 
                        </Link> commented on 
                        <div className="profile-post-title">
                            <Link to={`../f/${data.community}/comments/${data.id}`}>{data.title}</Link>
                        </div> 
                            in *
                        <div className="profile-post-community-name">
                            <Link to={`../f/${data.community}`}>
                                {data.community}
                            </Link>
                            </div> 
                                * Posted by 
                        <div className="profile-post-poster">
                        <Link to={`../user/${data.author}`}>
                            {data.author}
                        </Link>
                        </div>
                    </div>
                    <div className="profile-post-bottom">
                            <div>
                                <div className="profile-post-poster-information">
                                       <div onClick={() => navigate(`../user/${data.username}`)}>
                                            {data.username}
                                        </div> 
                                        {data.votes} POINTS * # DAYS AGO
                                </div>
                                <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        <div className="profile-post-text">{parse(`${data.content.html}`)}</div>
                                </Link>
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
            </div>
        )
    })
    )

}

export default ProfilePosts