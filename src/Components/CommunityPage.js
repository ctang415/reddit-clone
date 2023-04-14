import React, { useState } from "react";
import CommunityInformation from "./CommunityInformation";
import Post from "./Post";

const CommunityPage = ( { } ) => {
    const [ post, setPost] = useState(false)

    return (
  
        <div className="community-page">
            <div className="community-header-top">

            </div>
            <div className="community-header-bottom">
                <div className="community-header-info">
                    <div className="community-header-info-title">
                        <img></img>
                        <h1>f/name</h1>
                        <button>Join</button>
                        <button>Alert</button>
                    </div>
                    <div className="community-header-info-subtitle">
                        f/name
                    </div>
                </div>
            </div>
            <div className="community-body">
                <div className="community-body-left">
                    <div className={ post ? "community-post-true" : "community-post-false"}>
                        <img></img>
                        <input type="text"></input>
                        <button>IMG</button>
                        <button>LNK</button>
                    </div>
                    <div className="community-filters">
                        <ul>
                            <li>
                                Hot
                            </li>
                            <li>
                                New
                            </li>
                            <li>
                                Top
                            </li>
                            <li>
                                ...
                            </li>
                        </ul>
                    </div>
                    <Post/>
                </div>
                <div className="community-body-right">
                    <CommunityInformation/>
                </div>
            </div>
        </div>

    )

}

export default CommunityPage