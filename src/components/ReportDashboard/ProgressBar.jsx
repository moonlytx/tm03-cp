import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progressPercentage, totalWaste }) => (
  <div className="progress-section">
    <div className="progress-bar-container">
      <span className="progress-start">0</span>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${(totalWaste / 60 * 100).toFixed(2)}%`,
            backgroundColor: '#22c55e',
            borderRadius: '9999px'
          }}
        ></div>
        <div className="progress-star" style={{
          left: `${Math.min(100, (totalWaste / 60) * 100)}%`,
          right: 'auto'
        }}>
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" />
          </svg>
        </div>
      </div>
      <span className="progress-end">100%</span>
    </div>
    <p className="progress-text">{progressPercentage}% of Recycle Bin Collected (1 Bin = 1 Tree)</p>
  </div>
);

export default ProgressBar;