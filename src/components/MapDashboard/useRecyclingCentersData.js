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
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(inputLocation)}&key=AIzaSyBtMH1f3lNDcG_4JXEM9NqTm2z8WZ4nIcs`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        setSearchedLocation({ lat: loc.lat, lng: loc.lng });
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
        }
      );
    }
    setShowLocationModal(false);
  };

  // Use default location
  const useDefaultLocation = () => {
    setUserLocation(defaultCenter);
    setShowLocationModal(false);
    setCurrentPage(1);
  };

  // Start location tracking
  const startLocationTracking = () => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  };

  // Select center card
  const handleSelectCenter = (center) => {
    // 先清除路线，再设置选中的中心
    setRoutePolyline(null);
    setRouteTargetId(null);
    setSelectedCenter(center);
  };

  // Show route
  const handleShowRoute = (center) => {
    // 如果点击的是当前已显示路线的中心，则清除路线
    if (routeTargetId === center.place_id) {
      setRoutePolyline(null);
      setRouteTargetId(null);
    } else {
      // 否则先清除旧路线，然后设置新的目标
      setRoutePolyline(null);
      // 使用 setTimeout 确保状态更新顺序
      setTimeout(() => {
        setRouteTargetId(center.place_id);
      }, 0);
    }
  };

  // 获取路线
  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const fetchRoute = async () => {
      // 清除之前的定时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 如果没有目标或用户位置，清除路线
      if (!routeTargetId || !userLocation) {
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

      try {
        const resp = await fetch('https://carbonpatrol.top:8081/api/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: {
              latitude: userLocation.lat,
              longitude: userLocation.lng,
            },
            destination: {
              latitude: center.coordinates.latitude,
              longitude: center.coordinates.longitude,
            }
          })
        });
        const data = await resp.json();
        if (isMounted) {
          if (data.success && data.route && data.route.polyline) {
            setRoutePolyline(data.route.polyline);
          } else {
            setRoutePolyline(null);
          }
        }
      } catch (e) {
        if (isMounted) {
          setRoutePolyline(null);
        }
      }
    };

    // 使用定时器延迟获取路线，确保状态更新完成
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
    handleSelectCenter,
    handleShowRoute,
    handleLocationSearch,
    requestLocationPermission,
    useDefaultLocation,
    startLocationTracking,
    calculateDistance,
  };
} 