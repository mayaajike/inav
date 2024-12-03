import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from './Contexts/UserContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home"
import Opportunities from './Pages/Opportunities';
import Applications from './Pages/Applications';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  }
  return (
    <div className='app'>
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Home />} />
            <Route path='/opportunities' element={<Opportunities />} />
            <Route path='/applications' element={<Applications />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
      

    </div>
  )
}

export default App
