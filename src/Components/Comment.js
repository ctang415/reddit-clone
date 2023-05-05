import React from "react";
import CommentIcon from "../Assets/comment.png"
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Avatar from "../Assets/avatar.png"
import { Link } from "react-router-dom";

const Comment = () => {
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
                    <Link to="">COMMENTER</Link>
                </div>
                <p>COMMENT TEXT</p>
                <ul>
                    <div className="comment-votes">
                        <img src={Up} alt="Up arrow"></img>
                            1
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
}

export default Comment