import React, { useState } from "react";

const CommunityModal = ( {communityModal, setCommunityModal}) => {
    const [ communityName, setCommunityName ] = useState("")
    const [ isChecked, setIsChecked ] = useState(false)
    const [ characters, setCharacters ] = useState(21)

    const handleChange = (e) => {
        e.preventDefault()
        setCommunityName(e.target.value)
    }

    const handleCheck = (e) => {
        setIsChecked(!isChecked)
    }

    if (communityModal) {
        return (
            <div className="modal-community">
                <div>
                <form className="modal-text-community">
                <div>
                    <div className="modal-close-community-div">
                        <div className="community-header">
                            <span>Create a community</span>
                        </div>
                        <div id="modal-close-button">
                            <span>X</span>
                        </div>
                    </div>
                        <span className="modal-divider-text-community"></span>
                    </div>
                        <div className="community-name">
                            <div className="community-header">
                                <span>Name</span>
                            </div>
                            <p>Community names including capitalization cannot be changed.</p>
                            <div class="input-container">
                            <span class="fix-text">r/</span>
                            <input type="text" className="my-input" maxLength="21" onChange={handleChange} required></input>
                            </div>
                            <p>{characters} Characters remaining</p>
                        </div>
                        <div className="community-type">
                            <div className="community-header-radio">
                                <span>Community type</span>
                             <div className="radios">
                                <input type="radio" name="communityType" id="public" value="public" checked></input>
                                <label for="public">Public</label>
                                <span>Anyone can view, post, and comment to this community</span>
                            </div>
                            <div className="radios">
                                <input type="radio" name="communityType" id="restricted" value="restricted"></input>
                                <label for="restricted">Restricted</label>
                                <span>Anyone can view this community, but only approved users can post</span>
                                </div>
                                <div className="radios">
                                <input type="radio" name="communityType" id="private" value="private"></input>
                                <label for="private">Private</label>
                                <span>Only approved users can view and submit to this community</span>
                                </div>
                            </div>
                        </div>
                        <div className="community-filter">
                            <div className="community-header">
                                <span>Adult content</span>
                            </div>
                            <div className="checkbox">
                            <input type="checkbox" onChange={handleCheck}></input>
                            <span id="nsfw">NSFW</span> <span id="adult">18+ year old community</span>
                            </div>
                        </div>
                        <div className="community-buttons">
                     
                                <button className="community-cancel-button">
                                    Cancel
                                </button>
                                <button type="submit" className="community-create-button">
                                    Create Community
                                </button>
                      
                        </div>
                        </form>
                </div>
            </div>
        )
    }
}

export default CommunityModal