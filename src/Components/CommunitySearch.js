import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import CommunityIcon from "../Assets/communityicon.png"

const CommunitySearch = ( { communityData, isMobile } ) => {
    const [ searchInput, setSearchInput ] = useState("");
    const [ filtered, setFiltered ] = useState([])
    const [ drop, setDrop] = useState(false)
    const catMenu = useRef(null)
    const [ data, setData ] = useState([])
    const [ asUndefined, setAsUndefined ] = useState(false)
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

    useEffect(() => {
        if (params.id !== undefined) {
            setAsUndefined(false)
        } else {
            setAsUndefined(true)
        }
        console.log(params.id)
        console.log(asUndefined)
    }, [location.pathname])

    return (
        <div className="search-bar-drop-post">
            <input
             id="nav-bar-input-post" style={ isMobile ? {border: "white"} : {}}
                type="text"
                placeholder={ !asUndefined ? `f/${params.id}` : "Search communities"}
                onChange={handleChange}
                onClick={handleClick}
                />
            <div className={ drop ? "input-search-box-post": "input-empty"} ref={catMenu}
            style={ isMobile ? {width: "100vw", border: "0.5px solid rgb(204, 202, 202)"} : {}}>
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