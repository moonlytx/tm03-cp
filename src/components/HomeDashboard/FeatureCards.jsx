import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureCards.css';

function FeatureCards() {
  const navigate = useNavigate();

  return (
    <section className="feature-cards">
      <div className="feat-card" onClick={() => navigate('/identify')}>
        <div className="feat-card-icon identify-icon"></div>
        <h3>Identify</h3>
        <p>Need help identifying your recyclable items? We got you covered!</p>
      </div>
      
      <div className="feat-card" onClick={() => navigate('/map')}>
        <div className="feat-card-icon map-icon"></div>
        <h3>Map</h3>
        <p>Locate your closest recycling center.</p>
      </div>
      
      <div className="feat-card" onClick={() => navigate('/report')}>
        <div className="feat-card-icon report-icon"></div>
        <h3>Report</h3>
        <p>Track your contributions and the progress of your recycling efforts</p>
      </div>
    </section>
  );
}

export default FeatureCards;