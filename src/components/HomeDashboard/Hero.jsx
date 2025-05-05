import React from 'react';
import { Recycle, BarChart3, Building } from 'lucide-react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Turn Waste into Hope<br />Start Recycling</h1>
        <p>
          Join us in making a difference — 
          <strong>TRACK</strong> your impact, <strong>REDUCE</strong> waste, and <strong>HELP</strong> nature thrive.
          All just by <span className="hero-highlight"><strong>RECYCLING</strong></span>.
        </p>
        
        <div className="malaysia-stats">
          <h2>Malaysia Recycling Facts</h2>
          
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-icon">
                <Recycle size={42} />
              </div>
              <div className="stat-content">
                <p className="stat-value">37%</p>
                <p className="stat-description">of solid waste gets recycled in Malaysia</p>
                <p className="stat-source">Source: Ministry of Housing and Local Government (KPKT)</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <Building size={42} />
              </div>
              <div className="stat-content">
                <p className="stat-value">39,000+ tonnes</p>
                <p className="stat-description">of solid waste end up in landfills daily (1.2kg per person in KL)</p>
                <p className="stat-source">Sources: SWCorp, TheStar, The Straits Times</p>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">
                <BarChart3 size={42} />
              </div>
              <div className="stat-content">
                <p className="stat-value">#37 Worldwide</p>
                <p className="stat-description">Malaysia's ranking in EPI Waste Recovery Rate (32.2 vs. 95+ for top countries)</p>
                <p className="stat-source">Source: worldpopulationreview.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;