import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { ImageDown } from 'lucide-react';
import './ShareButton.css';

const ShareButton = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureAndDownload = async () => {
    try {
      setIsCapturing(true);
      
      // Find the element to capture - in this case, the entire waste dashboard
      const element = document.querySelector('.waste-container');
      
      if (!element) {
        throw new Error('Could not find the element to capture');
      }

      // Capture the element using html2canvas
      const canvas = await html2canvas(element, {
        logging: false,
        useCORS: true,
        scale: 2, // Higher scale for better quality
      });
      
      // Get the user name from localStorage, or use 'user' as default
      const userName = localStorage.getItem('userName') || 'user';
      // Format the date as YYYY-MM-DD
      const date = new Date().toISOString().slice(0, 10);
      // Create the new file name with the CarbonPatrol prefix, user name, and date
      const imageName = `Point-of-You_${userName}_${date}.db`;
      
      // Create a download link
      const link = document.createElement('a');
      link.download = imageName;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="share-button-container">
      <button 
        onClick={captureAndDownload}
        disabled={isCapturing}
        className="share-button"
      >
        <ImageDown size={22} className="share-button-icon" />
        {isCapturing ? 'Capturing...' : ' Save Image'}
      </button>
    </div>
  );
};

export default ShareButton;