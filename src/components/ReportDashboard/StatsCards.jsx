import React from 'react';
import personal_bin_collected from '../../assets/images/ReportDashboard/personal_bin_collected.png';
import personal_gco2e from '../../assets/images/ReportDashboard/personal_gco2e.png';
import './StatsCards.css';


const StatsCards = ({ totalCarbonEmission, wastebinCollected }) => {
  // Format carbon emission value the same way as in your original code
  const formattedCarbon = totalCarbonEmission ? Math.round(totalCarbonEmission * 1000) : 0;
  
  return (
    <div className="stats-section">
      <div className="stat-card">
        <div className="stat-icon">
          <img src={personal_gco2e} alt="Carbon Footprint Reduced" className="custom-icon" />
        </div>
        <h3 className="stat-value">
        {formattedCarbon.toLocaleString()}
        </h3>
        <span className="stat-label">Carbon Footprint Reduced (g·CO₂e)</span>
      </div>
      <div className="stat-card">
        <div className="stat-icon">
          <img src={personal_bin_collected} alt="Number of Bins Recycled" className="custom-icon" />
        </div>
        <h3 className="stat-value">
        {wastebinCollected.toLocaleString()}
        </h3>
        <span className="stat-label">Number of Bins Recycled</span>
      </div>
    </div>
  );
}


export default StatsCards;