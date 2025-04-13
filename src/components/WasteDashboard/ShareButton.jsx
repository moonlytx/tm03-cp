// ShareButton.jsx
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Share2 } from 'lucide-react';
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

      // Create a download link
      const link = document.createElement('a');
      link.download = `point-of-you-dashboard-${new Date().toISOString().split('T')[0]}.png`;
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
        <Share2 size={16} className="share-button-icon" />
        {isCapturing ? 'Capturing...' : 'Share as Image'}
      </button>
    </div>
  );
};

export default ShareButton;