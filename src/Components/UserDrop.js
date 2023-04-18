import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config";

const UserDrop = ( {drop, setDrop, setModalIsTrue, setMyUser, userData, setCommunityModal, communityModal, } ) => {
    const [ userSettings, setUserSettings ] = useState([])

    const handleLogOut = (e) => {
        e.preventDefault()
        signOut(auth).then(() => {
            setDrop(false)
            setModalIsTrue(false)
            setMyUser([])
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          })
    }

    const handleCreateCommunity = () => {
        setCommunityModal(!communityModal) 
        setDrop(false) 
    }

    useEffect(() => {
        const data = 
        [
            {name: "Online Status", method: function handleOnline() { console.log('handleOnline')}}, 
            {name: "Profile", method: function handleProfile() { console.log('handleprofile')} }, 
            {name: "Dark Mode", method: function handleDarkMode() {console.log('handledarkmode')}}, 
            {name: "Create a Community", method: handleCreateCommunity },
            {name: "Log Out", method: handleLogOut }
        ]
        setUserSettings(data)
    }, [setUserSettings])

    if (drop) {
            return (
                <nav className="nav-drop">
                    <ul>
                    {userSettings.map(item => {
                        return (
                            <li key={item.name} onClick={item.method}>{item.name}</li>
                        )
                    })}
                    </ul>
                </nav>
            )
    }
}

export default UserDrop