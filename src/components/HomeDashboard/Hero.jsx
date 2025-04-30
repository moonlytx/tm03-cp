import React from 'react';
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
      </div>
    </section>
  );
}

export default Hero;