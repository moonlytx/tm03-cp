import CenterCard from './CenterCard';
import './CenterList.css';

export default function CenterList({ centers, selectedCenter, onSelectCenter, userLocation, calculateDistance, currentPage, totalPages, onPageChange, isOpen }) {
  return (
    <div className="centers-list">
      {centers.length === 0 ? (
        <div className="no-centers-found">
          No recycling centers found.
        </div>
      ) : (
        centers.map((center, idx) => (
          <CenterCard
            key={center.place_id}
            center={center}
            isSelected={selectedCenter?.place_id === center.place_id}
            onClick={() => onSelectCenter(center)}
            isNearest={idx === 0}
            isOpen={isOpen}
            userLocation={userLocation}
            calculateDistance={calculateDistance}
          />
        ))
      )}
      <div className="pagination">
        <button
          className={`pagination-button ${currentPage === 1 ? 'pagination-button-disabled' : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`pagination-button ${currentPage === totalPages ? 'pagination-button-disabled' : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
} 