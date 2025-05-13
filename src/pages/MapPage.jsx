import React from 'react';
import './MapPage.css';
import RecyclingCentersMap from './../components/MapDashboard/RecyclingCenters';
function MapPage() {
  return (
    <div className="waste-app">
      <div className="content-container map-container">
        <div className="map-header">
          <h1>Recycling Centers Near You</h1>
          <p>Find the recycling centers to properly dispose of your waste</p>
          <RecyclingCentersMap />
        </div>
      </div>
    </div>
  );
}

export default MapPage;