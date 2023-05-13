import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CommunityIcon from "../Assets/communityicon.png"

const Searchbar = ( {communityData} ) => {
    const [searchInput, setSearchInput] = useState("");
    const [ filtered, setFiltered ] = useState([])
    const [ drop, setDrop] = useState(false)
    const catMenu = useRef(null)

    const handleClick = (e) => {
        setDrop(true)
    }

    const handleDrop = (e) => {
        if (catMenu.current && drop && !catMenu.current.contains(e.target)){
            setDrop(false)
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
      if (searchInput.length > 0) {
          communityData.filter((community) => {
          return community.name.match(searchInput)
      })
      }

    }

    useEffect(() => {
        document.addEventListener('mousedown', handleDrop)
    }, [handleDrop])

    return (
        <div className="search-bar-drop">
            <input
             id="nav-bar-input"
                type="text"
                placeholder="Search Freddit"
                onChange={handleChange}
                value={searchInput} 
                onClick={handleClick}
                />
            <div className={ drop ? "input-search-box": "input-empty"} ref={catMenu}>
                <div>Communities</div>
                {communityData.map((community) => {
                    return (
                        <div className="search-bar-items">
                            <Link to={`f/${community.name}`} style={{ textDecoration: 'none', color: 'black'}}>
                                <img src={CommunityIcon} alt="Community icon"></img>
                                f/{community.name}
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
      )
    }

export default Searchbar