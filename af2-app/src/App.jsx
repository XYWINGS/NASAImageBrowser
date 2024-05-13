import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import HomePage from '../pages/HomePage'
import PictureOftheDay from '../pages/PictureOftheDay'
import MarsRoverPhotoes from '../pages/MarsRoverPhotoes'
import BNavigation from '../components/navigation.jsx'



const App = () => {
  return (
    <div>
    
    <BrowserRouter>
      <div>
        <div className='header'>
          <BNavigation></BNavigation>
        </div>
  
        <Routes>
          <Route path="/" element={<PictureOftheDay />} />
          <Route path="/epicpictures" element={<HomePage />} />
          <Route path="/pictureoftheday" element={<PictureOftheDay />} />
          <Route path="/marsroverpictures" element={<MarsRoverPhotoes />} />
        </Routes>
 
 
      </div>
    </BrowserRouter>  
  </div>
  )
}

export default App