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
  onUserMarkerClick,
  showUserLocationInfo,
  setShowUserLocationInfo
}) {
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px',
  };
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  // 清除路线
  const clearRoute = () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
  };

  // 当 routePolyline 变化时处理路线
  useEffect(() => {
    if (!routePolyline || !window.google?.maps?.geometry || !mapRef.current) {
      clearRoute();
      return;
    }

    try {
      const decodedPath = window.google.maps.geometry.encoding.decodePath(routePolyline);
      if (decodedPath.length > 0) {
        // 清除旧路线
        clearRoute();

        // 创建新路线
        const newPolyline = new window.google.maps.Polyline({
          path: decodedPath,
          strokeColor: '#22c55e',
          strokeOpacity: 0.8,
          strokeWeight: 5,
          map: mapRef.current
        });

        // 保存引用
        polylineRef.current = newPolyline;

        // 调整地图视野
        const bounds = new window.google.maps.LatLngBounds();
        decodedPath.forEach(point => bounds.extend(point));
        mapRef.current.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error handling route:', error);
      clearRoute();
    }

    // 清理函数
    return () => {
      clearRoute();
    };
  }, [routePolyline]);

  return (
    <div className="map-container">
      <div className="map-placeholder">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || defaultCenter}
          zoom={12}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
          onLoad={map => { mapRef.current = map; }}
        >
          {/* User location marker */}
          {userLocation && userLocation !== defaultCenter && (
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
        </GoogleMap>
      </div>
    </div>
  );
} 