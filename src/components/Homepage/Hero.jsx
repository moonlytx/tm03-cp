import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Turn Waste into Hope<br />Start Recycling</h1>
        <p>
          Join us in making a difference — 
          TRACK your impact, REDUCE waste, and HELP nature thrive.
          All just by <span className="highlight">RECYCLING</span>.
        </p>
      </div>
    </section>
  );
}

export default Hero;