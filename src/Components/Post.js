import React, { useEffect, useRef, useState } from "react";
import parse from 'html-react-parser';
import * as sanitizeHtml from 'sanitize-html';
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Comment from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"
import Discover from "../Assets/discover.png"
import { auth, db } from "../firebase-config";
import { Link, useLocation, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const Post = ( {firebaseCommunityData, setFirebaseCommunityData, createNewPost, isLoggedIn, communityData, allJoinedPosts, 
    isEmpty, setAllJoinedPosts, setIsEmpty, joinedList, setJoinedList }) => {
    const [ post, setPost ] = useState([])
    const [ sanitizedPost, setSanitizedPost] = useState([])
    const [ allPosts, setAllPosts] = useState([])
    const params = useParams()
    const user = auth.currentUser
    const location = useLocation()

    const getJoinedPosts = async () => {
        const docRef = doc(db, "users", user.displayName)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        let joinedArray = [data.joined]
        joinedArray.map( async item => {
            const docRef = doc(db, 'communities', item.toString() )
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            setAllJoinedPosts(prev => [...prev, data.posts ])
            setIsEmpty(false)
        }) 
    }

    useEffect(() => {
        if (location.pathname.indexOf('/f/' === 0)) {
            firebaseCommunityData.map((data) => {
                data.posts.map(post => setPost(prev => [...prev, post])) 
            })
        }
    }, [])

    useEffect(() => {
        if (location.pathname === "/" && !isLoggedIn) {
            communityData.map((data) => {
                data.posts.map(post => setAllPosts(prev => [...prev, post])) 
            })
        }
    }, [communityData]) 

    useEffect( () => {
        if (location.pathname === "/" && isLoggedIn ) {
                getJoinedPosts()
        } 
    }, [user])


    /*
    useEffect(() => {
        if (post.length !== 0) {
            post.map((item) => {
            let newHtml = sanitizeHtml(item.content.html, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]), 
                allowedAttributes: {'img': ['src']},
                allowedSchemes: [ 'data', 'http', 'https']
            })
            setSanitizedPost(prev => [...prev, { html: newHtml } ])
        })
        console.log(sanitizedPost)  
        }
    }, [post])
*/
if (location.pathname === '/' && isLoggedIn && allJoinedPosts.length === 0 ) {
    return (
      <div className="empty-post-logged-in">
            <div className="empty-post-discover">
                <img src={Discover} alt="Snoo avatar looking through telescope"/>
                <p>Freddit gets better when you join communities, so find some that you'll love!</p>
                <button className="empty-post-discover-add">BROWSE POPULAR COMMUNITIES</button>
            </div>
        </div>
    )
} else if (location.pathname === '/' && isLoggedIn ) {
    return (
        allJoinedPosts.map((x) => {
            return (
                x.map((post) => {
                    return (
                    <div className="post" key={post.id}>
                    <div className="post-left">
                        <div className="post-votes">
                            <img src={Up} alt="Up arrow"></img>
                                {post.votes}
                            <img src={Down} alt="Down arrow"></img>
                        </div>
                    </div>
                    <div className="post-right">
                        <div className="post-pinned-author">
                        <div className="post-all-community">
                                        <Link to={`f/${post.community}`}>
                                            f/{`${post.community}`} 
                                        </Link>
                                    </div>
                                    *
                            Posted by 
                            u/<Link to={`/user/${post.author}`}>{post.author}</Link>
                        </div>
                        <h3>
                            <Link to={`/f/${post.community}/comments/${post.id}`}>{post.title}</Link>
                        </h3> 
                        <div className="post-media-true">
                        <Link to={`/f/${post.community}/comments/${post.id}`}>
                         {parse(post.content.html)}
                         </Link>
                        </div>
                        <ul>
                        <li>
                        <Link to={`f/${post.community}/comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> {post.comments.length} Comments </Link></li>
                            <li><img src={Share} alt="Share button" /> Share</li>
                            <li><img src={Save} alt="Save button" /> Save</li>
                            <li>...</li>
                        </ul>
                    </div>
                </div>
                )
            })
            )
        })
    ) 
    } else if (location.pathname === '/' && !isLoggedIn && allPosts.length === 0) {
        return (
            <div className="empty-post">
                <div>
                    <h4>There are no posts available</h4>
                    <p>Be the first to till this fertile land.</p>
                    <button className="empty-post-add" onClick={createNewPost}> Add a post </button>
                </div>
            </div>
        )
    } else if (location.pathname === '/' && !isLoggedIn && allPosts.length !== 0) {
        return (
            allPosts.map((post) => {
                return ( 
                    <div className="post" key={post.id}>
                        <div className="post-left">
                            <div className="post-votes">
                                <img src={Up} alt="Up arrow"></img>
                                    {post.votes}
                                <img src={Down} alt="Down arrow"></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <div className="post-pinned-author">
                                    <div className="post-all-community">
                                        <Link to={`f/${post.community}`}>
                                            f/{`${post.community}`} 
                                        </Link>
                                    </div>
                                    *
                                    Posted by <Link to={`user/${post.author}`} > <div className="post-all-author">u/{post.author}</div></Link>
                                </div>
                            <h3>
                                <Link to={`f/${post.community}/comments/${post.id}`}>
                                    {post.title}
                                </Link>
                            </h3>
                            <div className="post-media-true">
                                <Link to={`f/${post.community}/comments/${post.id}`}>
                                    {parse(post.content.html)}
                                </Link>
                                <div className="post-show-more">
                                    <Link to=''>Show more</Link>
                                </div>
                            </div>
                            <ul>
                                <li>
                            <Link to={`f/${post.community}/comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> {post.comments.length} Comments </Link></li>
                                <li><img src={Share} alt="Share button" /> Share</li>
                                <li><img src={Save} alt="Save button" /> Save</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                )
            })
        )
    } else if (location.pathname.indexOf('/f/') === 0 && post.length === 0 ) {
        return (
            <div className="empty-post">
                <div>
                    <h4>There are no posts in this subfreddit</h4>
                    <p>Be the first to till this fertile land.</p>
                    <button className="empty-post-add" onClick={ isLoggedIn ? createNewPost : null}> Add a post </button>
                </div>
            </div>
        )
    }   else if (location.pathname.indexOf('/f/') === 0 && post.length !== 0 ) {
            return (
                post.map((post) => {
                    return ( 
                            <div className="post" key={post.id}>
                            <div className="post-left">
                                <div className="post-votes">
                                    <img src={Up} alt="Up arrow"></img>
                                        {post.votes}
                                    <img src={Down} alt="Down arrow"></img>
                                </div>
                            </div>
                            <div className="post-right">    
                                <p className="post-pinned-author">Posted by <Link to={`../user/${post.author}`}>u/{post.author}</Link></p>
                                <Link to={`./comments/${post.id}`}>
                                <h3>
                                    {post.title}
                                </h3>
                                </Link>
                                <Link to={`${post.community}/comments/${post.id}`}> 
                                <div className="post-media-true">
                                    {parse(post.content.html)}
                                </div>
                                </Link>
                                <ul>
                                <li>
                                <Link to={`./comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> {post.comments.length} Comments </Link></li>
                                    <li><img src={Share} alt="Share button" /> Share</li>
                                    <li><img src={Save} alt="Save button" /> Save</li>
                                    <li>...</li>
                                </ul>
                            </div>
                   
                        </div>
                    )
                })
            )
    }
}

export default Post