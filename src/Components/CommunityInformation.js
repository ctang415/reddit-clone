import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../firebase-config";
import Dropdown from "./Dropdown";

const CommunityInformation = ( {firebaseCommunityData, isLoggedIn, createNewPost }) => {
    const [ rules, setRules ] = useState(false)
    const [ dropBox, setDropBox ] = useState(false)
    const [ popularCommunities, setPopularCommunities ] = useState([])
    const params = useParams();
    const user = auth.currentUser;

    const handleDrop = () => {
        setDropBox(!dropBox)
    }

    const handleCommunityDrop = (e) => {
        const newCom = popularCommunities.map(x => {
            if (x.drop === true) {
                x.drop = !x.drop
                return x
            }
            if (x.header === e.currentTarget.className) {
                x.drop = !x.drop
                return x
        }
        return x
    }
    )
        setPopularCommunities(newCom)
    }

    useEffect(() => {
        const communityList = [ {header: "POPULAR COMMUNITIES", list: ["AskReddit", "NoStupidQuestions", "DestinyTheGame", 
        "explainlikeimfive", "AskMen", "leagueoflegends", "Minecraft"], drop: false}, {header: "GAMING", list: ["StardewValley", 
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

    if (params.id) {
    return (
        firebaseCommunityData.map(data => {
            return (
        <div className="community-info-bar">
            <div className="community-info">
                <div className="community-info-top">
                    <h5>About Community</h5>
                    <h5 id={ isLoggedIn ? "community-dots" : "community-dots-false"}>...</h5>
                </div>
                <div className="community-info-text">
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
            <div className="community-mod">
                <h5>Moderators</h5>
                <p className={ isLoggedIn ? "moderators-true" : "moderators-false"}>u/{data.moderators}</p>
                <p className={ isLoggedIn ? "moderators-false" : "moderators-true"}>Moderator list hidden.</p>
            </div>
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
                        <ul>
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
                <div className="top-button">
                    <button className="back-to-top" onClick={(e) => window.scrollTo({ top:0, behavior:'auto'}) }>Back to Top</button>
                </div>
            </div>
        )
    }
}

export default CommunityInformation