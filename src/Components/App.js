import { signOut } from 'firebase/auth';
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

const App = () => {
  const [ userData, setUserData ] = useState([])
  const [ communityModal, setCommunityModal ] = useState(false)
  const [ modalIsTrue, setModalIsTrue ] = useState(false)
  const [ communityData, setCommunityData ] = useState([])
  const [ drop, setDrop ] = useState(false)
  const [ join, setJoin ] = useState(false)


  const getCommunities = async () => {
    const communitiesRef = collection(db, "communities");
    const q = query(communitiesRef,  or( where("type", "==", "public"), 
    where("type", "==", "private"), where("type", "==", "restricted") ))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setCommunityData(prev => [...prev, doc.data()])  
    });
  }

  useEffect(() => {
    const signOutUser = () => { 
      signOut(auth);
    }
    signOutUser() 
  }, [])

  useEffect(() => {
    getCommunities()
  }, [setCommunityData])

  return (
    <div>
      <Header 
      modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
      communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
      communityData={communityData} setCommunityData={setCommunityData} userData={userData} setUserData={setUserData} 
      join={join} setJoin={setJoin} 
      />
      <Routes>
        <Route path="/" exact element={
        <Home 
        userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setDrop={setDrop} drop={drop} modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
        setCommunityModal={setCommunityModal} join={join} setJoin={setJoin} communityData={communityData}
        />}
        />
        <Route path="/f/:id" exact element={
        <CommunityPage 
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue}
        userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
        join={join} setJoin={setJoin} communityData={communityData}
        />}
        />
        <Route path="/f/:id/submit" element={
        <CreatePost 
        setDrop={setDrop} drop={drop}
        communityModal={communityModal} setCommunityModal={setCommunityModal}
        />} />
        <Route path="/submit" exact element={
        <CreatePost 
        setDrop={setDrop} drop={drop}
        communityModal={communityModal} setCommunityModal={setCommunityModal}
        />} />
        <Route path="/users/:id" exact element={ 
        <ProfilePage 
        userData={userData} setDrop={setDrop} drop={drop}
        modalIsTrue={modalIsTrue} setModalIsTrue={setModalIsTrue} join={join} setJoin={setJoin}
        />} />
        <Route path="*" element={<Error/>} />
      </Routes>
    </div>
  );
}

export default App;
