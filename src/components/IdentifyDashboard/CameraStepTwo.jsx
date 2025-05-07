import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Recycle, X, AlertTriangle, ListRestart, ChevronsDown } from 'lucide-react';
import './CameraStepOne.css';
import './CameraStepTwo.css';
import useWasteData from '../../hooks/useWasteData';

function CameraStepTwo({ onNext, onReset, capturedData, dialogAlreadyShown = false, savedRecycleStatus = false,
  savedQuantity = 1 }) {
  // Use state to track if dialogs have been shown
  const [hasShownDialogs, setHasShownDialogs] = useState(dialogAlreadyShown);
  // State for showing reuse materials section
  const [showReuseTips, setShowReuseTips] = useState(false);
  // New state for animation
  const [isClosing, setIsClosing] = useState(false);
  const reuseTipsRef = useRef(null);

  // State for recycling dialogs
  const [showChoiceDialog, setShowChoiceDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [itemQuantity, setItemQuantity] = useState('1'); // Set the default value to "1"
  const [isRecycled, setIsRecycled] = useState(savedRecycleStatus);
  const [userQuantity, setUserQuantity] = useState(savedQuantity);
  const [errorMessage, setErrorMessage] = useState('');
  const { wasteItems, addItemAndSave } = useWasteData();

  // Process detections to get material information with highest confidence
  const processDetections = () => {
    if (!capturedData || !capturedData.detections || capturedData.detections.length === 0) {
      return { count: 0, materials: [], isRecyclable: false };
    }

    // Find the detection with highest confidence
    let highestConfidenceDetection = capturedData.detections[0];

    // If there are multiple detections, find the one with highest confidence
    if (capturedData.detections.length > 1) {
      highestConfidenceDetection = capturedData.detections.reduce((prev, current) => {
        return (prev.confidence > current.confidence) ? prev : current;
      });
    }

    // Get only the highest confidence material
    const material = highestConfidenceDetection.class;

    // Check if material is "Unrecyclable" or similar
    const isRecyclable = material && material.toLowerCase() !== "unrecyclable";

    return {
      count: 1, // Always show 1 since we're only keeping the highest confidence item
      materials: [material],
      isRecyclable,
      confidence: highestConfidenceDetection.confidence
    };
  };

  const { count, materials, isRecyclable } = processDetections();

  // Calculate estimated weight and carbon emissions based on material
  const calculateEstimates = (materialName, quantity) => {
    if (!wasteItems || wasteItems.length === 0 || !materialName || quantity <= 0) {
      return { weightKg: 0, carbonKg: 0 };
    }

    const matchedItem = wasteItems.find(item =>
      item.item.toLowerCase() === materialName.toLowerCase()
    );

    if (!matchedItem) {
      return { weightKg: 0, carbonKg: 0 };
    }

    const weightKg = matchedItem.kg_per_item * quantity;
    const carbonKg = matchedItem.kg_co2_per_kg_item * weightKg;

    return { weightKg, carbonKg };
  };

  // Show dialog only on first render, if something was detected, AND if it's recyclable
  useEffect(() => {
    if (!hasShownDialogs && count > 0 && isRecyclable) {
      setShowChoiceDialog(true);
      setHasShownDialogs(true);
    }
  }, [count, hasShownDialogs, isRecyclable]);

  // When opening the quantity input dialog, reset itemQuantity to the default value "1" and clear any error messages
  const handleRecycleChoice = () => {
    setShowChoiceDialog(false);
    setItemQuantity('1'); // Reset to default value
    setErrorMessage(''); // Clear any error messages
    setShowQuantityDialog(true);
  };

  // Handle skip recycling
  const handleSkipRecycle = () => {
    setShowChoiceDialog(false);
    setIsRecycled(false);
    // Just proceed without recycling but stay on this screen
    // User must press next button to continue
  };

  // Handle input change with validation
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Allow empty or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setItemQuantity(value);
      setErrorMessage('');
    }
  };

  // Handle final submission after quantity input - SIMPLIFIED with new addItemAndSave method
  const handleSubmitRecycling = () => {
    if (itemQuantity === '') {
      setErrorMessage('Please enter the quantity of items you are recycling.');
      return;
    }

    const quantity = parseInt(itemQuantity);

    // Close dialog
    setShowQuantityDialog(false);
    setErrorMessage('');
    setIsRecycled(true);
    setUserQuantity(quantity);

    if (materials.length > 0) {
      const materialName = materials[0].toLowerCase();
      // Use the new method that updates and saves in one atomic operation
      addItemAndSave(materialName, quantity);
    }
  };

  // Navigation to next step
  const handleNextStep = () => {
    const quantity = isRecycled ? userQuantity : 1;
    const pointsEarned = isRecycled ? quantity * 10 : 0;

    onNext({
      material: materials.length > 0 ? materials[0] : null,
      recycled: isRecycled,
      quantity: quantity,
      pointsEarned: pointsEarned,
      dialogShown: true // Pass this to parent to remember dialog was shown
    });
  };

  // Handle scan another item click
  const handleScanAnother = () => {
    if (onReset) {
      onReset();
    }
  };

  // Modified toggle function for reuse tips with animation
  const toggleReuseTips = () => {
    if (showReuseTips) {
      // Start closing animation
      setIsClosing(true);
      // Wait for animation to finish before actually hiding
      setTimeout(() => {
        setShowReuseTips(false);
        setIsClosing(false);
      }, 300); // Match this to animation duration
    } else {
      // Just show immediately
      setShowReuseTips(true);
    }
  };

  // Get current material name
  const materialName = materials.length > 0 ? materials[0] : '';

  // Calculate estimates for dialog display
  const quantity = itemQuantity === '' ? 0 : parseInt(itemQuantity);
  const { weightKg, carbonKg } = calculateEstimates(materialName, quantity);

  // Get reuse tips based on material type
  const getReuseTips = (material) => {
    if (!material) return [];
    
    const materialLower = material.toLowerCase();
    
    if (materialLower.includes('paper')) {
      return [
        "Create homemade greeting cards or gift tags",
        "Use as wrapping paper for small gifts",
        "Make DIY paper mache projects",
        "Create origami decorations",
        "Use as drawer liners or shelf paper"
      ];
    } else if (materialLower.includes('plastic')) {
      return [
        "Use containers for small item storage",
        "Create plant pots with proper drainage holes",
        "Make bird feeders with plastic bottles",
        "Use as sorting containers for small parts",
        "Create DIY watering cans for plants"
      ];
    } else if (materialLower.includes('glass')) {
      return [
        "Reuse as food storage containers",
        "Create decorative vases or candle holders",
        "Use as organizing containers for office supplies",
        "Make terrarium planters for small plants",
        "Create decorative light fixtures"
      ];
    } else if (materialLower.includes('metal') || materialLower.includes('aluminum')) {
      return [
        "Use cans as pencil or utensil holders",
        "Create garden edge borders with flattened cans",
        "Make wind chimes from metal pieces",
        "Use as seed starters for gardening",
        "Create decorative luminaries with punched patterns"
      ];
    } else if (materialLower.includes('cardboard')) {
      return [
        "Create storage boxes for organizing",
        "Use as backing for picture frames",
        "Make DIY cat scratching pads",
        "Create children's toys like play houses",
        "Use as compost material for gardening"
      ];
    } else {
      // Return empty array for unknown materials
      return [];
    }
  };

  const reuseTips = getReuseTips(materialName);

  return (
    <div className="camera-interface">
      <h1 className="step-title">Step 2: Analysis</h1>
      <p className="step-description">
        Here are the results!
      </p>

      {/* Item preview */}
      <div className="item-preview-container">
        {capturedData && capturedData.photoURL ? (
          <img
            src={capturedData.photoURL}
            alt="Captured item"
            className="item-preview-image"
          />
        ) : (
          <div style={{
            backgroundColor: "#f3f4f6",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontWeight: "bold"
          }}>
            No image captured
          </div>
        )}
      </div>

      <div className="detection-results-container">
        {/* Show different icon based on recyclability */}
        <div className="recycle-icon-container">
          {isRecyclable ?
            <Recycle size={100} color="#22c55e" /> :
            <AlertTriangle size={100} color="#ef4444" />
          }
        </div>

        {/* Always use green background for results */}
        <div className="detection-results green-background">
          {count > 0 ? (
            <>
              {/* Switched the order of these two elements */}
              <div className="detection-item">
                <div className="detection-bullet">•</div>
                <div className={isRecyclable ? "recyclable-indicator" : "non-recyclable-indicator"}>
                  {isRecyclable ?
                    <CheckCircle size={22} className="indicator-green-icon" /> :
                    <AlertTriangle size={22} className="indicator-red-icon" />
                  }
                  {isRecyclable ? 'Recyclable' : '! Not Recyclable'}
                </div>
              </div>
              
              {materials.length > 0 && isRecyclable && (
                <div className="detection-item">
                  <div className="detection-bullet">•</div>
                  <div>Material: <span className="material-name">{materials[0]}</span></div>
                </div>
              )}

              {!isRecyclable && (
                <div className="detection-item">
                  <div className="detection-bullet">•</div>
                  <div>The uploaded item is not recyclable. Please dispose of it properly.</div>
                </div>
              )}
            </>
          ) : (
            <div className="no-items-detected">
              <div className="detection-bullet">•</div>
              <div>No items detected. Try another photo.</div>
            </div>
          )}
        </div>
      </div>

      {/* Reuse Materials Section - ONLY SHOWN FOR RECYCLABLE ITEMS */}
      {count > 0 && materials.length > 0 && isRecyclable && (
        <div className="reuse-materials-section">
          <button 
            onClick={toggleReuseTips} 
            className="reuse-materials-button"
          >
            <ListRestart size={30} className="reuse-icon" />
            Recommendations to Reuse {materials[0]}
            <ChevronsDown 
              size={24} 
              className={`arrow-icon ${showReuseTips ? 'open' : ''}`} 
              style={{ marginLeft: '8px' }}
            />
          </button>
          
          {(showReuseTips || isClosing) && (
            <div 
              ref={reuseTipsRef}
              className={`reuse-tips-container ${isClosing ? 'closing' : ''}`}
            >
              <ul className="reuse-tips-list">
                {reuseTips.map((tip, index) => (
                  <li key={index} className="reuse-tip-item">
                    <div className="reuse-tip-bullet">•</div>
                    <div className="reuse-tip-text">{tip}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Scan Another Item button */}
      <button onClick={handleScanAnother} className="scan-another-button">
        Scan Another Item
      </button>

      {/* Choice dialog modal */}
      {showChoiceDialog && count > 0 && isRecyclable && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Do you want to proceed with recycling these items and earn points for your recycling journey?</h3>
              <button
                onClick={handleSkipRecycle}
                className="modal-close-button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-actions">
              <button
                onClick={handleSkipRecycle}
                className="modal-button-secondary"
              >
                Just Checking
              </button>
              <button
                onClick={handleRecycleChoice}
                className="modal-button-primary"
              >
                Recycle & Earn Points
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quantity input dialog modal */}
      {showQuantityDialog && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Enter Quantity</h3>
              <button
                onClick={() => setShowQuantityDialog(false)}
                className="modal-close-button"
              >
                <X size={20} />
              </button>
            </div>

            <p>How many {materials.length > 0 ? materials[0] : 'item'}(s) are you recycling?</p>

            <div>
              <input
                type="number"
                value={itemQuantity}
                onChange={handleQuantityChange}
                placeholder="Enter quantity"
                className="quantity-input"
                min="1"
                onFocus={(e) => e.target.select()} // Select all text in the input box when it gains focus, to make replacement easier
              />
              {errorMessage && (
                <div className="error-message" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {errorMessage}
                </div>
              )}
            </div>

            <div>
              <p>You will be recycling: <strong>{weightKg.toFixed(2)} kg</strong> of {materials.length > 0 ? materials[0] : 'item'}(s)</p>
              <p>Carbon emissions saved: <strong>{carbonKg.toFixed(2)} kg·CO₂e </strong></p>
            </div>

            <div className="quantity-actions">
              <button
                onClick={() => setShowQuantityDialog(false)}
                className="modal-button-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRecycling}
                className="modal-button-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraStepTwo;