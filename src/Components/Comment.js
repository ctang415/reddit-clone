import React from "react";
import CommentIcon from "../Assets/comment.png"
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Avatar from "../Assets/avatar.png"
import { Link } from "react-router-dom";
import * as sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';

const Comment = ( {detail} ) => {

    return (
        detail.map( data => {
            return (
                data.comments.map( comment => {
                    return (
        <div className="comment">
            <div className="comment-left">
                <Link to="">
                    <img src={Avatar} alt="Avatar" />
                </Link>
                <hr className="vertical"></hr>
            </div>
            <div className="comment-right">
                <div className="comment-left-username">
                    <Link to="">{comment.username}</Link>
                </div>
                <p>{parse(comment.content.html)}</p>
                <ul>
                    <div className="comment-votes">
                        <img src={Up} alt="Up arrow"></img>
                            {comment.votes}
                        <img src={Down} alt="Down arrow"></img>
                    </div>
                    <li>
                        <div>
                            <img src={CommentIcon} alt="Comment bubble"/> 
                                Reply
                            </div>
                    </li>
                    <li>
                        <div>
                            Share
                        </div>
                    </li>
                    <li>
                        <div>
                            ...
                        </div>
                    </li>
                </ul>
            </div>
        </div>
                )
            })
            )
        })
    )
}

export default Comment