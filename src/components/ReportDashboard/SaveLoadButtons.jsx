import React, { useRef } from 'react';
import { Save, Upload } from 'lucide-react';
import './SaveLoadButtons.css';

const SaveLoadButtons = ({ onSave, onLoad }) => {
  const fileInputRef = useRef(null);
  
  const handleSaveClick = () => {
    onSave();
  };
  
  const handleLoadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onLoad(file);
      // Reset the file input
      e.target.value = '';
    }
  };
  
  return (
    <div className="save-load-buttons-container">
      <button
        onClick={handleSaveClick}
        className="save-button"
      >
        <Save size={18} />
        <span>Save Progress</span>
      </button>
      
      <button
        onClick={handleLoadClick}
        className="load-button"
      >
        <Upload size={18} />
        <span>Load Progress</span>
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".db"
        className="file-input"
      />
    </div>
  );
};

export default SaveLoadButtons;