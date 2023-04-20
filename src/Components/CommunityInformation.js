import React, { useEffect, useState } from "react";

const CommunityInformation = ( {firebaseCommunityData, params }) => {
    const [ rules, setRules ] = useState(false)
    const [ dropBox, setDropBox ] = useState(false)
    const [ popularCommunities, setPopularCommunities ] = useState([])
    

    const handleDrop = () => {
        setDropBox(!dropBox)
    }

    useEffect(() => {
        const communityList = [ {header: "POPULAR COMMUNITIES", list: ["AskReddit", "NoStupidQuestions", "DestinyTheGame", 
    "explainlikeimfive", "AskMen", "leagueoflegends", "Minecraft"]}, {header: "GAMING", list: ["StardewValley", 
    "ForniteCompetitive", "Warframe", "totalwar", "Fallout", "RocketLeague", "fo76", "yugioh", "eu4"]}, {
        header: "SPORTS", list: ["running", "soccer", "bjj", "MMA", "hockey", "formula1", "CFB", "barstoolsports", "airsoft", 
        "rugbyunion", "golf", "MTB", "cycling"]}, {header: "TV", list: ["Naruto", "BokuNoHeroAcademia", "marvelstudios", 
        "rupaulsdragrace", "90DayFiance", "dbz", "Boruto"]}, {header: "TRAVEL", list: ["vancouver", "brasil", "australia", 
        "mexico", "argentina", "melbourne", "ottawa", "korea", "ireland", "travel", "Calgary", "portugal"]}, 
        {header: "HEALTH & FITNESS", list: ["orangetheory", "bodybuilding", "bodyweightfitness", "vegan", "crossfit", 
        "EatCheapAndHealthy", "loseit"]}, {header: "FASHION", list: ["MakeupAddiction", "Watches", "BeautyGuruChatter", 
        "femalefashionadvice", "frugalmalefashion", "curlyhair", "poshmark"] } ]
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
                    <h5 id="community-dots">...</h5>
                </div>
                <div className="community-info-text">
                    <p>Text about section</p>
                    <p>Created {data.created}</p>
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
                <span>{data.moderators}</span>
            </div>
        </div>
            )
        })
    )
    } else {
        return (
            popularCommunities.map(item => {
                return (
                    <div className="community-info-bar">
                        <div className="community-info">
                            <div className="community-info-top-home">
                                <ul>
                                    <li key={item.header} onClick={handleDrop}>
                                        <div className="community-info-sections">
                                            <h6>{item.header}</h6>
                                            <h6> ⌄</h6>
                                        </div>
                                        <div className={ dropBox ? "dropbox-true-home" : "dropbox-false-home"}>
                                            {item.list.map( x => {
                                                return (
                                                    <div>
                                                        {x}
                                                    </div>
                                                )        
                                            })}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            })
        )
    }
}

export default CommunityInformation