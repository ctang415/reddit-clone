import { doc, setDoc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, or, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CommunityModal = ( {communityModal, setCommunityModal, userData, setCommunityData, communityData}) => {
    const [ communityName, setCommunityName ] = useState("")
    const [ radioValue, setRadioValue ] = useState('public')
    const [ isChecked, setIsChecked ] = useState(false)
    const [ characters, setCharacters ] = useState(21) 
    const [ charactersZero, setCharactersZero ] = useState(false)
    const [ communityExists, setCommunityExists ] = useState(false)
    const navigate = useNavigate();


    const handleChange = (e) => {
        e.preventDefault()
        setCommunityName(e.target.value)
    }
    
    const handleCharacters = (e) => {
        if (e.target.value.length < 22 && characters >= 0 ) {
            setCharacters( 21 - e.target.value.length )
        } 
    }

    const handleRadio = (e) => {
        setRadioValue(e.target.value)
    }

    const handleCheck = (e) => {
        setIsChecked(!isChecked)
    }

    const handleModal = (e) => {
        setCommunityModal(!communityModal)
        setCharacters(21)
        setCommunityExists(false)
    }

    const createCommunity = async () => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today  = new Date();
        await setDoc(doc(db, "communities", communityName), 
        {
                name: communityName, created: today.toLocaleDateString("en-US", options), moderators: [userData[0].username], 
                posts: [], about: "", icon: "", type: radioValue, adult: isChecked 
        })
    }
    
    const getCommunities = async () => {
        const communitiesRef = collection(db, "communities");
        const q = query(communitiesRef,  or( where("type", "==", "public"), 
        where("type", "==", "private"), where("type", "==", "restricted") ))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setCommunityData([doc.data()])  
          console.log(doc.id, " => ", doc.data());
        });
    }

    const checkIfExists = async () => {
        const docRef = doc(db, "communities", communityName)
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCommunityExists(true)
          } else {
            setCommunityModal(!communityModal)
            createCommunity()
            getCommunities()
            navigate(`f/${communityName}`);
            };
        }

    const handleSubmit = (e) => {
        e.preventDefault()
        checkIfExists()
    }

    useEffect(() => {
        if (characters === 0) {
            setCharactersZero(true)
        } else {
            setCharactersZero(false)
        }
    }, [characters])

    useEffect(() => {
        setCommunityExists(false)
    }, [characters])

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
                            <div className="input-container">
                                <span className="fix-text">f/</span>
                                <input type="text" className="my-input" maxLength="21" onInput={handleCharacters} onChange={handleChange} pattern={'^[a-zA-Z0-9_]*$'} required></input>
                            </div>
                            <p className={ charactersZero ? "input-container-p" : "input-container-p-false" }>{characters} Characters remaining</p>
                            <span className={ communityExists ? "input-container-p" : "input-empty" }>Sorry, f/{communityName} is taken. Try another.</span>
                        </div>
                        <div className="community-type">
                            <div className="community-header-radio">
                                <span>Community type</span>
                                <div className="radios">
                                    <input type="radio" name="communityType" id="public" value="public" onChange={handleRadio} defaultChecked></input>
                                    <label htmlFor="public">Public</label>
                                    <span>Anyone can view, post, and comment to this community</span>
                                </div>
                                <div className="radios">
                                    <input type="radio" name="communityType" id="restricted" value="restricted" onChange={handleRadio}></input>
                                    <label htmlFor="restricted">Restricted</label>
                                    <span>Anyone can view this community, but only approved users can post</span>
                                </div>
                                <div className="radios">
                                    <input type="radio" name="communityType" id="private" value="private" onChange={handleRadio}></input>
                                    <label htmlFor="private">Private</label>
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