import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Home from './Home';

function App() {
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
