import React, { useState, useEffect } from 'react';
import './IdentifyPage.css';

import CameraStepOne from '../components/IdentifyDashboard/CameraStepOne';
import CameraStepTwo from '../components/IdentifyDashboard/CameraStepTwo';

function IdentifyPage() {
  // Set required variables
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedData, setCapturedData] = useState(null);
  const [dialogShown, setDialogShown] = useState(false);
  const [recycleStatus, setRecycleStatus] = useState(false);
  const [recycleQuantity, setRecycleQuantity] = useState(1);
  const [fadeAnimation, setFadeAnimation] = useState('');
  
  // Handle obtained data and images
  useEffect(() => {
    console.log("Current dialogShown state:", dialogShown);
  }, [dialogShown]);

  const handleFirstStepComplete = (data) => {
    console.log("Data received from CameraInterface:", data);
    setCapturedData(data);
    
    // Add fade-out animation and then switch to step 2
    setFadeAnimation('fade-out');
    
    setTimeout(() => {
      setCurrentStep(2);
      // Reset the animation class after changing steps
      setTimeout(() => {
        setFadeAnimation('fade-in');
        setTimeout(() => {
          setFadeAnimation('');
        }, 500);
      }, 50);
    }, 500);
    
    setDialogShown(false);
  };

  const handleStepTwoComplete = (data) => {
    console.log("Recycling data received:", data);
    // Store the recycling data
    setRecycleStatus(data.recycled);
    setRecycleQuantity(data.quantity);
    if (data.dialogShown) {
      setDialogShown(true);
    }
  };

  const handleReset = () => {
    // Add fade-out animation and then switch back to step 1
    setFadeAnimation('fade-out');
    
    setTimeout(() => {
      setCurrentStep(1);
      setCapturedData(null);
      setDialogShown(false);
      
      // Reset the animation class after changing steps
      setTimeout(() => {
        setFadeAnimation('fade-in');
        setTimeout(() => {
          setFadeAnimation('');
        }, 500);
      }, 50);
    }, 500);
  };

  const handleLearnMore = () => {
    setDialogShown(true);
  };
  
  // Set up IdentifyPage
  return (
    <div className="waste-app">
      <div className="content-container identify-container">
        <header className="waste-header">
          <h1>Waste Type Identification</h1>
          <p>Computer Vision System for Waste Type Identification</p>
        </header>
        
        <div className={`step-container ${fadeAnimation}`}>
          {currentStep === 1 && (
            <CameraStepOne onNext={handleFirstStepComplete} />
          )}
          {currentStep === 2 && (
            <CameraStepTwo
              capturedData={capturedData}
              onNext={handleStepTwoComplete}
              onReset={handleReset}
              onLearnMore={handleLearnMore}
              dialogAlreadyShown={dialogShown}
              savedRecycleStatus={recycleStatus}
              savedQuantity={recycleQuantity}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default IdentifyPage;