import React from 'react';
import RecyclingSteps from '../components/GuideDashboard/RecyclingSteps';
import './GuidePage.css';

function GuidePage() {
  return (
    <div className="waste-app">
      <div className="container">
        <div className="content-container recycling-container">
          <header className="recycling-header">
            <h1>Carbon Patrol Guide</h1>
            <p>A Walkthrough of Carbon Patrol and Begin your Recycling Journey</p>
          </header>
          <RecyclingSteps />
        </div>
      </div>
    </div>
  );
}

export default GuidePage;