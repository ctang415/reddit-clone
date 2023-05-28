import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import CommunityIcon from "../Assets/communityicon.png"

const CommunitySearch = ( { communityData } ) => {
    const [ searchInput, setSearchInput ] = useState("");
    const [ filtered, setFiltered ] = useState([])
    const [ drop, setDrop] = useState(false)
    const catMenu = useRef(null)
    const [ data, setData ] = useState([])
    const [ undefined, setUndefined ] = useState(false)
    const params = useParams()
    const location = useLocation()

    const handleClick = (e) => {
        setDrop(!drop)
    }

    const handleDrop = (e) => {
        if (catMenu.current && drop && !catMenu.current.contains(e.target)) {
            setDrop(false)
            setFiltered([])
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
      if (searchInput.length > 0) {
          setFiltered(data.filter((community) => { 
            return community.includes(searchInput)
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
        console.log(communityData)
    }, [communityData])

    useEffect(() => {
        document.addEventListener('mousedown', handleDrop)
    }, [handleDrop])

    useEffect(() => {
        if (params.id === undefined) {
            setUndefined(true)
        } else {
            setUndefined(false)
        }
    }, [location.pathname])

    return (
        <div className="search-bar-drop-post">
            <input
             id="nav-bar-input-post"
                type="text"
                placeholder="Search communities"
                defaultValue={ undefined ? `f/${params.id}` : 'Choose a community'}
                onChange={handleChange}
                onClick={handleClick}
                />
            <div className={ drop ? "input-search-box-post": "input-empty"} ref={catMenu}>
                <div className="input-search-box-header">COMMUNITIES</div>
                {filtered.map((community) => {
                    return (
                        <div className="search-bar-items">
                            <Link to={`../f/${community}/submit`} style={{ textDecoration: 'none', color: 'black'}} onClick={handleClick}>
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

export default CommunitySearch