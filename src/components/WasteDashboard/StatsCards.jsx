import React from 'react';
import number_of_waste_collected from '../../assets/images/WasteDashboard/number_of_waste_collected.png';
import './StatsCards.css';


const formatTotalWaste = (total) => {
  if (total >= 1000) return `${(total / 1000).toFixed(1)}k`;
  return total.toFixed(2);
};

const StatsCards = ({ wastebinCollected }) => (
  <div className="stats-section">
    <div className="stat-card">
      <div className="stat-icon">
        <img src={number_of_waste_collected} alt="Number of Bins Recycled" className="custom-icon" />
      </div>
      <h3 className="stat-value">
      {wastebinCollected.toLocaleString()}
      </h3>
      <span className="stat-label">Number of Bins Recycled</span>
    </div>
  </div>
);



export default StatsCards;