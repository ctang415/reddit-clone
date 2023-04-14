import React, { useState } from "react";

const Post = () => {
    const [ media, setMedia ] = useState(false)
    const [ pinned, setPinned ] =useState(false)

        return (
            <div className="post">
                <div className="post-left">
                    <div className="post-votes">
                        Votes
                    </div>
                </div>
                <div className="post-right">
                    <p className={ pinned ? "post-pinned-false" : "post-pinned-true"}>PINNED BY MODERATORS</p>
                    <p className="post-pinned-author">posted by</p>
                    <h3>
                        Post Title
                    </h3>
                    <img className="post-image">
                    </img>
                    <p className={ media ? "post-media-false" : "post-media-true"} >
                        Post Text
                    </p>
                    <ul>
                        <li>Comments</li>
                        <li>Award</li>
                        <li>Share</li>
                        <li>Save</li>
                        <li>...</li>
                    </ul>
                </div>
            </div>
        )

}

export default Post