import React from 'react';
import { Save } from 'lucide-react';
import './WasteCategories.css';

// Import all tree stage images
import tree0 from '../../assets/images/WasteDashboard/growing_tree/1.jpg';
import tree1 from '../../assets/images/WasteDashboard/growing_tree/2.jpg';
import tree2 from '../../assets/images/WasteDashboard/growing_tree/3.jpg';
import tree3 from '../../assets/images/WasteDashboard/growing_tree/4.jpg';
import tree4 from '../../assets/images/WasteDashboard/growing_tree/5.jpg';
import tree5 from '../../assets/images/WasteDashboard/growing_tree/6.jpg';
import tree6 from '../../assets/images/WasteDashboard/growing_tree/7.jpg';
import tree7 from '../../assets/images/WasteDashboard/growing_tree/8.jpg';
import tree8 from '../../assets/images/WasteDashboard/growing_tree/9.jpg';
import tree9 from '../../assets/images/WasteDashboard/growing_tree/10.jpg';

const getTreeImage = (progress) => {
  if (progress < 10) return tree0;
  else if (progress < 20) return tree1;
  else if (progress < 30) return tree2;
  else if (progress < 40) return tree3;
  else if (progress < 50) return tree4;
  else if (progress < 60) return tree5;
  else if (progress < 70) return tree6;
  else if (progress < 80) return tree7;
  else if (progress < 90) return tree7;
  else if (progress < 97) return tree8;
  else return tree9;
};

const getImageSrc = (base64Data, defaultAvatar) => {
  if (!base64Data) return defaultAvatar;
  return `data:image/jpeg;base64,${base64Data}`;
};

const WasteCategories = ({
  wasteItems,
  counts,
  progressPercentage,
  incrementCount,
  decrementCount,
  saveData,
  hasUnsavedChanges
}) => (
  <div className="waste-categories-container">
    <div className="tree-section">
      <img
        src={getTreeImage(progressPercentage)}
        alt={`Tree growth stage ${Math.floor(progressPercentage / 10)}`}
        className={`tree-image-left ${progressPercentage < 10 ? 'tree-image-small' : ''}`}
      />
    </div>

    <div className="categories-section">
      <div className="categories-grid-right">
        {wasteItems.map((item) => (
          <div key={item.id} className="category-card">
            <div className="category-header">
              <div className="category-star">
                {item.icon ? (
                  <img
                    src={getImageSrc(item.icon)}
                    alt={item.item}
                    style={{ width: '24px', height: '24px' }}
                  />
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z" />
                  </svg>
                )}
              </div>
              <p className="category-label">{item.item}</p>
            </div>

            <div className="category-counter">
              <button
                className="counter-button counter-button-minus"
                onClick={() => decrementCount(item.id)}
              >
                -
              </button>

              <h3 className="category-value">
                {counts[item.id] || 0}
              </h3>

              <button
                className="counter-button counter-button-plus"
                onClick={() => incrementCount(item.id)}
              >
                +
              </button>
            </div>

            <div className="item-details">
              <small>{item.kg_per_item} kg/item • {item.kg_co2_per_kg_item} kg CO2/kg</small>
            </div>
          </div>
        ))}
      </div>

      <button
        className="submit-button"
        onClick={saveData}
        disabled={!hasUnsavedChanges || wasteItems.length === 0}
      >
        <Save size={16} className="submit-icon" />
        <span>Save</span>
      </button>
    </div>
  </div>
);

export default WasteCategories;