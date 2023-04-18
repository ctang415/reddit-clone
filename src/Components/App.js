import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import CommunityPage from './CommunityPage';
import Header from './Header';
import Home from './Home';
import { collection, getDocs, or, query, where } from "firebase/firestore";

const App = () => {
  const [ userData, setUserData ] = useState([])
  const [ communityData, setCommunityData ] = useState([])

  const getCommunities = async () => {
    const communitiesRef = collection(db, "communities");
    const q = query(communitiesRef,  or( where("type", "==", "public"), 
    where("type", "==", "private"), where("type", "==", "restricted") ))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setCommunityData([doc.data()])  
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
      <Header communityData={communityData} setCommunityData={setCommunityData} userData={userData} setUserData={setUserData} />
      <Routes>
        <Route path="/" exact element={<Home userData={userData} setUserData={setUserData} />}/>
        <Route path="/f/:id" element={<CommunityPage userData={userData} setUserData={setUserData} />}/>
      </Routes>
    </div>
  );
}

export default App;
