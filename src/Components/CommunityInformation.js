import React, { useState } from "react";

const CommunityInformation = () => {
    const [ rules, setRules ] = useState(false)
    const [ dropBox, setDropBox ] = useState(false)

    const handleDrop = () => {
        setDropBox(!dropBox)
    }

    return (
        <div className="community-info-bar">
            <div className="community-info">
                <div className="community-info-top">
                    <h5>About Community</h5>
                    <h5 id="community-dots">...</h5>
                </div>
                <div className="community-info-text">
                    <p>Text about section</p>
                    <p>Created date</p>
                </div>
            </div>
            <div className={ rules ? "community-rules": "community-rules-false"}>
                <h5>Rules</h5>
                <ol>
                    <li onClick={handleDrop}>
                        <div>
                        Hi
                        <p>⌄</p>
                        </div>
                    </li>
                    <div className={ dropBox ? "dropbox-true" : "dropbox-false"}>More text</div>
                    <span className="community-divider-text"></span>
                </ol>
            </div>
            <div className="community-mod">
                <h5>Moderators</h5>
            </div>
        </div>
    )
}

export default CommunityInformation