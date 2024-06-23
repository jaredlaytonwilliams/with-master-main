import React from 'react';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
    return (
        <div>
            <div className="nav-container">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/reversechords" className="nav-link">Reverse Chord Search</Link>
                <Link to="/nextchordprobability" className="nav-link">Next Most Probable Chord</Link>
                <Link to="/songs" className="nav-link">Song From Chords</Link>
            </div>
            <main>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;