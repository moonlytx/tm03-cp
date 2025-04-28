import React from 'react';
import defaultAvatar from '../../assets/images/ReportDashboard/default_avatar.png';
import './UserProfile.css';

const UserProfile = ({ userName, isEditing, onNameClick, onNameSave, onNameChange }) => (
  <div className="user-profile">
    <div className="profile-avatar">
      <img
        src={defaultAvatar}
        alt="User Avatar"
        className="avatar-image"
      />
    </div>
    <div className="user-name-container">
      <h2 className="user-name" onClick={onNameClick}>
        {userName}
      </h2>
      {isEditing && (
        <div className="input-overlay">
          <input
            type="text"
            value={userName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={onNameSave}
            onBlur={onNameSave}
            autoFocus
            className="user-name-input"
          />
        </div>
      )}
    </div>
  </div>
);

export default UserProfile;