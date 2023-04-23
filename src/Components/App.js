import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import CommunityPage from './CommunityPage';
import Header from './Header';
import Home from './Home';
import { collection, getDocs, or, query, where } from "firebase/firestore";
import CreatePost from './CreatePost';

const App = () => {
  const [ userData, setUserData ] = useState([ {karma: 1}])
  const [ communityModal, setCommunityModal ] = useState(false)
  const [ communityData, setCommunityData ] = useState([])
  const [ drop, setDrop ] = useState(false)

  const getCommunities = async () => {
    const communitiesRef = collection(db, "communities");
    const q = query(communitiesRef,  or( where("type", "==", "public"), 
    where("type", "==", "private"), where("type", "==", "restricted") ))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCommunityData(prev => [...prev, doc.data()])  
      console.log(doc.id, " => ", doc.data());
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
      communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
      communityData={communityData} setCommunityData={setCommunityData} userData={userData} setUserData={setUserData} 
      />
      <Routes>
        <Route path="/" exact element={<Home userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setDrop={setDrop} drop={drop}
        setCommunityModal={setCommunityModal} />}/>
        <Route path="/f/:id" element={<CommunityPage userData={userData} setUserData={setUserData} 
        communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
        />}/>
        <Route path="/f/:id/submit" element={<CreatePost />} />
        <Route path="/submit" element={<CreatePost />} />
      </Routes>
    </div>
  );
}

export default App;
