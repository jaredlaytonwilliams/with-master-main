import React from 'react';
import { Link } from 'react-router-dom';

const MainLayout = ({ children }) => {
    return (
        <div>
            <header>
                {/* Navigation Links or Menu Here */}
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/reversechords">Reverse Chord Finder</Link>
                    <Link to="/chords">Chord Finder</Link>
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