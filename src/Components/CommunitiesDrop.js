import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CommunitiesDrop = ( { communityDrop, setCommunityDrop, userData } ) => {
    const [ communities, setCommunities ] = useState(['one', 'two'])

    useEffect(() => {

    }, [] )

    if (communityDrop) {
            return (
                <nav className="nav-drop-community">
                    <div>YOUR COMMUNITIES</div>
                    <ul>
                    {communities.map(item => {
                        return (
                            <div key={item}>
                            <Link to={'f/'+ item} style={{ textDecoration: 'none', color: 'black'}}>
                                <li key={item}>
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