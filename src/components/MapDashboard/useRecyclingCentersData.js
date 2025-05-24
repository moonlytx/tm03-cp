import { useState, useEffect, useRef } from 'react';

export default function useRecyclingCentersData(defaultCenter) {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(true);
  const [showUserLocationInfo, setShowUserLocationInfo] = useState(true);
  const [inputLocation, setInputLocation] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [perPage] = useState(5);
  const [filteredAndSortedCenters, setFilteredAndSortedCenters] = useState([]);
  const [displayedCenters, setDisplayedCenters] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [routeTargetId, setRouteTargetId] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  const locationWatchId = useRef(null);

  // Fetch all centers from all pages (no API pagination on frontend)
  const fetchCenters = async () => {
    setLoading(true);
    try {
      const firstResp = await fetch('https://carbonpatrol.top:8081/api/recycling-centers?page=1&per_page=100');
      const firstData = await firstResp.json();
      if (!firstData.success) throw new Error('API returned unsuccessful response');
      const totalPages = firstData.pagination.total_pages;
      let allCenters = [...firstData.data];
      const fetches = [];
      for (let page = 2; page <= totalPages; page++) {
        fetches.push(
          fetch(`https://carbonpatrol.top:8081/api/recycling-centers?page=${page}&per_page=100`)
            .then(res => res.json())
            .then(data => data.data)
        );
      }
      const rest = await Promise.all(fetches);
      rest.forEach(arr => { allCenters = allCenters.concat(arr); });
      setCenters(allCenters);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // Always sort by distance to current center, filter to 10km only if searchedLocation exists, then paginate
  useEffect(() => {
    const baseLocation = searchedLocation || userLocation || defaultCenter;
    let sorted = [...centers].sort((a, b) => {
      const distA = calculateDistance(
        baseLocation.lat,
        baseLocation.lng,
        a.coordinates.latitude,
        a.coordinates.longitude
      );
      const distB = calculateDistance(
        baseLocation.lat,
        baseLocation.lng,
        b.coordinates.latitude,
        b.coordinates.longitude
      );
      return distA - distB;
    });
    if (searchedLocation) {
      sorted = sorted.filter(center => {
        const dist = calculateDistance(
          searchedLocation.lat,
          searchedLocation.lng,
          center.coordinates.latitude,
          center.coordinates.longitude
        );
        return dist <= 10;
      });
    }
    setFilteredAndSortedCenters(sorted);
  }, [searchedLocation, userLocation, centers]);

  useEffect(() => {
    const startIdx = (currentPage - 1) * perPage;
    const endIdx = startIdx + perPage;
    setDisplayedCenters(filteredAndSortedCenters.slice(startIdx, endIdx));
    setTotalPages(Math.ceil(filteredAndSortedCenters.length / perPage));
  }, [filteredAndSortedCenters, currentPage, perPage]);

  // Search location
  const handleLocationSearch = async () => {
    setSearchError('');
    if (!inputLocation.trim()) return;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(inputLocation)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        setSearchedLocation({ lat: loc.lat, lng: loc.lng });
        if (locationWatchId.current) {
          navigator.geolocation.clearWatch(locationWatchId.current);
          locationWatchId.current = null;
        }
        setUserLocation({ lat: loc.lat, lng: loc.lng });
        setCurrentPage(1);
      } else {
        setSearchError('Location not found. Please try another address.');
      }
    } catch (e) {
      setSearchError('Failed to search location.');
    }
  };

  // Request location permission
  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          startLocationTracking();
          setCurrentPage(1);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(defaultCenter);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
    setShowLocationModal(false);
  };

  // Use default location
  const useDefaultLocation = () => {
    if (locationWatchId.current) {
      navigator.geolocation.clearWatch(locationWatchId.current);
      locationWatchId.current = null;
    }
    setUserLocation(defaultCenter);
    setShowLocationModal(false);
    setCurrentPage(1);
  };

  // Start location tracking
  const startLocationTracking = () => {
    if ("geolocation" in navigator) {
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }

      locationWatchId.current = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error watching location:", error);
          setUserLocation(defaultCenter);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    };
  }, []);

  const handleSelectCenter = (center) => {
    setRoutePolyline(null);
    setRouteTargetId(null);
    setSelectedCenter(center);
  };

  // Show route
  const handleShowRoute = (center) => {
    if (routeTargetId === center.place_id) {
      setRoutePolyline(null);
      setRouteTargetId(null);
    } else {
      setRoutePolyline(null);
      setTimeout(() => {
        setRouteTargetId(center.place_id);
      }, 0);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const fetchRoute = async () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!routeTargetId || (!userLocation && !searchedLocation)) {
        if (isMounted) {
          setRoutePolyline(null);
        }
        return;
      }

      const center = displayedCenters.find(c => c.place_id === routeTargetId);
      if (!center) {
        if (isMounted) {
          setRoutePolyline(null);
        }
        return;
      }

      const origin = searchedLocation || userLocation;

      try {
        const resp = await fetch('https://carbonpatrol.top:8081/api/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: {
              latitude: origin.lat,
              longitude: origin.lng,
            },
            destination: {
              latitude: center.coordinates.latitude,
              longitude: center.coordinates.longitude,
            }
          })
        });
        const data = await resp.json();
        if (isMounted) {
          if (data.success && data.route) {
            setRoutePolyline(data.route.polyline);
            setRouteInfo({
              distance: formatDistance(data.route.distance_meters),
              duration: formatDuration(data.route.duration_seconds),
              arrivalTime: calculateArrivalTime(data.route.duration_seconds)
            });
          } else {
            setRoutePolyline(null);
            setRouteInfo(null);
          }
        }
      } catch (e) {
        if (isMounted) {
          setRoutePolyline(null);
          setRouteInfo(null);
        }
      }
    };

    timeoutId = setTimeout(fetchRoute, 100);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [routeTargetId, userLocation, displayedCenters]);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} mins`;
  };

  const calculateArrivalTime = (durationSeconds) => {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + durationSeconds * 1000);

    const hours = arrivalTime.getHours().toString().padStart(2, '0');
    const minutes = arrivalTime.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  return {
    centers,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedCenter,
    setSelectedCenter,
    userLocation,
    setUserLocation,
    showLocationModal,
    setShowLocationModal,
    showUserLocationInfo,
    setShowUserLocationInfo,
    inputLocation,
    setInputLocation,
    searchedLocation,
    setSearchedLocation,
    searchError,
    setSearchError,
    autocomplete,
    setAutocomplete,
    perPage,
    filteredAndSortedCenters,
    setFilteredAndSortedCenters,
    displayedCenters,
    setDisplayedCenters,
    routePolyline,
    setRoutePolyline,
    routeTargetId,
    setRouteTargetId,
    routeInfo,
    handleSelectCenter,
    handleShowRoute,
    handleLocationSearch,
    requestLocationPermission,
    useDefaultLocation,
    startLocationTracking,
    calculateDistance,
  };
} 