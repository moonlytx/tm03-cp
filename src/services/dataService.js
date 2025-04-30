// Helper functions for saving and loading data

import { ArrowDownSquare, Axis3D } from "lucide-react";

export const exportDataAsDB = () => {
  const data = {
    wasteCounts: localStorage.getItem('wasteCounts'),
    accumulatedWeights: localStorage.getItem('accumulatedWeights'),
    userName: localStorage.getItem('userName'),
    totalCount: localStorage.getItem('totalCount'),
    wastebinCollected: localStorage.getItem('wastebinCollected'),
    totalWaste: localStorage.getItem('totalWaste'),
    totalAccumulatedWaste: localStorage.getItem('totalAccumulatedWaste'),
    totalCarbonEmission: localStorage.getItem('totalCarbonEmission'),
    version: '1.0',
    exportDate: new Date().toISOString()
  };

  const jsonData = JSON.stringify(data);
  const blob = new Blob([jsonData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  
  // Get the user name from localStorage, or use 'user' as default
  const userName = localStorage.getItem('userName') || 'user';
  
  // Format the date as YYYY-MM-DD
  const date = new Date().toISOString().slice(0, 10);
  
  // Create the new file name with the CarbonPatrol prefix, user name, and date
  const fileName = `Carbon-Patrol-Backup_${userName}_${date}.db`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return true;
};

export const importDataFromDB = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = event.target.result;
        const data = JSON.parse(jsonData);
        
        // Validate the data structure
        if (!data.version || !data.wasteCounts || !data.accumulatedWeights) {
          reject(new Error('Invalid file format. This doesn\'t appear to be a valid Progress DB file.'));
          return;
        }
        
        // Store data in localStorage
        if (data.wasteCounts) localStorage.setItem('wasteCounts', data.wasteCounts);
        if (data.accumulatedWeights) localStorage.setItem('accumulatedWeights', data.accumulatedWeights);
        if (data.userName) localStorage.setItem('userName', data.userName);
        if (data.totalCount) localStorage.setItem('totalCount', data.totalCount);
        if (data.wastebinCollected) localStorage.setItem('wastebinCollected', data.wastebinCollected);
        if (data.totalWaste) localStorage.setItem('totalWaste', data.totalWaste);
        if (data.totalAccumulatedWaste) localStorage.setItem('totalAccumulatedWaste', data.totalAccumulatedWaste);
        if (data.totalCarbonEmission) localStorage.setItem('totalCarbonEmission', data.totalCarbonEmission);
        
        resolve({
          success: true,
          message: 'Progress data imported successfully!',
          data
        });
      } catch (error) {
        reject(new Error(`Error reading file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};