import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureCards.css';

function FeatureCards() {
  const navigate = useNavigate();

  return (
    <section className="feature-cards">
      <div className="card" onClick={() => navigate('/report')}>
        <div className="card-icon report-icon"></div>
        <h3>Report</h3>
        <p>Check your progress and your profile to see how much you have recycled.</p>
      </div>
      
      <div className="card" onClick={() => navigate('/identify')}>
        <div className="card-icon identify-icon"></div>
        <h3>Identify</h3>
        <p>Need to know what is in front of you? We have a feature to help.</p>
      </div>
      
      <div className="card" onClick={() => navigate('/map')}>
        <div className="card-icon map-icon"></div>
        <h3>Map</h3>
        <p>Locate your closest recycling center.</p>
      </div>
    </section>
  );
}

export default FeatureCards;