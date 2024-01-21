import React from 'react';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
    return (
        <div>
            <header>
                {/* Navigation Links or Menu Here */}
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/reversechords">Reverse Chord Search</Link>
                    <Link to="/nextchordprobability">Next Most Probable Chord</Link>
                    <Link to="/songs">Song From Chords</Link>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                {/* Footer content */}
            </footer>
        </div>
    );
};

export default MainLayout;