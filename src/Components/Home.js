import React, { useEffect } from "react";
import CommunityPage from "./CommunityPage";

const Home = ({communityData, setCommunityData, modalIsTrue, 
    setModalIsTrue, communityModal, setCommunityModal, setDrop, drop, setJoin, join}) => {

        useEffect(() => {
            document.title = 'Freddit - Jump into Anything'
        }, [])

    return (
        <div className="body">
            <CommunityPage 
            setCommunityModal={setCommunityModal} communityModal={communityModal} 
            setDrop={setDrop} drop={drop} modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
            join={join} setJoin={setJoin} 
            />
        </div>
    )
}

export default Home