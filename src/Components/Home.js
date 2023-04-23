import React from "react";
import CommunityPage from "./CommunityPage";

const Home = ({communityData, setCommunityData, communityModal, setCommunityModal, setDrop, drop}) => {

    return (
        <div className="body">
            <CommunityPage setCommunityModal={setCommunityModal} communityModal={communityModal} 
            setDrop={setDrop} drop={drop}
            />
        </div>
    )
}

export default Home