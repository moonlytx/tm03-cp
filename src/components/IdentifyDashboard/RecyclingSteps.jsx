import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './RecyclingSteps.css'; // We'll create this CSS file next

function RecyclingSteps({ onBack }) {
  return (
    <div className="recycling-steps-container">
      <h1 className="steps-heading">Steps to Recycle</h1>

      <div className="steps-grid">
        <div className="step-card">
          <h2 className="step-title-list">Step 1</h2>
          <p className="step-description">
            Collect the item together in a box and <span className="highlight">scan</span> the item
          </p>
        </div>

        <div className="step-card">
          <h2 className="step-title-list">Step 2</h2>
          <p className="step-description">
            Use the <span className="highlight">map feature</span> to find the closest store
          </p>
        </div>

        <div className="step-card">
          <h2 className="step-title-list">Step 3</h2>
          <p className="step-description">
            Use the <span className="highlight">path finder or Waze</span> to locate and visit the centre
          </p>
        </div>

        <div className="step-card">
          <h2 className="step-title-list">Step 4</h2>
          <p className="step-description">
            Inform the <span className="highlight">person in charge</span> for recycle
          </p>
        </div>

        <div className="step-card">
          <h2 className="step-title-list">Step 5</h2>
          <p className="step-description">
            Receive the <span className="highlight">point for the system</span>
          </p>
        </div>
      </div>

      <button
        onClick={onBack}
        className="back-button"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>
    </div>
  );
}

export default RecyclingSteps;