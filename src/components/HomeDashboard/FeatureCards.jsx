import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SwatchBook } from 'lucide-react';
import './FeatureCards.css';

function FeatureCards() {
  const navigate = useNavigate();
  
  // Function to handle navigation 
  const handleNavigation = (path) => {
    // Navigate to the specified path
    navigate(path);
    // Instantly scroll to top without animation
    window.scrollTo(0, 0);
  };

  return (
    <>
      <section className="feature-cards">
        <div className="feat-card" onClick={() => handleNavigation('/identify')}>
          <div className="feat-card-icon identify-icon"></div>
          <h3>Identify</h3>
          <p>Need help identifying your recyclable items? We got you covered!</p>
        </div>
        
        <div className="feat-card" onClick={() => handleNavigation('/map')}>
          <div className="feat-card-icon map-icon"></div>
          <h3>Map</h3>
          <p>Locate your closest recycling center.</p>
        </div>
        
        <div className="feat-card" onClick={() => handleNavigation('/report')}>
          <div className="feat-card-icon report-icon"></div>
          <h3>Report</h3>
          <p>Track your contributions and the progress of your recycling efforts</p>
        </div>
      </section>
      
      <div className="guide-link-container">
        <div 
          className="guide-link" 
          onClick={() => handleNavigation('/walkthrough')}
        >
          <SwatchBook size={36} className="guide-icon" />
          <span>Friendly Quick-Start Guide</span>
          <div className="guide-underline"></div>
        </div>
      </div>
    </>
  );
}

export default FeatureCards;