import React, { useState } from "react";
import CommunityInformation from "./CommunityInformation";
import Post from "./Post";

const CommunityPage = () => {
    const [ post, setPost] = useState(false)

    return (
        <div className="community-page">
            <div className="community-header-top">

            </div>
            <div className="community-header-bottom">
                <div className="community-header-info">

                </div>
            </div>
            <div className="community-body">
                <div className="community-body-left">
                    <div className="community-post">
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