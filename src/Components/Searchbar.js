import React, { useEffect, useState } from "react";
import { ReactDOM } from "react";

const Searchbar = ( {communityData} ) => {
    const [searchInput, setSearchInput] = useState("");
    const [ filtered, setFiltered ] = useState([])
    const [ drop, setDrop] = useState(false)

    const handleDrop = (e) => {
        if (drop) {
            setDrop(!drop)
        } else {
            setDrop(!drop)
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
      if (searchInput.length > 0) {
          communityData.filter((community) => {
          return setFiltered([community.name.match(searchInput)])
      });
      }
      console.log(filtered)
    }

    return (
        <div className="search-bar-drop">
            <input
             id="nav-bar-input"
                type="text"
                placeholder="Search Freddit"
                onChange={handleChange}
                value={searchInput} 
                onClick={handleDrop}
                />
            <table className={ drop ? "input-search-box": "input-empty"}>
                {filtered.map((community) => {
                    return (
                        <div>
                            <tr>
                                <td>{community}</td>
                            </tr>
                        </div>
                    )
                })}
            </table>
        </div>
      )
    }

export default Searchbar