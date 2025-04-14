import React from 'react';
import { Footprints } from 'lucide-react';
import './Comm_Stats.css';

function Stats({ totalCarbonEmission }) {
  // Formatting the carbon emission value
  const formattedCarbon = totalCarbonEmission ? Math.round(totalCarbonEmission * 1000).toLocaleString() : '0';

  return (
    <section className="stats-highlight">
      <div className="stats-text">
        <h2>Carbon Footprint Reduced by the Community</h2>
        <div className="stat-number-container">
          <div className="stat-number">{formattedCarbon}</div>
          <Footprints className="footprint-icon" size={50} color="seagreen" />    
        </div>
        <p><strong className="emphasized-text">g·CO₂e</strong></p>
        
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