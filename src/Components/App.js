import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import ReverseChordSearch from '../Features/ReverseChordSearch/ChordSearch.js';
import ChordProbabilityCalculator from '../Features/ChordProbabilityCalculator/ChordProbabilityCalculator.js';
import SongsFromChords from '../Features/SongsFromChords/SongsFromChords.js';
import HomeComponent from '../Components/HomeComponent.js';
import Login from '../Components/Login';
import Signup from '../Components/Signup';
import { auth } from '../firebase';
import '../App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user && user.emailVerified);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <MainLayout isAuthenticated={isAuthenticated}>
        <Routes>
          <Route path="/" element={<HomeComponent isAuthenticated={isAuthenticated} />} />
          <Route path="/reversechords" element={<ReverseChordSearch />} />
          <Route path="/nextchordprobability" element={<ChordProbabilityCalculator />} />
          <Route path="/songs" element={<SongsFromChords />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
