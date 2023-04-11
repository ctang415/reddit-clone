import React, { useEffect, useState } from "react";

const CommunitiesDrop = ( { communityDrop, setCommunityDrop, userData } ) => {
    const [ communities, setCommunities ] = useState(['one'])

    useEffect(() => {
        const communityList = []

    }, [])

    if (communityDrop) {
            return (
                <nav className="nav-drop-community">
                    <ul>
                    {communities.map(item => {
                        return (
                            <li key={item.name}>{item}</li>
                        )
                    })}
                    </ul>
                </nav>
            )
    }
}

export default CommunitiesDrop