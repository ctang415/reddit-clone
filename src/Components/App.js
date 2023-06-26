import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import CommunityPage from './CommunityPage';
import Header from './Header';
import Home from './Home';
import { collection, getDocs, or, query, where } from "firebase/firestore";
import CreatePost from './CreatePost';
import ProfilePage from './ProfilePage';
import Error from './Error';
import PostDetails from './PostDetails';
import Search from './Search'
import ModalMobile from './ModalMobile';
import { signInAnonymously } from 'firebase/auth';

const App = () => {
  const [ userData, setUserData ] = useState([{ avatar: null, created: 'unknown', karma: 'unknown', joined: [] }])
  const [ communityModal, setCommunityModal ] = useState(false)
  const [ modalIsTrue, setModalIsTrue ] = useState(false)
  const [ communityData, setCommunityData ] = useState([])
  const [ drop, setDrop ] = useState(false)
  const [ join, setJoin ] = useState(false)
  const [ allJoinedPosts, setAllJoinedPosts ] = useState([])
  const [ isEmpty, setIsEmpty ] = useState(true)
  const [ isMobile, setIsMobile ] = useState(false)
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ click, setClick] = useState(false)
  const user = auth.currentUser

  const getCommunities = async () => {
    const communitiesRef = collection(db, "communities");
    const q = query(communitiesRef,  or( where("type", "==", "public"), 
    where("type", "==", "private"), where("type", "==", "restricted") ))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setCommunityData(prev => [...prev, doc.data()])  
    });
  }

  const handleResize = () => {
    if (window.innerWidth < 1000) {
        setIsMobile(true)
    } else {
        setIsMobile(false)
    }
  }

 useEffect(() => {
  if (!user) {
    signInAnonymously(auth)
  }
 }, [])


  useEffect(() => {
    if (user && !user.isAnonymous) {
          setLoggedIn(true)
    } else {
          setLoggedIn(false)
    }
  }, [user])

  useEffect(() => {
    handleResize()
    console.log(isMobile)
  }, []) 

  useEffect(() => {
    getCommunities()
  }, [setCommunityData])

  if (!isMobile) {
  return (
    <div className='app'>
      <Header 
      modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
      communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
      communityData={communityData} setCommunityData={setCommunityData} userData={userData} setUserData={setUserData} 
      join={join} setJoin={setJoin} allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts}
      setIsEmpty={setIsEmpty}
      />
      <Routes>
        <Route path="/" exact element={
        <Home 
        userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setDrop={setDrop} drop={drop} modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
        setCommunityModal={setCommunityModal} join={join} setJoin={setJoin} communityData={communityData} allJoinedPosts={allJoinedPosts} 
        isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts} setIsEmpty={setIsEmpty}
        />}
        />
        <Route path="/f/:id" exact element={
        <CommunityPage 
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
        join={join} setJoin={setJoin} communityData={communityData} allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} 
        setAllJoinedPosts={setAllJoinedPosts} setIsEmpty={setIsEmpty} setCommunityData={setCommunityData} getCommunities={getCommunities}
        />}
        />
        <Route path="/search" element={
          <Search
          communityData={communityData} setUserData={setUserData} drop={drop} setDrop={setDrop} setJoin={setJoin} 
          modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} join={join} 
          />
        }/>
        <Route path="/f/:id/comments/:id" element={
        <PostDetails
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
        communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
        join={join} setJoin={setJoin} setUserData={setUserData} 
        />}
        />
        <Route path="/f/:id/submit" element={
        <CreatePost 
        setDrop={setDrop} drop={drop} communityData={communityData}
        communityModal={communityModal} setCommunityModal={setCommunityModal} 
        />} />
        <Route path="/submit" exact element={
        <CreatePost 
        setDrop={setDrop} drop={drop} communityData={communityData}
        communityModal={communityModal} setCommunityModal={setCommunityModal}
        />} />
        <Route path="/user/:id" exact element={ 
        <ProfilePage 
        userData={userData} setDrop={setDrop} drop={drop} setUserData={setUserData}
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} join={join} setJoin={setJoin}
        />} />
        <Route path="*" element={<Error/>} />
      </Routes>
    </div>
  );
  } else {
    return (
      <div className='app'>
      <Header 
      modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
      communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
      communityData={communityData} setCommunityData={setCommunityData} userData={userData} setUserData={setUserData} 
      join={join} setJoin={setJoin} allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts}
      setIsEmpty={setIsEmpty} isMobile={isMobile} click={click} setClick={setClick}
      />
      <Routes>
        <Route path="/" exact element={
        <Home 
        userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setDrop={setDrop} drop={drop} modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
        setCommunityModal={setCommunityModal} join={join} setJoin={setJoin} communityData={communityData} allJoinedPosts={allJoinedPosts} 
        isEmpty={isEmpty} setAllJoinedPosts={setAllJoinedPosts} setIsEmpty={setIsEmpty} isMobile={isMobile}
        />}
        />
        <Route path="/f/:id" exact element={
        <CommunityPage 
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
        join={join} setJoin={setJoin} communityData={communityData} allJoinedPosts={allJoinedPosts} isEmpty={isEmpty} 
        setAllJoinedPosts={setAllJoinedPosts} setIsEmpty={setIsEmpty} setCommunityData={setCommunityData} getCommunities={getCommunities}
        isMobile={isMobile}
        />}
        />
        <Route path="/search" element={
          <Search
          communityData={communityData} setUserData={setUserData} drop={drop} setDrop={setDrop} setJoin={setJoin} 
          modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} join={join} isMobile={isMobile}
          />
        }/>
        <Route path="/f/:id/comments/:id" element={
        <PostDetails
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
        communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
        join={join} setJoin={setJoin} setUserData={setUserData} isMobile={isMobile}
        />}
        />
        <Route path="/f/:id/submit" element={
        <CreatePost 
        setDrop={setDrop} drop={drop} communityData={communityData} setClick={setClick}
        communityModal={communityModal} setCommunityModal={setCommunityModal} isMobile={isMobile}
        />} />
        <Route path="/submit" exact element={
        <CreatePost 
        setDrop={setDrop} drop={drop} communityData={communityData} setClick={setClick}
        communityModal={communityModal} setCommunityModal={setCommunityModal} isMobile={isMobile}
        />} />
        <Route path="/user/:id" exact element={ 
        <ProfilePage 
        userData={userData} setDrop={setDrop} drop={drop} setUserData={setUserData}
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} join={join} setJoin={setJoin}
        isMobile={isMobile}
        />} />
        <Route path="/register" exact element={
          <ModalMobile modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} loggedIn={loggedIn} setLoggedIn={setLoggedIn}
          join={join} setJoin={setJoin} isMobile={isMobile} click={click} setClick={setClick}
        />}
        />
        <Route path="*" element={<Error/>} />
      </Routes>
      </div>
    )
  }
}

export default App;
