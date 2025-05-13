import './CenterCard.css';

export default function CenterCard({ center, isSelected, onClick, isNearest, isOpen, userLocation, calculateDistance }) {
  return (
    <div
      className={`center-card${isSelected ? ' center-card-selected' : ''}`}
      onClick={onClick}
    >
      <div className="center-details">
        <div className="name-and-status">
          <div className="center-status">
            <span className={`status-indicator ${isOpen(center) ? 'status-open' : 'status-closed'}`}>{isOpen(center) ? 'Open' : 'Closed'}</span>
            {isNearest && <span className="status-indicator nearest-indicator">Nearest</span>}
          </div>
          <h3 className="center-name">{center.name}</h3>
        </div>
        <p className="center-address">{center.address}</p>
      </div>
      <div className="center-distance">
        {userLocation && (
          <span>
            {calculateDistance(
              userLocation.lat,
              userLocation.lng,
              center.coordinates.latitude,
              center.coordinates.longitude
            )}km
          </span>
        )}
      </div>
    </div>
  );
} 