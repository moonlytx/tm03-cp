import React from 'react';
import Navbar from '../components/HomePage/Navbar';
import './MapPage.css';
function MapPage() {
  return (
    <div className="waste-app">
      <div className="content-container map-container">
        <div className="map-header">
          <h1>Recycling Centers Near You</h1>
          <p>Find the recycling centers to properly dispose of your waste</p>
        </div>
      </div>
    </div>
  );
}

export default MapPage;