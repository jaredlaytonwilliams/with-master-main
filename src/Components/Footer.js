import React from 'react';
import '../App.css'; 

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <span>| &copy; 2024 My Music App. All rights reserved. </span>
                <span>| Jared Williams | </span>
                <a href="https://www.hooktheory.com/api/trends/docs" target="_blank" rel="noopener noreferrer">
                    Hooktheory API
                </a>
                <span> |</span>
            </div>
        </footer>
    );
};
export default Footer;