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
      const element = document.querySelector('.waste-container');
      if (!element) {
        throw new Error('Could not find the element to capture');
      }
      const canvas = await html2canvas(element, {
        logging: false,
        useCORS: true,
        scale: 2,
      });
      const imageData = canvas.toDataURL('image/png');
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
    const userName = localStorage.getItem('userName') || 'user';
    const date = new Date().toISOString().slice(0, 10);
    const imageName = `Point-of-You_${userName}_${date}.png`;

    // Create a download link
    const link = document.createElement('a');
    link.download = imageName;
    link.href = previewImage;
    link.click();
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
                <ImageDown size={24} className="share-option-icon" />
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