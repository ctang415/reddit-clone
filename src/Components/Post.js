import React, { useEffect, useState } from "react";
import parse from 'html-react-parser';
import * as sanitizeHtml from 'sanitize-html';
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Comment from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"
import Discover from "../Assets/discover.png"
import { auth } from "../firebase-config";
import { Link, useLocation, useParams } from "react-router-dom";

const Post = ( {firebaseCommunityData, setFirebaseCommunityData, createNewPost, isLoggedIn, communityData, profileData }) => {
    const [ post, setPost ] = useState([])
    const [ sanitizedPost, setSanitizedPost] = useState([])
    const [ allPosts, setAllPosts ] = useState([])
    const [ userInfo, setUserInfo ] = useState([])
    const [ userPosts, setUserPosts ] = useState([])
    const [ isEmpty, setIsEmpty ] = useState(false)
    const params = useParams()
    const user = auth.currentUser
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.indexOf('/f/' === 0)) {
            firebaseCommunityData.map((data) => {
                data.posts.map(post => setPost(prev => [...prev, post])) 
            })
        }
    }, [])


    useEffect(() => {
        if (location.pathname === "/" && !isLoggedIn) {
            // HOME PAGE POSTS 
            console.log(communityData)
        } else {
            // JOINED COMMUNITIES POSTS
        }
    }, [])


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
    /*
    useEffect(() => {
        if(location.pathname === '/' ) {
            communityData.forEach(element => {
                setAllPosts( allPosts => [...allPosts, element.posts])
            });  
        } 
        console.log(allPosts)
    }, [])
    */


    if (location.pathname === '/' && !isLoggedIn && allPosts.length === 0) {
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
                    <div className="post">
                        <div className="post-left">
                            <div className="post-votes">
                                <img src={Up} alt="Up arrow"></img>
                                    {post.votes}
                                <img src={Down} alt="Down arrow"></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <p className="post-pinned-author">Posted by u/{post.author}</p>
                            <h3>
                                {post.title}
                            </h3>
                            <div className="post-media-true">
                                {parse(post.content.html)}
                            </div>
                            <ul>
                                <li><img src={Comment} alt="Comment bubble"/> Comments</li>
                                <li><img src={Share} alt="Share button" /> Share</li>
                                <li><img src={Save} alt="Save button" /> Save</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                )
            })
        )
    } else if (location.pathname === '/' && isLoggedIn && userPosts.length === 0) {
        return (
          <div className="empty-post-logged-in">
                <div className="empty-post-discover">
                    <img src={Discover} alt="Snoo avatar looking through telescope"/>
                    <p>Freddit gets better when you join communities, so find some that you'll love!</p>
                    <button className="empty-post-discover-add">BROWSE POPULAR COMMUNITIES</button>
                </div>
            </div>
        )
    } else if (location.pathname === '/' && isLoggedIn && userPosts.length !== 0) {
        return (
            userPosts.map((post) => {
                return ( 
                    <div className="post">
                        <div className="post-left">
                            <div className="post-votes">
                                <img src={Up} alt="Up arrow"></img>
                                    {post.votes}
                                <img src={Down} alt="Down arrow"></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <p className="post-pinned-author">Posted by u/{post.author}</p>
                            <h3>
                                {post.title}
                            </h3>
                            <div className="post-media-true">
                                {parse(post.content.html)}
                            </div>
                            <ul>
                                <li><img src={Comment} alt="Comment bubble"/> Comments</li>
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
                    <button className="empty-post-add" onClick={createNewPost}> Add a post </button>
                </div>
            </div>
        )
    }   else if (location.pathname.indexOf('/f/') === 0 && post.length !== 0 ) {
            return (
                post.map((post) => {
                    return ( 
                            <div className="post">
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
                                <Link to={`./comments/${post.id}`}>
                                <div className="post-media-true">
                                    {parse(post.content.html)}
                                </div>
                                </Link>
                                <ul>
                                <li>
                                <Link to={`./comments/${post.id}`}><img src={Comment} alt="Comment bubble"/> Comments </Link></li>
                                    <li><img src={Share} alt="Share button" /> Share</li>
                                    <li><img src={Save} alt="Save button" /> Save</li>
                                    <li>...</li>
                                </ul>
                            </div>
                   
                        </div>
                    )
                })
            )
    } else if (location.pathname.indexOf('/user/') === 0 && userPosts.length !== 0) {
        return (
            userPosts.map((post) => {
                return ( 
            <div className="post">
                <div className="post-left">
                    <div className="post-votes">
                        <img src={Up} alt="Up arrow"></img>
                        {post.votes}
                        <img src={Down} alt="Down arrow"></img>
                    </div>
                </div>
                <div className="post-right">
                    <p className="post-pinned-author">Posted by u/{post.author}</p>
                    <h3>
                        {post.title}
                    </h3>
                    <div className="post-media-true">
                        {parse(post.content.html)}
                    </div>
                    <ul>
                        <li><img src={Comment} alt="Comment bubble"/> Comments</li>
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