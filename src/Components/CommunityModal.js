import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

const CommunityModal = ( {communityModal, setCommunityModal}) => {
    const [ communityInformation, setCommunityInformation ] = useState({ name: "", posts: [], about: "" })
    const [ communityName, setCommunityName ] = useState("")
    const [ isChecked, setIsChecked ] = useState(false)
    const [ characters, setCharacters ] = useState(21)

    const handleChange = (e) => {
        e.preventDefault()
        setCommunityName(e.target.value)
    }
    
    const handleCharacters = (e) => {
        if (e.target.value.length < 22 && characters >= 0 ) {
            setCharacters( 21 - e.target.value.length )
        } 
    }

    const handleCheck = (e) => {
        setIsChecked(!isChecked)
    }

    const handleModal = (e) => {
        setCommunityModal(!communityModal)
        setCharacters(21)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setCommunityModal(!communityModal)
    }

    if (communityModal) {
        return (
            <div className="modal-community">
                <div>
                <form className="modal-text-community" onSubmit={handleSubmit}>
                <div>
                    <div className="modal-close-community-div">
                        <div className="community-header">
                            <span>Create a community</span>
                        </div>
                        <div id="modal-close-button">
                            <span onClick={handleModal}>X</span>
                        </div>
                    </div>
                        <span className="modal-divider-text-community"></span>
                    </div>
                        <div className="community-name">
                            <div className="community-header-name">
                                <span>Name</span>
                            </div>
                            <p>Community names including capitalization cannot be changed, must be between 3-21 characters, and can only contain letters, numbers, or underscores.</p>
                            <div class="input-container">
                            <span class="fix-text">f/</span>
                            <input type="text" className="my-input" maxLength="21" onInput={handleCharacters} onChange={handleChange} pattern="[a-zA-Z0-9]" required></input>
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
                     
                                <button className="community-cancel-button" onClick={handleModal}>
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