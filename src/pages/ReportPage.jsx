import React from 'react';
import { UserProfile, StatsCards, ProgressBar, TreeProgress, AccumulatedWeights }
  from '../components/ReportDashboard';
import ShareButton from '../components/ReportDashboard/ShareButton';
import useWasteData from '../hooks/useWasteData';
import './ReportPage.css';

const WasteDashboard = () => {
  const {
    wasteItems,
    isLoading,
    error,
    userName,
    isEditing,
    totalWaste,
    wastebinCollected,
    progressPercentage,
    counts,
    accumulatedWeights,
    totalAccumulatedWaste,
    totalCarbonEmission,
    hasUnsavedChanges,
    handleNameClick,
    handleNameSave,
    setUserName,
    incrementCount,
    decrementCount,
    saveData
  } = useWasteData();

  if (isLoading) return <div className="loading">Loading waste categories...</div>;
  if (error) return <div className="error">Error loading waste categories: {error}</div>;

  return (
    <div className="waste-app">
      <div className="container">
        <div className="content-container waste-container">
          <header className="waste-header">
            <h1>Point of You</h1>
            <p>Keep Track of Your Recycling Efforts to Save the Planet</p>
            {/* ShareButton positioned at the top right */}
            <ShareButton />
          </header>

          <main>
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

            <section className="progress-bar-container">
              <ProgressBar
                progressPercentage={progressPercentage}
                totalWaste={totalWaste}
              />
            </section>

            <section className="waste-categories">
              <TreeProgress
                wasteItems={wasteItems}
                counts={counts}
                progressPercentage={progressPercentage}
                incrementCount={incrementCount}
                decrementCount={decrementCount}
                saveData={saveData}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </section>

            <section className="accumulated-weights">
              <AccumulatedWeights
                wasteItems={wasteItems}
                accumulatedWeights={accumulatedWeights}
                totalAccumulatedWaste={totalAccumulatedWaste}
              />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WasteDashboard;