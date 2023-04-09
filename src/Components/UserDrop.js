import React, { useState } from "react";

const UserDrop = ( {drop} ) => {

    const [ userSettings, setUserSettings ] = useState(["My Stuff", "Online Status", "Profile", "Style Avatar", "User Settings", "View Options", 
                    "Dark Mode", "Create a Community", "Advertise", "Log Out"])

    if (drop) {
            return (
                <nav className="nav-drop">
                    <ul>
                    {userSettings.map(item => {
                        return (
                            <li>{item}</li>
                        )
                    })}
                    </ul>
                </nav>
            )
    }
}

export default UserDrop