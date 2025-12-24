import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { X, Save } from 'lucide-react';
import { validateProfileForm } from '../../utils/validators';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 30px 30px 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.8rem;
  color: #333;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #444;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    background: #f9f9f9;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 4px;
`;

const ModalFooter = styled.div`
  padding: 20px 30px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 30px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
  
  &:hover:not(:disabled) {
    background: #eaeaea;
  }
`;

const EditProfileModal = ({
  profile,
  isOpen,
  onClose,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    preferences: {},
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        preferences: profile.preferences || {},
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateProfileForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Call save function
    const result = await onSave(formData);
    
    // If save successful, close modal
    if (result?.success) {
      onClose();
    } else if (result?.error) {
      // Handle save error
      setErrors(prev => ({
        ...prev,
        form: result.error,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Edit Profile</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                {errors.firstName && (
                  <ErrorMessage>{errors.firstName}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                {errors.lastName && (
                  <ErrorMessage>{errors.lastName}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                placeholder="+1 (123) 456-7890"
              />
              {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
                placeholder="City, Country"
              />
              {errors.location && (
                <ErrorMessage>{errors.location}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="bio">Bio</Label>
              <TextArea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                textAlign: 'right',
                marginTop: '5px',
              }}>
                {formData.bio.length}/500 characters
              </div>
            </FormGroup>
            
            {errors.form && (
              <ErrorMessage style={{ textAlign: 'center' }}>
                {errors.form}
              </ErrorMessage>
            )}
          </Form>
        </ModalBody>
        
        <ModalFooter>
          <CancelButton
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </CancelButton>
          
          <SaveButton
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </SaveButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

EditProfileModal.propTypes = {
  profile: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default EditProfileModal;