import { Switch } from "@mui/material";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

const UserDrop = ( {drop, setDrop, setModalIsTrue, setMyUser, userData, setCommunityModal, communityModal, setLoggedIn } ) => {
    const [ userSettings, setUserSettings ] = useState([])
    const navigate = useNavigate()
    const user = auth.currentUser

    const handleLogOut = (e) => {
        e.preventDefault()
        signOut(auth).then(() => {
            setDrop(false)
            setModalIsTrue(false)
            setLoggedIn(false)
            setMyUser([])
            window.scrollTo({ top:0, behavior:'auto'})
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          })
    }

    const handleCreateCommunity = () => {
        setCommunityModal(!communityModal) 
        setDrop(false) 
    }

    const handleCheck = (e) => {
        const newData = userSettings.map(setting => {
            if (setting.name === e.currentTarget.id) {
                setting.checked = !setting.checked
                return setting
            }
            return setting
        })
        setUserSettings(newData)
    }

    const handleProfile = () => {
        navigate(`users/${user.displayName}`)
    }

    useEffect(() => {
        const data = 
        [
            {name: "Online Status", switch: true, checked: true }, 
            {name: "Profile", switch: false, method: handleProfile }, 
            {name: "Dark Mode", switch: true, checked: false }, 
            {name: "Create a Community", switch: false, method: handleCreateCommunity },
            {name: "Log Out", switch: false, method: handleLogOut }
        ]
        setUserSettings(data)
    }, [setUserSettings])

    if (drop) {
            return (
                <nav className="nav-drop">
                    <ul>
                    {userSettings.map(item => {
                        return (
                            <li key={item.name} onClick={item.method}>{item.name}
                            <div id={item.name} className={ item.switch ? "user-left" : "input-empty"}>
                            <Switch 
                            id={item.name}
                            checked={item.checked}
                            onChange={handleCheck} 
                            />
                            </div>
                            </li>
                            
                        )
                    })}
                    </ul>
                </nav>
            )
    }
}

export default UserDrop