import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Recycle, Trash2, AlertTriangle, ListRestart, ChevronsDown } from 'lucide-react';
import './CameraStepOne.css';
import './CameraStepTwo.css';
import useWasteData from '../../hooks/useWasteData';
import { Link, useNavigate } from 'react-router-dom';

function CameraStepTwo({ onNext, onReset, capturedData, dialogAlreadyShown = false, savedRecycleStatus = false,
  savedQuantity = 1 }) {
  const navigate = useNavigate();
  const [hasShownDialogs, setHasShownDialogs] = useState(dialogAlreadyShown);
  const [showReuseTips, setShowReuseTips] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const reuseTipsRef = useRef(null);
  const [showChoiceDialog, setShowChoiceDialog] = useState(false);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [itemQuantity, setItemQuantity] = useState('1'); 
  const [isRecycled, setIsRecycled] = useState(savedRecycleStatus);
  const [userQuantity, setUserQuantity] = useState(savedQuantity);
  const [errorMessage, setErrorMessage] = useState('');
  const { wasteItems, addItemAndSave } = useWasteData();

  // Process detections to get material information with highest confidence
  const processDetections = () => {
    if (!capturedData || !capturedData.detections || capturedData.detections.length === 0) {
      return { count: 0, materials: [], isRecyclable: false, recommendations: [] };
    }

    let highestConfidenceDetection = capturedData.detections[0];

    if (capturedData.detections.length > 1) {
      highestConfidenceDetection = capturedData.detections.reduce((prev, current) => {
        return (prev.confidence > current.confidence) ? prev : current;
      });
    }

    const material = highestConfidenceDetection.class;

    // Check if material is "Unrecyclable" or similar
    const isRecyclable = material && material.toLowerCase() !== "unrecyclable";

    // Extract recommendations from API response if they exist
    const recommendations = highestConfidenceDetection.recommendations ? 
      parseRecommendations(highestConfidenceDetection.recommendations) : [];

    return {
      count: 1, 
      materials: [material],
      isRecyclable,
      confidence: highestConfidenceDetection.confidence,
      recommendations
    };
  };

  // Parse recommendations from API response
  const parseRecommendations = (recommendationsStr) => {
    if (!recommendationsStr) return [];
    
    try {
      const items = recommendationsStr.split(/\d+\.\s+\*\*/).filter(item => item.trim());
      
      return items.map(item => {
        return item.replace(/^.*?\*\*\s*/, '').trim();
      }).filter(tip => tip); 
    } catch (e) {
      console.error("Error parsing recommendations:", e);
      return [];
    }
  };

  const { count, materials, isRecyclable, recommendations } = processDetections();

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
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setItemQuantity(value);
      setErrorMessage('');
    }
  };

  const handleSubmitRecycling = () => {
    if (itemQuantity === '') {
      setErrorMessage('Please enter the quantity of items you are recycling.');
      return;
    }

    const quantity = parseInt(itemQuantity);

    setShowQuantityDialog(false);
    setErrorMessage('');
    setIsRecycled(true);
    setUserQuantity(quantity);

    if (materials.length > 0) {
      const materialName = materials[0].toLowerCase();
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
      dialogShown: true 
    });
  };

  // Handle scan another item click
  const handleScanAnother = () => {
    if (onReset) {
      onReset();
    }
  };

  // Handle check points click - Navigate to ReportPage
  const handleCheckPoints = () => {
    // Navigate to the ReportPage
    navigate('/report');
  };

  // Modified toggle function for reuse tips with animation
  const toggleReuseTips = () => {
    if (showReuseTips) {
      setIsClosing(true);
      setTimeout(() => {
        setShowReuseTips(false);
        setIsClosing(false);
      }, 300); 
    } else {
      setShowReuseTips(true);
    }
  };

  const materialName = materials.length > 0 ? materials[0] : '';

  const quantity = itemQuantity === '' ? 0 : parseInt(itemQuantity);
  const { weightKg, carbonKg } = calculateEstimates(materialName, quantity);

  // Fallback recommendations if API doesn't provide any
  const getFallbackReuseTips = (material) => {
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
      return [];
    }
  };

  // Use API recommendations if available, otherwise fall back to our predefined ones
  const reuseTips = recommendations && recommendations.length > 0 ? 
    recommendations : getFallbackReuseTips(materialName);

  
    
  return (
    <div className="camera-interface">
      <h1 className="step-title">Analysis Results</h1>
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
        <div className="recycle-icon-container">
          {isRecyclable ?
            <Recycle size={100} color="#22c55e" /> :
            <Trash2 size={100} color="#ef4444" />
          }
        </div>

        <div className="detection-results green-background">
          {count > 0 ? (
            <>
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
                  <div>The uploaded item is deemed non-recyclable. Kindly dispose of it appropriately.</div>
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

      {count > 0 && materials.length > 0 && isRecyclable && (
        <div className="reuse-materials-section">
          <button 
            onClick={toggleReuseTips} 
            className="reuse-materials-button"
          >
            <ListRestart size={30} className="reuse-icon" />
            AI Recommendations to Reuse {materials[0]}
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

      <div className="action-buttons-container">
        <button onClick={handleScanAnother} className="next-step-button">
          Scan Another Item
        </button>
        <button onClick={handleCheckPoints} className="next-step-button">
          Progress Check
        </button>
      </div>

      {showChoiceDialog && count > 0 && isRecyclable && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Do you want to proceed with recycling these items and earn points for your recycling journey?</h3>
              <button
                onClick={handleSkipRecycle}
                className="modal-close-button"
              >
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

      {showQuantityDialog && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Enter Quantity</h3>
              <button
                onClick={() => setShowQuantityDialog(false)}
                className="modal-close-button"
              >
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