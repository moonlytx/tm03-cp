import React from 'react';
import { Footprints , Trees } from 'lucide-react';
import './Comm_Stats.css';

function Stats({ totalCarbonEmission }) {
  // Formatting the carbon emission value
  const formattedCarbon = totalCarbonEmission ? Math.round(totalCarbonEmission * 1000).toLocaleString() : '0';
  const treesPlanted = totalCarbonEmission ? Math.round(totalCarbonEmission / 25).toLocaleString() : '0'

  return (
    <section className="stats-highlight">
      <div className="stats-text">
        <h2>Carbon Footprint Reduced by the Community</h2>
        <div className="stat-number-container">
        <Footprints size={55} color="seagreen" />    
        <div className="stat-number">{formattedCarbon}</div>
        <p className="units">g·CO₂e</p> 
        </div>
        <p className="disclaimer">* Reduced Greenhouse Gases Equivalent to Amount of Carbon Dioxide (CO₂) in Grams </p>
        
        <h2>Equivalent to Planting</h2>
        <div className="stat-number-container">
          <Trees size={55} color="seagreen" />    
          <div className="stat-number">~{treesPlanted}</div>
          <p className="units">Trees</p> 
        </div>
        <p>
          What started as a small effort to reduce waste has
          blossomed into a <strong>community-wide movement</strong>, with
          everyone coming together to preserve the environment
          and make a <strong>positive impact on the planet</strong>.
        </p>
      </div>
      <div className="stats-image">
        <div className="tree-illustration"></div>
      </div>
    </section>
  );
}

export default Stats;