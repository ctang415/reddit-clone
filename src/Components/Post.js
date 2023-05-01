import React, { useEffect, useState } from "react";
import parse from 'html-react-parser';
import * as sanitizeHtml from 'sanitize-html';
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Comment from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"
import { auth } from "../firebase-config";
import { Link } from "react-router-dom";

const Post = ( {firebaseCommunityData, setFirebaseCommunityData }) => {
    const [ post, setPost ] = useState([])
    const [ sanitizedPost, setSanitizedPost] = useState([])

    useEffect(() => {
        firebaseCommunityData.map((data) => {
            data.posts.map(post => setPost(prev => [...prev, post])) 
        }) 
    }, [])

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

export default Post