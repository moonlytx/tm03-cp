import React from 'react';
import { Link } from 'react-router-dom';
import { Footprints } from 'lucide-react';
import './RecyclingSteps.css';

function RecyclingSteps() {
  const renderHorizontalFootprints = (isLeftCard = true) => {
    const count = 5;
    return (
      <div className="footprint-path-horizontal">
        {Array(count).fill().map((_, index) => (
          <Footprints 
            key={index} 
            className={`footprint-icon ${isLeftCard ? 'footprint-right' : 'footprint-left'}`} 
          />
        ))}
      </div>
    );
  };

  const renderVerticalFootprints = (count = 4) => {
    return (
      <div className="footprint-path-vertical">
        {Array(count).fill().map((_, index) => (
          <Footprints 
            key={index} 
            className="footprint-icon footprint-vertical" 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="recycling-steps-container">
      <div className="recycling-steps-grid">
        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">STEP 1: Scan Your Item</h3>
          <p className="recycling-step-description">
            Collect all your recyclable items. Then, <Link to="/identify" className="recycling-step-highlight">SCAN OR UPLOAD</Link> each item. You can input your item quantity and choose to add points to your account!
          </p>
          {renderHorizontalFootprints(true)}
          {renderVerticalFootprints()}
        </div>

        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">STEP 2: Find Recycling Centers</h3>
          <p className="recycling-step-description">
            When you decided to recycle, <Link to="/map" className="recycling-step-highlight">LOCATE AND FIND</Link> the nearest recycling center to your location of choosing and continue your recycling efforts!
          </p>
          {renderHorizontalFootprints(false)}
          {renderVerticalFootprints()}
        </div>

        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">STEP 3: Point of You</h3>
          <p className="recycling-step-description">
            Check the <Link to="/report" className="recycling-step-highlight">PROGRESS</Link> of your recycling efforts and see how well you did! Share it with your friends and together build a greener world
          </p>
          {renderHorizontalFootprints(true)}
          {renderVerticalFootprints()}
        </div>

        <div className="recycling-step-card">
          <h3 className="recycling-step-title-list">HAPPY RECYCLING!</h3>
          <p className="recycling-step-description">
            Stay motivated with your <Link to="/report" className="recycling-step-highlight">PERSONAL EFFORTS</Link> as well as the <Link to="/" className="recycling-step-highlight">COMMUNITY EFFORTS</Link> as you continue recycling
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecyclingSteps;  