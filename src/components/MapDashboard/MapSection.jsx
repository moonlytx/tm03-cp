import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { useRef, useEffect, useState } from 'react';
import './MapSection.css';

export default function MapSection({
  userLocation,
  defaultCenter,
  displayedCenters,
  selectedCenter,
  onSelectCenter,
  bin,
  isOpen,
  routePolyline,
  routeInfo,
  routeTargetId,
  onUserMarkerClick,
  showUserLocationInfo,
  setShowUserLocationInfo,
  searchedLocation
}) {
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px',
  };
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  const clearRoute = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
  };

  // Handle route when routePolyline changes
  useEffect(() => {
    if (!routePolyline || !window.google?.maps?.geometry || !mapRef.current) {
      clearRoute();
      return;
    }

    try {
      const decodedPath = window.google.maps.geometry.encoding.decodePath(routePolyline);
      if (decodedPath.length > 0) {
        // Clear old route
        clearRoute();

        // Create new route
        const newPolyline = new window.google.maps.Polyline({
          path: decodedPath,
          strokeColor: '#22c55e',
          strokeOpacity: 0.8,
          strokeWeight: 5,
          map: mapRef.current
        });

        polylineRef.current = newPolyline;

        const bounds = new window.google.maps.LatLngBounds();
        decodedPath.forEach(point => bounds.extend(point));
        mapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error handling route:', error);
      clearRoute();
    }

    // Cleanup function
    return () => {
      clearRoute();
    };
  }, [routePolyline]);

  return (
    <div className="map-container">
      <div className="map-placeholder">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={searchedLocation || userLocation || defaultCenter}
          zoom={12}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
          onLoad={map => { mapRef.current = map; }}
        >
          {/* Searched location marker */}
          {searchedLocation && (
            <Marker
              position={searchedLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={onUserMarkerClick}
            />
          )}

          {/* User location marker (only show when no searched location) */}
          {userLocation && userLocation !== defaultCenter && !searchedLocation && (
            <>
              <Marker
                position={userLocation}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
                onClick={onUserMarkerClick}
              />
              {showUserLocationInfo && (
                <InfoWindow
                  position={userLocation}
                  onCloseClick={() => setShowUserLocationInfo(false)}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -40),
                    disableAutoPan: true,
                  }}
                >
                  <div className="user-location-info">
                    <span>Your Current Location</span>
                    <button
                      onClick={() => setShowUserLocationInfo(false)}
                      className="info-close-button"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                </InfoWindow>
              )}
            </>
          )}

          {/* Recycling centers markers (filtered) */}
          {displayedCenters.map((center) => (
            <Marker
              key={center.place_id}
              position={{
                lat: center.coordinates.latitude,
                lng: center.coordinates.longitude,
              }}
              onClick={() => onSelectCenter(center)}
              icon={{
                url: bin,
                scaledSize: new window.google.maps.Size(40, 40),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(20, 20),
              }}
            />
          ))}

          {routeInfo && routeTargetId && displayedCenters.find(c => c.place_id === routeTargetId) && (
            <InfoWindow
              position={{
                lat: displayedCenters.find(c => c.place_id === routeTargetId).coordinates.latitude,
                lng: displayedCenters.find(c => c.place_id === routeTargetId).coordinates.longitude
              }}
              options={{
                pixelOffset: new window.google.maps.Size(0, -40),
                disableAutoPan: true,
              }}
            >
              <div className="route-info">
                <div className="route-info-item">
                  <span className="route-info-label">Distance:</span>
                  <span className="route-info-value">{routeInfo.distance}</span>
                </div>
                <div className="route-info-item">
                  <span className="route-info-label">Duration:</span>
                  <span className="route-info-value">{routeInfo.duration}</span>
                </div>
                <div className="route-info-item">
                  <span className="route-info-label">Estimated Arrival:</span>
                  <span className="route-info-value">{routeInfo.arrivalTime}</span>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
} 