import React from 'react';
import './AccumulatedWeights.css';

const AccumulatedWeights = ({ wasteItems, accumulatedWeights, totalAccumulatedWaste }) => (
  <div className="accumulated-weights-section">
    <h2 className="weights-title">Total Items Recycled by Weight (kg)</h2>
    <div className="weights-list">
      {wasteItems.map((item) => (
        <div key={`weight-${item.id}`} className="weight-item">
          <div className="weight-item-header">
            <div className="weight-item-icon">
              {item.icon ? (
                <img
                  src={`data:image/jpeg;base64,${item.icon}`}
                  alt={item.item}
                  style={{ width: '20px', height: '20px' }}
                />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" />
                </svg>
              )}
            </div>
            <span className="weight-item-name">{item.item}</span>
          </div>
          <span className="weight-item-value">
            {(accumulatedWeights[item.id] || 0).toFixed(2)} kg
          </span>
        </div>
      ))}
    </div>
    <div className="total-accumulated">
      <span className="total-label">Total Accumulated Weight:</span>
      <span className="total-value">{(totalAccumulatedWaste || 0).toFixed(2)} kg</span>
    </div>
  </div>
);

export default AccumulatedWeights;