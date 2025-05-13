import './LocationModal.css';

export default function LocationModal({ show, onUseDefault, onShareLocation }) {
  if (!show) return null;
  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <h2 className="location-modal-title">Location Services</h2>
        <p className="location-modal-text">
          Would you like to share your location to find the nearest recycling centers?
          You can also use the default Kuala Lumpur location.
        </p>
        <div className="location-modal-buttons">
          <button onClick={onUseDefault} className="default-location-button">
            Use Default Location
          </button>
          <button onClick={onShareLocation} className="share-location-button">
            Share My Location
          </button>
        </div>
      </div>
    </div>
  );
} 