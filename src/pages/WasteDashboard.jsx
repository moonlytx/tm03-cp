import React from 'react';
import { UserProfile, StatsCards, ProgressBar, WasteCategories, AccumulatedWeights }
  from '../components/WasteDashboard';
import ShareButton from '../components/WasteDashboard/ShareButton';
import useWasteData from '../hooks/useWasteData';
import './WasteDashboard.css';

const WasteDashboard = () => {
  const {
    wasteItems,
    isLoading,
    error,
    userName,
    isEditing,
    totalWaste,
    totalCount,
    plantsSaved,
    progressPercentage,
    counts,
    accumulatedWeights,
    totalAccumulatedWaste,
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
            <p>Keep track of your recycling efforts to save the planet.</p>
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
                plantsSaved={plantsSaved}
                totalCount={totalCount}
              />
            </section>

            <section className="progress-bar-container">
              <ProgressBar
                progressPercentage={progressPercentage}
                totalWaste={totalWaste}
              />
            </section>

            <section className="waste-categories">
              <WasteCategories
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
            
            {/* Removed ShareButton from here */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default WasteDashboard;