import React from 'react';
import './TreeProgress.css';

// Import all tree stage images
import tree0 from '../../assets/images/ReportDashboard/growing_tree/1.jpg';  
import tree1 from '../../assets/images/ReportDashboard/growing_tree/2.jpg';
import tree2 from '../../assets/images/ReportDashboard/growing_tree/3.jpg';
import tree3 from '../../assets/images/ReportDashboard/growing_tree/4.jpg';
import tree4 from '../../assets/images/ReportDashboard/growing_tree/5.jpg';
import tree5 from '../../assets/images/ReportDashboard/growing_tree/6.jpg';
import tree6 from '../../assets/images/ReportDashboard/growing_tree/7.jpg';
import tree7 from '../../assets/images/ReportDashboard/growing_tree/8.jpg';
import tree8 from '../../assets/images/ReportDashboard/growing_tree/9.jpg';
import tree9 from '../../assets/images/ReportDashboard/growing_tree/10.jpg';

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

const TreeProgress = ({
  progressPercentage,
  saveData,
  hasUnsavedChanges
}) => (
  <div className="tree-progress-container">
    <div className="tree-container">
      <div className="tree-section">
        <img
          src={getTreeImage(progressPercentage)}
          alt={`Tree growth stage ${Math.floor(progressPercentage / 10)}`}
          className={`tree-image ${progressPercentage < 10 ? 'tree-image-small' : ''}`}
        />
      </div>
    </div>
  </div>
);

export default TreeProgress;