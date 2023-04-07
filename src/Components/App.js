import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { app } from '../firebase-config';
import Header from './Header';
import Home from './Home';

function App() {
  // Signs-out of Friendly Chat.
  useEffect(() => {
    const signOutUser = () => {
      // Sign out of Firebase.
      signOut(getAuth());
    }
    signOutUser()
  }, [])

  return (
    <div>
      <Header/>
      <Routes>
        <Route path="/" exact element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
