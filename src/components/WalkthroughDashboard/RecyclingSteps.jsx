import React from 'react';
import { Link } from 'react-router-dom';
import './RecyclingSteps.css';

function RecyclingSteps() {
  return (
    <div className="recycling-steps-container">
      <div className="recycling-steps-grid">
        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">Step 1</h3>
          <p className="recycling-step-description">
            Collect all your recyclable items. Then, <Link to="/identify" className="recycling-step-highlight">SCAN</Link> each item or upload a picture of your recyclable item.
          </p>
        </div>

        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">Step 2</h3>
          <p className="recycling-step-description">
            Key in the quantity of the recyclable item that you wish to dispose/recycle and receive your points in the <Link to="/report" className="recycling-step-highlight">POINT SYSTEM</Link>.
          </p>
        </div>

        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">Step 3</h3>
          <p className="recycling-step-description">
          Ensure all your recyclables are properly sorted and packaged before proceeding with your recycling efforts.
          </p>
        </div>

        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">Step 4</h3>
          <p className="recycling-step-description">
          Use the <Link to="/map" className="recycling-step-highlight">MAP</Link> feature to search for the recycling centers that are near your location and plan your route.
          </p>
        </div>

        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">Step 5</h3>
          <p className="recycling-step-description">
          Upon arrival, locate the the staff at the recycling center and inform them about your recycling activity. Present the scanned information if required.
          </p>
        </div>
        
        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">BONUS</h3>
          <p className="recycling-step-description">
            Track and view your <Link to="/report" className="recycling-step-highlight">PERSONAL EFFORTS</Link> as well as the <Link to="/" className="recycling-step-highlight">COMMUNITY EFFORTS</Link> the as you continue recycling.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecyclingSteps;