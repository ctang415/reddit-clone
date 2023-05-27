import React from "react";
import { Link } from "react-router-dom";

const CommunitiesDrop = ( { communityDrop, setCommunityDrop, userData, handleCommunityClick } ) => {

    if (communityDrop) {
        return (
            <nav className="nav-drop-community">
                <div>YOUR COMMUNITIES</div>
                <ul>
                    {userData[0].joined.map(item => {
                        return (
                            <div className={item} key={item} onClick={handleCommunityClick}>
                                <Link to={'f/'+ item} style={{ textDecoration: 'none', color: 'black'}}>
                                    <li className="header-item" key={item}>
                                        {item}
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