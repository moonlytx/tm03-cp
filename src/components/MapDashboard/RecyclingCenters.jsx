import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Info } from 'lucide-react';
import { FaTrash } from 'react-icons/fa';
import { GoogleMap, Marker, Polyline, useLoadScript, InfoWindow, Autocomplete } from '@react-google-maps/api';
import './RecyclingCenters.css';
import bin from '../../assets/images/MapDashboard/bin.png';
import CenterList from './CenterList';
import CenterDetailsModal from './CenterDetailsModal';
import MapSection from './MapSection';
import useRecyclingCentersData from './useRecyclingCentersData';
import LocationModal from './LocationModal';

export default function RecyclingCenters() {
  const defaultCenter = { lat: 3.1390, lng: 101.6869 };
  const {
    centers, loading, error, currentPage, setCurrentPage, totalPages,
    selectedCenter, setSelectedCenter, userLocation, setUserLocation,
    showLocationModal, setShowLocationModal, showUserLocationInfo, setShowUserLocationInfo,
    inputLocation, setInputLocation, searchedLocation, setSearchedLocation,
    searchError, setSearchError, autocomplete, setAutocomplete, perPage,
    filteredAndSortedCenters, setFilteredAndSortedCenters, displayedCenters, setDisplayedCenters,
    routePolyline, setRoutePolyline, routeTargetId, setRouteTargetId,
    handleSelectCenter, handleShowRoute, handleLocationSearch,
    requestLocationPermission, useDefaultLocation, startLocationTracking, calculateDistance
  } = useRecyclingCentersData(defaultCenter);

  // Hide the default InfoWindow close button
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .gm-ui-hover-effect {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Google Maps configuration
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px',
  };

  // Load Google Maps script with Places & Geometry library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBtMH1f3lNDcG_4JXEM9NqTm2z8WZ4nIcs',
    libraries: ['places', 'geometry'],
  });

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="recycling-centers-container">

      {/* Location search input with Google Places Autocomplete */}
      <div className="search-bar">
        <Autocomplete
          onLoad={ac => setAutocomplete(ac)}
          onPlaceChanged={() => {
            if (autocomplete) {
              const place = autocomplete.getPlace();
              if (place.geometry && place.geometry.location) {
                const loc = place.geometry.location;
                setSearchedLocation({ lat: loc.lat(), lng: loc.lng() });
                setUserLocation({ lat: loc.lat(), lng: loc.lng() });
                setInputLocation(place.formatted_address || place.name);
                setSearchError('');
              } else {
                setSearchError('Location not found. Please try another address.');
              }
            }
          }}
        >
          <input
            type="text"
            value={inputLocation}
            onChange={e => setInputLocation(e.target.value)}
            placeholder="Enter a location (e.g. KLCC, Petaling Jaya)"
            className="search-input"
          />
        </Autocomplete>
        <button
          onClick={handleLocationSearch}
          className="search-button"
        >
          Search
        </button>
      </div>
      {searchError && <div className="search-error">{searchError}</div>}

      {loading && <div className="loading">Loading recycling centers...</div>}
      {error && <div className="error">Error: {error}</div>}

      <LocationModal
        show={showLocationModal}
        onUseDefault={useDefaultLocation}
        onShareLocation={requestLocationPermission}
      />

      <div className="map-and-list">
        <MapSection
          userLocation={userLocation}
          defaultCenter={defaultCenter}
          displayedCenters={displayedCenters}
          selectedCenter={selectedCenter}
          onSelectCenter={handleSelectCenter}
          bin={bin}
          isOpen={center => true}
          routePolyline={routePolyline}
          onUserMarkerClick={() => setShowUserLocationInfo(true)}
          showUserLocationInfo={showUserLocationInfo}
          setShowUserLocationInfo={setShowUserLocationInfo}
        />
        <CenterList
          centers={displayedCenters}
          selectedCenter={selectedCenter}
          onSelectCenter={handleSelectCenter}
          userLocation={userLocation}
          calculateDistance={calculateDistance}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          isOpen={center => true}
        />
      </div>
      <CenterDetailsModal
        center={selectedCenter}
        onClose={() => setSelectedCenter(null)}
        onShowRoute={handleShowRoute}
      />
    </div>
  );
}