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
import { Link, useParams } from "react-router-dom";

const Post = ( {firebaseCommunityData, setFirebaseCommunityData, createNewPost, isLoggedIn, communityData }) => {
    const [ post, setPost ] = useState([])
    const [ sanitizedPost, setSanitizedPost] = useState([])
    const [ allPosts, setAllPosts ] = useState([])
    const params = useParams()

    useEffect(() => {
        firebaseCommunityData.map((data) => {
            data.posts.map(post => setPost(prev => [...prev, post])) 
        }) 
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
        if(params.id === undefined) {
            communityData.forEach(element => {
                setAllPosts( allPosts => [...allPosts, element.posts])
            });  
        } 
        console.log(allPosts)
    }, [])
    */

    if (post.length === 0 && isLoggedIn ) {
        return (
            <div className="empty-post-logged-in">
                <div className="empty-post-discover">
                    <img src={Discover} alt="Snoo avatar looking through telescope"/>
                    <p>Freddit gets better when you join communities, so find some that you'll love!</p>
                    <button className="empty-post-discover-add">BROWSE POPULAR COMMUNITIES</button>
                </div>
            </div>
        )
    } else if (post.length === 0 && !isLoggedIn && params.id === undefined) {
        return (
            <div className="empty-post">
                <div>
                    <h4>There are no posts available</h4>
                    <p>Be the first to till this fertile land.</p>
                    <button className="empty-post-add" onClick={createNewPost}> Add a post </button>
                </div>
            </div>
        )
    } else if (post.length === 0 && !isLoggedIn) {
        return (
            <div className="empty-post">
                <div>
                    <h4>There are no posts in this subfreddit</h4>
                    <p>Be the first to till this fertile land.</p>
                    <button className="empty-post-add" onClick={createNewPost}> Add a post </button>
                </div>
            </div>
        )
    } else {
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
                    <p className="post-pinned-author">posted by u/{post.author}</p>
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