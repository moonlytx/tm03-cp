import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, X, Upload, AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import blurry_example from '../../assets/images/IdentifyDashboard/blurry_example.png';
import clear_example from '../../assets/images/IdentifyDashboard/clear_example.png';
import camera from '../../assets/images/IdentifyDashboard/camera.png';
import './CameraStepOne.css';

function CameraStepOne({ onNext }) {
  const [showOptions, setShowOptions] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [currentFile, setCurrentFile] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // Default to back camera

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Show toast notification
  const showToast = (message, type = 'error') => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({ show: true, message, type });

    // Auto-hide toast after 5 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Hide toast
  const hideToast = () => {
    setToast({ show: false, message: '', type: '' });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  };

  const dataURLtoFile = (dataurl, filename = 'photo.png') => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Start the camera with specified facing mode
  const startCameraStream = async () => {
    try {
      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      showToast("Cannot access the camera, please check the permissions");
      setCameraActive(false);
    }
  };

  // Switch between front and back camera
  const switchCamera = () => {
    // Stop current stream
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }

    // Toggle facing mode
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');

    // Restart stream with new facing mode
    setTimeout(() => {
      startCameraStream();
    }, 300);
  };

  // Take a photo
  const takePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    // Flip horizontally if using front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);
    const photoURL = canvas.toDataURL('image/png');
    setCapturedPhoto(photoURL);
    setCurrentFile(dataURLtoFile(photoURL));
  };

  // Upload or send the captured photo
  const handleImageUpload = async (imageFile) => {
    if (!imageFile) {
      showToast("No image to upload. Please capture or select an image first.");
      return;
    }

    setLoading(true);
    setCurrentFile(imageFile); // Store the current file for retry capability

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("https://carbonpatrol.top:8081/detect_json", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.msg === "duplicate") {
        showToast("Duplicate image detected. Please try a different image.");
      } else if (data.detections) {
        hideToast(); // Hide any existing toast on success
        onNext({
          photoURL: capturedPhoto || URL.createObjectURL(imageFile),
          detections: data.detections
        });
      } else {
        showToast("Unknown response from server. Please try again.");
      }
    } catch (err) {
      showToast("Upload failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Retry the upload with the same file
  const handleRetry = () => {
    if (currentFile) {
      handleImageUpload(currentFile);
    } else {
      showToast("No image to retry. Please capture or select an image first.");
    }
  };

  // Clean up camera resources
  useEffect(() => {
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      // Clear any pending toast timeouts
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [videoStream]);

  return (
    <div className="camera-interface">
      <input
        type="file"
        accept="image/jpeg, image/png"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setCapturedPhoto(url);
            handleImageUpload(file);
          }
        }}
        style={{ display: "none" }}
      />

      {/* Toast notification */}
      {toast.show && (
        <div className="toast-notification" style={{
          backgroundColor: toast.type === 'error' ? '#fee2e2' : '#ecfdf5',
          color: toast.type === 'error' ? '#b91c1c' : '#047857',
        }}>
          <div style={{ flexShrink: 0 }}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          </div>
          <div style={{ flex: 1 }}>{toast.message}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {toast.type === 'error' && (
              <button
                onClick={handleRetry}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <RefreshCw size={18} />
              </button>
            )}
            <button
              onClick={hideToast}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: toast.type === 'error' ? '#b91c1c' : '#047857'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <h1 className="step-title">Step 1: Upload</h1>
      <p className="step-description">
        Click on "Start" and make sure to allow permission for camera
      </p>

      {/* Camera or image preview area */}
      <div className="camera-display">
        {cameraActive ? (
          !capturedPhoto ? (
            <>
              <video ref={videoRef} autoPlay playsInline className="camera-preview" />
              <button
                onClick={switchCamera}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 5
                }}
              >
                <RefreshCw size={24} color="#166534" />
              </button>
            </>
          ) : (
            <img src={capturedPhoto} alt="Captured result" className="photo-preview" />
          )
        ) : (
          <div className="camera-placeholder">
            <img
              src={camera}
              alt="Camera"
              className="camera-icon"
            />
            <p style={{ color: '#64748b', marginTop: '16px', fontSize: '1.1rem' }}>
              Tap to start camera or upload an image
            </p>
          </div>
        )}
      </div>

      {/* Action button group */}
      {!cameraActive ? (
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="start-button"
          disabled={loading}
        >
          {loading ? "Scanning..." : "Start"}
        </button>
      ) : (
        <div className="camera-controls">
          {!capturedPhoto ? (
            <>
              <button onClick={takePhoto} className="capture-button">
                <Camera size={20} style={{ marginRight: '8px' }} />
                Capture
              </button>
              <button
                onClick={() => {
                  setCameraActive(false);
                  videoStream?.getTracks().forEach(track => track.stop());
                }}
                className="cancel-button"
              >
                <X size={20} style={{ marginRight: '8px' }} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleImageUpload(currentFile)}
                className="confirm-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div style={{ width: '20px', height: '20px', marginRight: '8px', animation: 'spin 1s linear infinite' }}>
                      <RefreshCw size={20} />
                    </div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={20} style={{ marginRight: '8px' }} />
                    Confirm Use
                  </>
                )}
              </button>
              <button
                onClick={() => setCapturedPhoto(null)}
                className="retry-button"
                disabled={loading}
              >
                <RefreshCw size={20} style={{ marginRight: '8px' }} />
                Retake
              </button>
            </>
          )}
        </div>
      )}

      {/* Options menu (Upload/Take photo) */}
      {showOptions && (
        <div className="options-menu">
          <button
            onClick={() => {
              fileInputRef.current.click();
              setShowOptions(false);
            }}
            className="option-button"
          >
            <Upload size={18} style={{ marginRight: '8px' }} /> Upload Image
          </button>
          <button
            onClick={() => {
              setCameraActive(true);
              startCameraStream();
              setShowOptions(false);
            }}
            className="option-button"
          >
            <Camera size={18} style={{ marginRight: '8px' }} /> Take Photo
          </button>
        </div>
      )}

      {/* Unified Warning and Examples Frame */}
      <div className="unified-frame">
        {/* Warning Notes Section */}
        <div className="warning-notes">
          {/* First Warning Note */}
          <div className="warning-note">
            <AlertTriangle size={40} className="warning-icon" />
            <span className="warning-text">
              Note: Preferably one item at a time for better result
            </span>
          </div>

          {/* Second Warning Note */}
          <div className="warning-note">
            <AlertTriangle size={40} className="warning-icon" />
            <span className="warning-text">
              Ensure that the scanned image is clear and visible
            </span>
          </div>
        </div>

        {/* Examples Section */}
        <h3 className="examples-title">Example</h3>

        <div className="examples-column">
          {/* Clear Example */}
          <div className="example-item">
            <p className="example-label">Clear</p>
            <div className="example-image-container" style={{ position: 'relative' }}>
              <img
                src={clear_example}
                alt="Clear example"
                className="example-image"
              />
              <div style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                backgroundColor: '#22c55e',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <Check size={30} color="white" />
              </div>
            </div>
          </div>

          {/* Blurry Example */}
          <div className="example-item">
            <p className="example-label">Blurry</p>
            <div className="example-image-container" style={{ position: 'relative' }}>
              <img
                src={blurry_example}
                alt="Blurry example"
                className="example-image"
              />
              <div style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                <X size={30} color="white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CameraStepOne;