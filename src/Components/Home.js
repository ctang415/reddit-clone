import React, { useEffect } from "react";
import CommunityPage from "./CommunityPage";

const Home = ({communityData, setCommunityData, modalIsTrue, userData, setUserData,
    setModalIsTrue, communityModal, setCommunityModal, setDrop, drop, setJoin, join,
    allJoinedPosts, isEmpty, setAllJoinedPosts, setIsEmpty, joinedList, setJoinedList }) => {

    useEffect(() => {
        document.title = 'Freddit - Jump into Anything'
        window.scrollTo({ top:0, behavior:'auto'})
    }, [])

    return (
        <div className="body">
            <CommunityPage 
            setCommunityModal={setCommunityModal} communityModal={communityModal} 
            setDrop={setDrop} drop={drop} modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
            join={join} setJoin={setJoin} communityData={communityData} userData={userData}
            setUserData={setUserData} allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts}
            setIsEmpty={setIsEmpty} joinedList={joinedList} setJoinedList={setJoinedList}
            />
        </div>
    )
}

export default Home