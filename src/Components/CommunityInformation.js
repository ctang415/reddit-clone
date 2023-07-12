import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityModal from "./CommunityModal";
import Dropdown from "./Dropdown";
import Policy from "./Policy";
import CommunityIcon from "../Assets/communityicon.png"
import Edit from "../Assets/edit.png"
import { doc, getDoc, updateDoc } from "firebase/firestore";

const CommunityInformation = ( {firebaseCommunityData, isLoggedIn, createNewPost, communityModal, setCommunityModal, drop, setDrop, 
                                setFirebaseCommunityData }) => {
    const [ popularCommunities, setPopularCommunities ] = useState([])
    const [ baseSubmit, setBaseSubmit ] = useState(true)
    const [ communityRules, setCommunityRules ] = useState([])
    const [ currentUser, setCurrentUser ] = useState('')
    const [ edit, setEdit ] = useState(false)
    const [ text, setText ] = useState('')
    const params = useParams();
    const user = auth.currentUser;
    const location = useLocation()

    const handleCommunityDrop = (e) => {
        const newCom = popularCommunities.map(x => {
            if ((x.drop === true) && (e.target.className !== 'dropbox-true-home') && (e.target.className !== 'list') && (e.target.className !== 'dropbox-true-home-list')) {
                x.drop = !x.drop
                return x
            }
            if ((x.header === e.currentTarget.className) && (e.target.className !== 'dropbox-true-home') && (e.target.className !== 'list') && (e.target.className !== 'dropbox-true-home-list')) {
                x.drop = !x.drop
                return x
            }
        return x
    })
        setPopularCommunities(newCom)
    }

    const handleEdit = () => {
        setEdit(true)
    }

    const handleCreateCommunity = () => {
        setCommunityModal(!communityModal) 
        setDrop(false) 
    }

    const handleCancel = () => {
        setEdit(false)
    }

    const handleSave = async () => {
        setEdit(false)
        const docRef = doc(db, "communities", params.id)
        await updateDoc(docRef, { about: text })
        const communityUpdate = async () => {
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            setFirebaseCommunityData([data])
        }
        communityUpdate()
    }

    const handleChange = (e) => {
        setText(e.target.value)
    }

    useEffect(() => {
        const communityList = [ {header: "POPULAR COMMUNITIES", list: ["AskFreddit", "NoStupidQuestions", "DestinyTheGame", 
        "explainlikeimfive", "AskMen", "leagueoflegends", "Minecraft"], drop: true}, {header: "GAMING", list: ["StardewValley", 
        "FortniteCompetitive", "Warframe", "totalwar", "Fallout", "RocketLeague", "fo76", "yugioh", "eu4"], drop: false}, {
        header: "SPORTS", list: ["running", "soccer", "bjj", "MMA", "hockey", "formula1", "CFB", "barstoolsports", "airsoft", 
        "rugbyunion", "golf", "MTB", "cycling"], drop: false}, {header: "TV", list: ["Naruto", "BokuNoHeroAcademia", "marvelstudios", 
        "rupaulsdragrace", "90DayFiance", "dbz", "Boruto"], drop:false}, {header: "TRAVEL", list: ["vancouver", "brasil", "australia", 
        "mexico", "argentina", "melbourne", "ottawa", "korea", "ireland", "travel", "Calgary", "portugal"], drop: false}, 
        {header: "HEALTH & FITNESS", list: ["orangetheory", "bodybuilding", "bodyweightfitness", "vegan", "crossfit", 
        "EatCheapAndHealthy", "loseit"], drop: false}, {header: "FASHION", list: ["MakeupAddiction", "Watches", "BeautyGuruChatter", 
        "femalefashionadvice", "frugalmalefashion", "curlyhair", "poshmark"], drop: false } ]
        setPopularCommunities(communityList)
    }, [])

    useEffect(() => {
        const listOfRules = [ 
            {rule: 'Remember the human'}, 
            {rule: 'Behave like you would in real life'},
            {rule: 'Look for the original source of content'}, 
            {rule: 'Search for duplicates before posting'},
            {rule: 'Read the community\'s rules'}
        ]
        setCommunityRules(listOfRules)
    }, [])

    useEffect(() => {
        if ( (location.pathname === '/submit') || (location.pathname === (`/f/${params.id}/submit`))) {
            setBaseSubmit(true)
        } else {
            setBaseSubmit(false)
        }
    }, [location.pathname])

    useEffect(() => {
        if (user && !user.isAnonymous) {
            setCurrentUser(user.displayName)
            setEdit(true)
        } else {
            setEdit(false)
            setCurrentUser('')
        } 
        setEdit(false)
    }, [user])


if (params.id && !baseSubmit) {
    return (
        firebaseCommunityData.map(data => {
            return (
                <div className="community-info-bar" key={data.name}>
                    <div className="community-info">
                <div className="community-info-top">
                    <h5>About Community</h5>
                    <h5 id={ isLoggedIn ? "community-dots" : "community-dots-false"}>...</h5>
                </div>
                <div className="community-info-text">
                    <div className="community-info-header-area">
                        <img src={CommunityIcon} alt="Community Icon"/>
                        <Link to={`../f/${data.name}`}><h3>f/{data.name}</h3></Link>
                    </div>
                    <div>
                        <div className={ edit ? "community-info-input" : "input-empty" }>
                            <input type="text"
                            placeholder={data.about}
                            onChange={handleChange}
                            />
                            <div>
                                <button style={{ color: "red", cursor: "pointer" }} onClick={handleCancel}>Cancel</button>
                                <button style={{ color: "royalblue", cursor: "pointer" }} onClick={handleSave}>Save</button>
                            </div>
                        </div>
                        <div className={edit ? "input-empty" : "community-info-information" }>
                            {data.about} <img className={data.moderators.includes(currentUser) ? "user-left" : "input-empty" } src={Edit} alt="Edit icon" onClick={handleEdit}></img>
                        </div>
                    </div>
                    <p>Created {data.created}</p>
                </div>
                <div className="community-divide">
                <div className={ isLoggedIn ? "community-divider-text-info" : "community-button-false"}></div>
                </div>
                <div className={ isLoggedIn ? "create-button" : "community-button-false"}>
                    <button className={isLoggedIn ? "community-post-button" : "community-button-false"} onClick={createNewPost}>Create Post</button>
                </div>
            </div>
            <div className={ baseSubmit ? "input-empty" : "community-mod"} >
                <h5>Moderators</h5>
                {data.moderators.map(mod => {
                    return (
                        <p className={ isLoggedIn ? "moderators-true" : "moderators-false"}>u/{mod}</p>
                    )
                })}
                <p className={ isLoggedIn ? "moderators-false" : "moderators-true"}>Moderator list hidden.</p>
            </div>
            <Policy/>
            <div className="top-button">
                    <button className="back-to-top" onClick={(e) => window.scrollTo({ top:0, behavior:'auto'}) }>Back to Top</button>
                </div>
        </div>
            )
        })
    )
    } else {
        return (
            <div className="community-info-bar">
                <div className="community-info-home">
                    <div className="community-info-top-home">
                        <div className={ isLoggedIn ? null : "input-empty"}>
                        <div className={ baseSubmit ? "community-info-home-logged" : "input-empty" }>
                            <h4>Posting to Freddit</h4>
                            <span className="community-divider-text"></span>
                            <ol>
                                {communityRules.map(rule => {
                                    return (
                                        <li key={rule.rule}>
                                            {rule.rule}
                                            <span className="community-divider-text"></span>
                                        </li>
                                    )
                                })}
                            </ol>
                        </div>
                        </div>
                        <div className={ isLoggedIn ? null : "input-empty"}>
                            <div className={ baseSubmit ? "input-empty" : null }>
                            <div className="community-info-home-logged">
                                <h4>Home</h4>
                                <p className="community-info-home-logged-text">Your personal Freddit frontpage. Come here to check in with your favorite communities.</p>
                            </div>
                            <span className="community-divider-text"></span>
                            <div className="community-info-buttons">
                                <Link to="/submit">
                                    <button className="community-post-button">Create Post</button>
                                </Link>
                                <button onClick={handleCreateCommunity} id="community-create-button">Create Community</button>
                            </div>
                            <CommunityModal communityModal={communityModal} setCommunityModal={setCommunityModal}/>
                            </div>
                        </div>
                        <ul className={ isLoggedIn ? "input-empty" : "community-header" }>
                            {popularCommunities.map(item => {
                                return (
                                    <li className={item.header} key={item.header} onClick={handleCommunityDrop}>
                                        <div className="community-info-sections">
                                            <h6>{item.header}</h6>
                                            <h6 id="arrow"> ⌄</h6>
                                        </div>
                                        <div className="list">
                                        {item.list.map( x => {
                                            return (
                                                <Dropdown key={x} x={x} item={item}/>
                                            )
                                        })}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
                <Policy/>
                <div className="top-button">
                    <button className="back-to-top" onClick={(e) => window.scrollTo({ top:0, behavior:'auto'}) }>Back to Top</button>
                </div>
            </div>
        )
    }
}

export default CommunityInformation