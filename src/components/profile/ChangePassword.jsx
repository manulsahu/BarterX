import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Key, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Container = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 30px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #444;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  padding: 14px 50px 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
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

const ToggleVisibility = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #333;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SuccessMessage = styled.div`
  color: #38a169;
  font-size: 0.875rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PasswordRequirements = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-top: 10px;
`;

const RequirementTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1rem;
`;

const RequirementList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
  color: #666;
`;

const RequirementItem = styled.li`
  margin-bottom: 5px;
  font-size: 0.9rem;
  
  &.valid {
    color: #38a169;
  }
  
  &.invalid {
    color: #e53e3e;
  }
`;

const Button = styled.button`
  padding: 14px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChangePassword = ({ onChangePassword, loading = false }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    return {
      ...requirements,
      isValid: Object.values(requirements).every(Boolean),
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors
    setErrors(prev => ({
      ...prev,
      [name]: undefined,
    }));
    
    // Clear success message
    if (success) setSuccess(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordValidation = validatePassword(formData.newPassword);
      if (!passwordValidation.isValid) {
        newErrors.newPassword = 'Password does not meet requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Call onChangePassword
    const result = await onChangePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
    
    if (result.success) {
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setErrors({
        form: result.error || 'Failed to change password',
      });
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <Container>
      <Title>
        <Key size={24} />
        Change Password
      </Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Current Password</Label>
          <InputWrapper>
            <Input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your current password"
            />
            <ToggleVisibility
              type="button"
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </ToggleVisibility>
          </InputWrapper>
          {errors.currentPassword && (
            <ErrorMessage>{errors.currentPassword}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>New Password</Label>
          <InputWrapper>
            <Input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Enter your new password"
            />
            <ToggleVisibility
              type="button"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </ToggleVisibility>
          </InputWrapper>
          
          <PasswordRequirements>
            <RequirementTitle>Password Requirements:</RequirementTitle>
            <RequirementList>
              <RequirementItem className={passwordValidation.minLength ? 'valid' : 'invalid'}>
                At least 8 characters long
              </RequirementItem>
              <RequirementItem className={passwordValidation.hasUpperCase ? 'valid' : 'invalid'}>
                At least one uppercase letter
              </RequirementItem>
              <RequirementItem className={passwordValidation.hasLowerCase ? 'valid' : 'invalid'}>
                At least one lowercase letter
              </RequirementItem>
              <RequirementItem className={passwordValidation.hasNumber ? 'valid' : 'invalid'}>
                At least one number
              </RequirementItem>
              <RequirementItem className={passwordValidation.hasSpecialChar ? 'valid' : 'invalid'}>
                At least one special character
              </RequirementItem>
            </RequirementList>
          </PasswordRequirements>
          
          {errors.newPassword && (
            <ErrorMessage>{errors.newPassword}</ErrorMessage>
          )}
        </FormGroup>
        
        <FormGroup>
          <Label>Confirm New Password</Label>
          <InputWrapper>
            <Input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="Confirm your new password"
            />
            <ToggleVisibility
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </ToggleVisibility>
          </InputWrapper>
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}
        </FormGroup>
        
        {errors.form && (
          <ErrorMessage>{errors.form}</ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage>
            <CheckCircle size={16} />
            Password changed successfully!
          </SuccessMessage>
        )}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </Form>
    </Container>
  );
};

ChangePassword.propTypes = {
  onChangePassword: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ChangePassword;