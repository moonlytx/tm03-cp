import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Camera, ImageDown, X } from 'lucide-react';
import './CaptureButton.css';

const ShareButton = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const captureScreenshot = async () => {
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

      // Convert canvas to data URL
      const imageData = canvas.toDataURL('image/png');
      
      // Set the preview image and show the modal
      setPreviewImage(imageData);
      setShowPreview(true);

    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadImage = () => {
    // Get the user name from localStorage, or use 'user' as default
    const userName = localStorage.getItem('userName') || 'user';
    // Format the date as YYYY-MM-DD
    const date = new Date().toISOString().slice(0, 10);
    // Create the new file name with the Point-of-You prefix, user name, and date
    const imageName = `Point-of-You_${userName}_${date}.png`;

    // Create a download link
    const link = document.createElement('a');
    link.download = imageName;
    link.href = previewImage;
    link.click();
    
    // Close the preview after download
    setShowPreview(false);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <>
      <div className="share-button-container">
        <button
          onClick={captureScreenshot}
          disabled={isCapturing}
          className="share-button"
        >
          <Camera size={22} className="share-button-icon" />
          {isCapturing ? 'Capturing...' : 'Carbon Capture'}
        </button>
      </div>

      {showPreview && (
        <div className="preview-overlay">
          <div className="preview-container">
            <div className="preview-header">
              <h3>Point of You Progress</h3>
              <button className="close-button-absolute" onClick={closePreview}>
                <X size={24} />
              </button>
            </div>
            <div className="preview-image-container">
              <img src={previewImage} alt="Preview" className="preview-image" />
            </div>
            <div className="share-options">
              <button className="share-option download" onClick={downloadImage}>
                <ImageDown size={24} className="option-icon" />
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;