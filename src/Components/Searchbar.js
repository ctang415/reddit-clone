import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CommunityIcon from "../Assets/communityicon.png"

const Searchbar = ( {communityData} ) => {
    const [searchInput, setSearchInput] = useState("");
    const [ filtered, setFiltered ] = useState([])
    const [ drop, setDrop] = useState(false)
    const catMenu = useRef(null)

    const communities = ['league of legends', 'apex legends', 'frugalmalefashion', 'funny', 'happy', 'sad', 'bunnies',
    'caterpillar', 'dogs', 'elephants', 'google', 'idaho', 'japan', 'korea', 'monkey', 'newzealand', 'ohio', 'pokemon',
    'queen', 'rabbit', 'stupid', 'television', 'ugly', 'virginia', 'water', 'xylophone', 'zebra'
    ]
    const [ data, setData ] = useState([])

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
          setFiltered(data.filter((community) => { 
            return community.includes(searchInput)
      }))
      }
console.log(data)
    }

    useEffect(() => {
        setData(communityData.map(community => {
            return community.name
        }))
    }, [communityData])

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
                onClick={handleClick}
                />
            <div className={ drop ? "input-search-box": "input-empty"} ref={catMenu}>
                <div>Communities</div>
                {filtered.map((community) => {
                    return (
                        <div className="search-bar-items">
                            <Link to={`f/${community}`} style={{ textDecoration: 'none', color: 'black'}}>
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