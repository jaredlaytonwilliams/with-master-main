import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import ReverseChordSearch from '../Features/ReverseChordSearch/ChordSearch.js';
import ChordSearch from '../Features/ChordSearch/ChordSearch.js';

import HomeComponent from '../Components/HomeComponent.js';
const App = () => {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<HomeComponent />} />
                    <Route path="/reversechords" element={<ReverseChordSearch />} />
                    <Route path="/chords" element={<ChordSearch />} />
                    {/* Add more routes as needed */}
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;