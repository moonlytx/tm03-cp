import { Info } from 'lucide-react';
import './CenterDetailsModal.css';

export default function CenterDetailsModal({ center, onClose, onShowRoute }) {
  if (!center) return null;

  const handleShowRoute = () => {
    onShowRoute(center);
    onClose();
  };

  return (
    <div className="center-details-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{center.name}</h2>
        <p className="modal-address">{center.address}</p>
        <div className="modal-coordinates">
          <Info size={14} />
          <span>Lat: {center.coordinates.latitude}, Long: {center.coordinates.longitude}</span>
        </div>
        <div className="modal-metadata">
          <p>Last Update Timestamp (Google API):</p>
          <p>{new Date(center.metadata.last_updated).toLocaleString()}</p>
        </div>
        <button
          className="show-route-btn"
          onClick={handleShowRoute}
        >
          Show Route
        </button>
      </div>
    </div>
  );
} 