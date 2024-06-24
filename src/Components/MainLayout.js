import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { auth } from '../firebase'; // Import auth for logout
import '../App.css';

const MainLayout = ({ children, isAuthenticated }) => {
  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('User logged out');
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  };

  return (
    <div className="main-layout">
      <div className="nav-wrapper">
        <div className="nav-container">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/reversechords" className="nav-link">Reverse Chord Search</Link>
            <Link to="/nextchordprobability" className="nav-link">Next Most Probable Chord</Link>
            <Link to="/songs" className="nav-link">Song From Chords</Link>
          </div>
        </div>
        <div className="auth-container">
          <div className="auth-links">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="nav-link logout-button">Log Out</button>
            ) : (
              <>
                <Link to="/login" className="nav-link">Log In</Link>
                <Link to="/signup" className="nav-link">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
