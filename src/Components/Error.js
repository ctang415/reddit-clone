import React from "react";
import ErrorPic from '../Assets/404.png'

const Error = () => {
    return (
        <div className="community-error-page">
            <img id="error-image" src={ErrorPic} alt="Error"></img>
            <h4>page not found</h4>
            <p>the page you requested does not exist.</p>
        </div>
    )
}

export default Error