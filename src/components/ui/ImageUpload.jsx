import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ImageUploadContainer = styled.div`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  
  ${ImageUploadContainer}:hover & {
    opacity: 1;
  }
`;

const UploadIcon = styled.span`
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: -10px;
  left: 10%;
  width: 80%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ImageUpload = ({
  imageUrl,
  onImageChange,
  size = 150,
  disabled = false,
  progress = 0,
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onImageChange(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  return (
    <ImageUploadContainer size={size}>
      <ProfileImage
        src={previewUrl || imageUrl || '/default-avatar.png'}
        alt="Profile"
        onError={(e) => {
          e.target.src = '/default-avatar.png';
        }}
      />
      
      {!disabled && (
        <>
          <UploadOverlay onClick={handleClick}>
            <UploadIcon>📷</UploadIcon>
          </UploadOverlay>
          
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </>
      )}
      
      {progress > 0 && progress < 100 && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}
    </ImageUploadContainer>
  );
};

ImageUpload.propTypes = {
  imageUrl: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
  size: PropTypes.number,
  disabled: PropTypes.bool,
  progress: PropTypes.number,
};

export default ImageUpload;