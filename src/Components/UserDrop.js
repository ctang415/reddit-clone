import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";

const UserDrop = ( {drop, setDrop, setModalIsTrue} ) => {
    const [ userSettings, setUserSettings ] = useState(["My Stuff", "Online Status", "Profile", "Style Avatar", 
    "User Settings", "View Options", "Dark Mode", "Create a Community", "Advertise"])

    const auth = getAuth()

    const handleLogOut = (e) => {
        e.preventDefault()
        setDrop(!drop)
        setModalIsTrue(false)
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          })
    } 

    if (drop) {
            return (
                <nav className="nav-drop">
                    <ul>
                    {userSettings.map(item => {
                        return (
                            <li key={item}>{item}</li>
                        )
                    })}
                    <li onClick={handleLogOut}>Log Out</li>
                    </ul>
                </nav>
            )
    }
}

export default UserDrop