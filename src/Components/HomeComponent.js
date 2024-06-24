import React from 'react';
import RecentActivity from './RecentActivity';

const HomeComponent = ({ isAuthenticated }) => {
  return (
    <div className="home-container">
      <div className="red-background">
        <h1>Welcome to My Music App!</h1>
      </div>
      {isAuthenticated && <RecentActivity />}
    </div>
  );
};

export default HomeComponent;