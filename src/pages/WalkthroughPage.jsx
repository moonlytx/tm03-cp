import React from 'react';
import RecyclingSteps from '../components/WalkthroughDashboard/RecyclingSteps';
import './WalkthroughPage.css';


function WalkthroughPage() {
  // Set up WalkthroughPage
  return (
    <div className="recycling-app">
      <div className="container">
        <div className="content-container recycling-container">
          <header className="recycling-header">
            <h1>Carbon Patrol Guide</h1>
            <p>Learn How To Recycle The Right Way and Track Your Progress</p>
          </header>
            {/* For recycling steps cards */}
            <RecyclingSteps />
        </div>
      </div>
    </div>
  );
}

export default WalkthroughPage;