import React from 'react';
import { UserProfile, StatsCards, ProgressBar, TreeProgress, AccumulatedWeights } from '../components/ReportDashboard';
import CaptureButton from '../components/ReportDashboard/CaptureButton';
import SaveLoadButtons from '../components/ReportDashboard/SaveLoadButtons';
import useWasteData from '../hooks/useWasteData';
import './ReportPage.css';

const WasteDashboard = () => {
  // Fetch required variables
  const {
    wasteItems,
    isLoading,
    error,
    userName,
    isEditing,
    totalWaste,
    wastebinCollected,
    progressPercentage,
    accumulatedWeights,
    totalAccumulatedWaste,
    totalCarbonEmission,
    handleNameClick,
    handleNameSave,
    setUserName,
    handleSaveProgress,
    handleLoadProgress
  } = useWasteData();

  // Error message if cannot fetch details from API
  if (isLoading) return <div className="loading">Loading waste categories...</div>;
  if (error) return <div className="error">Error loading waste categories: {error}</div>;
  
  // Set up ReportPage
  return (
    <div className="waste-app">
      <div className="container">
        <div className="content-container waste-container">
          <header className="waste-header">
            <h1>Point of You</h1>
            <p>Keep Track of Your Contributions in Saving the Planet</p>
            <CaptureButton />
          </header>
          <main>
            {/* Feed details fetched from storage */}
            <section className="profile-stats-container">
              <UserProfile
                userName={userName}
                isEditing={isEditing}
                onNameClick={handleNameClick}
                onNameSave={handleNameSave}
                onNameChange={setUserName}
              />
              <StatsCards
                totalCarbonEmission={totalCarbonEmission}
                wastebinCollected={wastebinCollected}
              />
            </section>
            {/* Constantly update progress bar */}
            <section className="progress-bar-container">
              <ProgressBar
                progressPercentage={progressPercentage}
                totalWaste={totalWaste}
              />
            </section>
            {/* Update tree growth */}
            <section className="waste-categories">
              <TreeProgress
                progressPercentage={progressPercentage}
              />
            </section>
            {/* Print out accumulated weights */}
            <section className="accumulated-weights">
              <AccumulatedWeights
                wasteItems={wasteItems}
                accumulatedWeights={accumulatedWeights}
                totalAccumulatedWaste={totalAccumulatedWaste}
              />
            </section>
            {/* Place Save / Load buttons */}
            <div className="save-load-bottom-container">
              <SaveLoadButtons 
                onSave={handleSaveProgress} 
                onLoad={handleLoadProgress} 
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WasteDashboard;