import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import CommunityIcon from "../Assets/communityicon.png"

const Searchbar = ( { communityData, setClick, isMobile, click } ) => {
    const [ searchInput, setSearchInput ] = useState("");
    const [ filtered, setFiltered ] = useState([])
    const [ drop, setDrop] = useState(false)
    const catMenu = useRef(null)
    const [ data, setData ] = useState([])
    const location = useLocation()
    const params = useParams()

    const handleClick = (e) => {
        setDrop(!drop)
    }

    const handleMobileClick = () => {
        setClick(!click)
        setDrop(!drop)
    }

    const handleDrop = (e) => {
        if (catMenu.current && drop && !catMenu.current.contains(e.target)){
            setDrop(false)
            setFiltered([])
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
      if (searchInput.length > 0) {
          setFiltered(data.filter((community) => { 
            let lowercase = community.toLowerCase()
                if (lowercase.includes(searchInput.toLowerCase())) {
                    return lowercase.includes(searchInput)
                } 
      }))
      }
      console.log(data)
    }

    useEffect(() => {
        if (communityData) {
            setData(communityData.map(community => {
                return community.name
            }))
        }
    }, [communityData])

    useEffect(() => {
        document.addEventListener('mousedown', handleDrop)
    }, [handleDrop])

    return (
        <div className="nav-bar-search-bar">
            <input
             id="nav-bar-input"
                type="text"
                placeholder="Search Freddit"
                onChange={handleChange}
                onClick={handleClick}
                />
            <div className={ drop ? "input-search-box": "input-empty"} ref={catMenu}>
                <div>Communities</div>
                {filtered.map((community) => {
                    return (
                        <div className="search-bar-items" onClick={ isMobile ? handleMobileClick : handleClick}>
                            <Link to={`f/${community}`} style={{ textDecoration: 'none', color: 'black'}} >
                                <img src={CommunityIcon} alt="Community icon"></img>
                                f/{community}
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
      )
    }

export default Searchbar