import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth } from "../firebase-config";
import CommunityModal from "./CommunityModal";
import Dropdown from "./Dropdown";
import Policy from "./Policy";
import CommunityIcon from "../Assets/communityicon.png"

const CommunityInformation = ( {firebaseCommunityData, isLoggedIn, createNewPost, communityModal, setCommunityModal, drop, setDrop }) => {
    const [ rules, setRules ] = useState(false)
    const [ dropBox, setDropBox ] = useState(false)
    const [ popularCommunities, setPopularCommunities ] = useState([])
    const [ baseSubmit, setBaseSubmit ] = useState(true)
    const [ communityRules, setCommunityRules ] = useState([])
    const params = useParams();
    const user = auth.currentUser;

    const handleDrop = () => {
        setDropBox(!dropBox)
    }

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

    const handleCreateCommunity = () => {
        setCommunityModal(!communityModal) 
        setDrop(false) 
    }

    useEffect(() => {
        const communityList = [ {header: "POPULAR COMMUNITIES", list: ["AskReddit", "NoStupidQuestions", "DestinyTheGame", 
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
        if ( !(window.location.pathname.match('/submit')) || !(window.location.pathname.match(`${params.id}/submit`))) {
            setBaseSubmit(false)
        } else {
            setBaseSubmit(true)
        }
    }, [])

    if (params.id) {
    return (
        firebaseCommunityData.map(data => {
            return (
        <div className="community-info-bar" key={data.created}>
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
                    <p>Text about section</p>
                    <p>Created {data.created}</p>
                </div>
                <div className="community-divide">
                <div className={ isLoggedIn ? "community-divider-text-info" : "community-button-false"}></div>
                </div>
                <div className={ isLoggedIn ? "create-button" : "community-button-false"}>
                    <button className={isLoggedIn ? "community-post-button" : "community-button-false"} onClick={createNewPost}>Create Post</button>
                </div>
            </div>
            <div className={ rules ? "community-rules": "community-rules-false"}>
                <h5>Rules</h5>
                <ol>
                    <li onClick={handleDrop}>
                        <div>
                        Hi
                        <p>⌄</p>
                        </div>
                    </li>
                    <div className={ dropBox ? "dropbox-true" : "dropbox-false"}>More text</div>
                    <span className="community-divider-text"></span>
                </ol>
            </div>
            <div className={ baseSubmit ? "input-empty" : "community-mod"} >
                <h5>Moderators</h5>
                <p className={ isLoggedIn ? "moderators-true" : "moderators-false"}>u/{data.moderators}</p>
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
                        <div className={ user ? null : "input-empty"}>
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
                        <div className={ user ? null : "input-empty"}>
                            <div className={ baseSubmit ? "input-empty" : null }>
                            <div className="community-info-home-logged">
                                <h4>Home</h4>
                                <p className="community-info-home-logged-text">Your personal Reddit frontpage. Come here to check in with your favorite communities.</p>
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
                        <ul className={ user ? "input-empty" : "community-header" }>
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
                                                <Dropdown x={x} item={item}/>
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