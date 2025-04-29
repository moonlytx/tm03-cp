import React, { useState, useEffect } from 'react';
import './IdentifyPage.css';
import { toast } from 'react-toastify';
import useWasteData from '../hooks/useWasteData';
import CameraStepOne from '../components/IdentifyDashboard/CameraStepOne';
import CameraStepTwo from '../components/IdentifyDashboard/CameraStepTwo';
import RecyclingSteps from '../components/IdentifyDashboard/RecyclingSteps';

function IdentifyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedData, setCapturedData] = useState(null);
  const [showRecyclingSteps, setShowRecyclingSteps] = useState(false);
  const [localCounts, setLocalCounts] = useState({});
  const [dialogShown, setDialogShown] = useState(false);
  const [recycleStatus, setRecycleStatus] = useState(false);
  const [recycleQuantity, setRecycleQuantity] = useState(1);

  // 调试输出
  useEffect(() => {
    console.log("Current dialogShown state:", dialogShown);
  }, [dialogShown]);

  const handleFirstStepComplete = (data) => {
    console.log("Data received from CameraInterface:", data);
    setCapturedData(data);
    setCurrentStep(2);
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

    setShowRecyclingSteps(true);
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRecyclingStepsBack = () => {
    setShowRecyclingSteps(false);
  };

  const handleLearnMore = () => {
    setDialogShown(true);
    setShowRecyclingSteps(true);
  };

  return (
    <div className="waste-app">
      <div className="content-container identify-container">
      <header className="waste-header">
          <h1>Waste Type Identification</h1>
          <p>Computer Vision System for Waste Type Identification</p>
        </header>
        
        {showRecyclingSteps ? (
          <RecyclingSteps onBack={handleRecyclingStepsBack} />
        ) : (
          <>
            {currentStep === 1 && (
              <CameraStepOne onNext={handleFirstStepComplete} />
            )}
            {currentStep === 2 && (
              <CameraStepTwo
                capturedData={capturedData}
                onNext={handleStepTwoComplete}
                onPrevious={handlePrevious}
                onLearnMore={handleLearnMore}
                dialogAlreadyShown={dialogShown}
                savedRecycleStatus={recycleStatus}
                savedQuantity={recycleQuantity}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default IdentifyPage;