import React from "react";
import { Link } from "react-router-dom";
import UserErr from "../Assets/usererror.png"

const UserError = () => {
    return (
        <div className="user-error-page">
            <img src={UserErr} alt="Error icon"/>
            <h4>Sorry, nobody on Freddit goes by that name</h4>
            <p>The person may have been banned or the username is incorrect.</p>
            <Link to="../">
                <button className="empty-post-discover-add"> GO HOME</button>
            </Link>
        </div>
    )
}

export default UserError