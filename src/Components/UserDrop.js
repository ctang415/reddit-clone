import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import CommunityModal from "./CommunityModal";

const UserDrop = ( {drop, setDrop, setModalIsTrue, setMyUser} ) => {
    const [ communityModal, setCommunityModal ] = useState(false)
    const [ userSettings, setUserSettings ] = useState([])

    const handleLogOut = (e) => {
        e.preventDefault()
        setDrop(false)
        setModalIsTrue(false)
        setMyUser([])
        signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          })
    } 

    useEffect(() => {
        const data = 
        [
            {name: "Online Status", method: function handleOnline() { console.log('handleOnline')}}, 
            {name: "Profile", method: function handleProfile() { console.log('handleprofile')} }, 
            {name: "Dark Mode", method: function handleDarkMode() {console.log('handledarkmode')}}, 
            {name: "Create a Community", method: function handleCreateCommunity() {console.log('createcommunity')}},
            {name: "Log Out", method: handleLogOut }
        ]
        setUserSettings(data)
    }, [])

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