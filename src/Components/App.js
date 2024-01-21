import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import ReverseChordSearch from '../Features/ReverseChordSearch/ChordSearch.js';
import ChordProbabilityCalculator from '../Features/ChordProbabilityCalculator/ChordProbabilityCalculator.js';
import SongsFromChords from '../Features/SongsFromChords/SongsFromChords.js'
import HomeComponent from '../Components/HomeComponent.js';
const App = () => {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomeComponent />} />
                    <Route path="/reversechords" element={<ReverseChordSearch />} />
                    <Route path="/nextchordprobability" element={<ChordProbabilityCalculator />} />
                    <Route path="/songs" element={<SongsFromChords />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;