import React from "react";
import { Link } from "react-router-dom";
import CommunityIcon from "../Assets/communityicon.png"

const CommunitiesDrop = ( { communityDrop, setCommunityDrop, userData, handleMobileCommunityClick, handleCommunityClick, isMobile, setClick } ) => {

    if (communityDrop) {
        return (
            <nav className="nav-drop-community">
                <div>YOUR COMMUNITIES</div>
                <ul>
                    {userData[0].joined.map(item => {
                        return (
                            <div className={item} key={item} onClick={ isMobile ? null : handleCommunityClick }>
                                <Link to={ isMobile ? null : 'f/'+ item} style={{ textDecoration: 'none', color: 'black'}}>
                                    <li className="header-item" key={item}>
                                    <Link to={ isMobile ? 'f/'+ item : null} onClick={() => setClick(false)} style={ isMobile ? { textDecoration: 'none', color: 'white', gap: "0.5em", display: "flex", flexDirection: "row", alignSelf: "center"} : { textDecoration: 'none', color: 'black'}}>
                                        <img style={ isMobile ? {height: "2vh" } : {} } src={CommunityIcon} alt="Community icon" />
                                        f/{item}
                                        </Link>
                                    </li>
                                </Link>
                            </div>
                        )
                    })}
                </ul>
            </nav>
        )
    }
}

export default CommunitiesDrop