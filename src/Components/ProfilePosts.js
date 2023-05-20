import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import parse from 'html-react-parser';
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Comment from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"

const ProfilePosts = ( { overview, commentsOnly, postsOnly, matchingUser, setOverview, setCommentsOnly, setPostsOnly } ) => {
    const [ userInfo, setUserInfo ] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ posts, setPosts ] = useState([])
    const [ comments, setComments ] = useState([])
    const params = useParams()
    const navigate = useNavigate()
    const user = auth.currentUser
    const location = useLocation()

    const getUserInfo = async () => {
        const docRef = doc(db, "users", params.id)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        if (data.posts[0] && data.comments) {
            setUserInfo(data.comments)
            setComments(data.comments)
            setUserInfo(prev => [...prev, data.posts[0]])
            setPosts([data.posts[0]])
            setOverview(true)
            setPostsOnly(false)
            setCommentsOnly(false)
        } else if (data.posts[0] && !data.comments) {
            setUserInfo(prev => [...prev, data.posts[0]])
            setPosts([data.posts[0]])
            setPostsOnly(true)
            setOverview(false)
            setCommentsOnly(false)
        } else {
            setUserInfo(data.comments)
            setComments(data.comments)
            setCommentsOnly(true)
            setOverview(false)
            setPostsOnly(false)
        }
        console.log(userInfo)
    }

    const handleDelete = async (e) => {
        const docRef = doc(db, "communities", e.target.parentNode.className)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()

        const userRef = doc(db, "users", user.displayName)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()

        let newArray;
        const deleteComment = () => {
            const updatePost = userData.comments.filter(item => {
                if (item.commentid !== e.target.id) {
                    return item
                }
            })
            newArray = updatePost
        }
        let filteredArray;
        const deleteFromFirebase = () => {
            const updateComment = data.posts.map(item => {
                return {...item, comments: item.comments.filter((x) => x.commentid !== e.target.id)}
            })
            filteredArray = updateComment
        }
        deleteComment()
        deleteFromFirebase()
        await updateDoc(docRef, { posts: filteredArray })
        await updateDoc(userRef, { comments: newArray })
        getUserInfo()
    }

    useEffect(() => {
        setUserInfo([])
        setComments([])
        setPosts([])
        getUserInfo()
    }, [location.pathname])

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
        console.log(userInfo) 
    }, [user])

if (userInfo[0] !== undefined && overview) {
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
                                f/{data.community}
                            </Link>
                            </div> 
                                * Posted by 
                        <div className="profile-post-poster">
                        <Link to={`../user/${data.author}`}>
                            u/{data.author}
                        </Link>
                        </div>
                    </div>
                    <div className="profile-post-bottom">
                            <div>
                                <div className="profile-post-poster-information">
                                       <div>
                                            <Link to={`../user/${data.username}`}>{data.username}</Link>
                                        </div> 
                                        {data.votes} points * # days ago
                                </div>
                                <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        <div className="profile-post-text">{parse(`${data.content.html}`)}</div>
                                </Link>
                                <ul>
                                    <li>Reply</li>
                                    <li>Share</li>
                                    <div className={ !matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                    <ul>
                                        <li>Report</li>
                                        <li>Save</li>
                                    </ul>
                                </div>
                                <div className={ isLoggedIn && matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                    <ul className={data.community}>
                                        <li>Save</li>
                                        <li className={data.id} id={data.commentid} 
                                        onClick={() => navigate(`../f/${data.community}/comments/${data.id}`, { state: data.commentid})}>
                                            Edit
                                        </li>
                                        <li className={data.id} id={data.commentid} onClick={handleDelete}>Delete</li>
                                    </ul>
                                </div>
                                </ul>

                            </div>
                    </div>
                </div>
            </div>
        )
    })
    )
} else if (userInfo[0] !== undefined && commentsOnly) {
    return (
        comments.map((data) => {
            return (
                <div className="post-width">
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
                                f/{data.community}
                            </Link>
                            </div> 
                                * Posted by 
                        <div className="profile-post-poster">
                        <Link to={`../user/${data.author}`}>
                            u/{data.author}
                        </Link>
                        </div>
                    </div>
                    <div className="profile-post-bottom">
                            <div>
                                <div className="profile-post-poster-information">
                                       <div>
                                            <Link to={`../user/${data.username}`}>{data.username}</Link>
                                        </div> 
                                        {data.votes} points * # days ago
                                </div>
                                <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        <div className="profile-post-text">{parse(`${data.content.html}`)}</div>
                                </Link>
                                <ul>
                                    <li>Reply</li>
                                    <li>Share</li>
                                    <div className={ !matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                    <ul>
                                        <li>Report</li>
                                        <li>Save</li>
                                    </ul>
                                </div>
                                    <div className={ isLoggedIn && matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                        <ul>
                                            <li>Save</li>
                                            <li className={data.id} id={data.commentid}>Edit</li>
                                            <li className={data.id} id={data.commentid} onClick={handleDelete}>Delete</li>
                                        </ul>
                                </div>
                                </ul>
                            </div>
                    </div>
                </div>
            </div>
        )
    })
    )
} else if (userInfo[0] !== undefined && postsOnly) {
    return (
        posts.map((data) => {
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
            </div>
        )
    })
    )
} else {
    return (
        <div className="post-width">
            <div className="post-width-empty">
                <div>hmm... u/{params.id} hasn't posted anything</div>
            </div>
        </div>
    )
}
}

export default ProfilePosts