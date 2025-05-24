import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Info, MapPinHouse } from 'lucide-react';
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
    requestLocationPermission, useDefaultLocation, startLocationTracking, calculateDistance,
    routeInfo
  } = useRecyclingCentersData(defaultCenter);

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry'],
  });

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="recycling-centers-container">
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
            placeholder="Enter and choose a location (e.g. KLCC, Petaling Jaya)"
            className="search-input"
          />
        </Autocomplete>
        <button
          onClick={() => {
            if (userLocation && userLocation !== defaultCenter) {
              setSearchedLocation(null);
              setInputLocation('');
              setSearchError('');
            }
          }}
          className="return-location-button"
          disabled={!userLocation || userLocation === defaultCenter}
          title="Return to Shared Location"
        >
          <MapPinHouse size={20} />
        </button>
      </div>
      {searchError && <div className="search-error">{searchError}</div>}

      {searchedLocation && (
        <div className="search-range-info">
          Showing recycling centers within 10km of {inputLocation}
        </div>
      )}

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
          routeInfo={routeInfo}
          routeTargetId={routeTargetId}
          onUserMarkerClick={() => setShowUserLocationInfo(true)}
          showUserLocationInfo={showUserLocationInfo}
          setShowUserLocationInfo={setShowUserLocationInfo}
          searchedLocation={searchedLocation}
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