import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import Header from './Header';
import Home from './Home';

const App = () => {
  const [ userData, setUserData ] = useState([])


  useEffect(() => {
    const signOutUser = () => {
      signOut(auth);
    }
    signOutUser()
  }, [])

  return (
    <div>
      <Header userData={userData} setUserData={setUserData} />
      <Routes>
        <Route path="/" exact element={<Home userData={userData} setUserData={setUserData} />}/>
      </Routes>
    </div>
  );
}

export default App;
