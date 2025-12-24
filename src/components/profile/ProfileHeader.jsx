import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Edit2, Camera, MapPin, Calendar } from 'lucide-react';
import ImageUpload from '../ui/ImageUpload';
import cloudinaryService from '../../services/cloudinary.service';

const HeaderContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  position: relative;
  margin-bottom: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UserBio = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const UserMeta = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  opacity: 0.8;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, background 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProfileHeader = ({
  profile,
  stats,
  onEditClick,
  onImageChange,
  updating = false,
  uploadProgress = 0,
}) => {
  const [uploading, setUploading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <HeaderContainer>
      <ActionButtons>
        <ActionButton
          onClick={onEditClick}
          disabled={updating}
          title="Edit Profile"
        >
          <Edit2 size={20} />
        </ActionButton>
      </ActionButtons>
      
      <HeaderContent>
        <ImageUpload
          imageUrl={profile?.profilePicture}
          onImageChange={onImageChange}
          size={180}
          disabled={uploading || updating}
          progress={uploadProgress}
        />
        
        <ProfileInfo>
          <UserName>
            {profile?.firstName} {profile?.lastName}
            {profile?.verified && (
              <span style={{ marginLeft: '10px', fontSize: '1.2rem' }}>✓</span>
            )}
          </UserName>
          
          {profile?.bio && <UserBio>{profile.bio}</UserBio>}
          
          <UserMeta>
            {profile?.location && (
              <MetaItem>
                <MapPin size={16} />
                <span>{profile.location}</span>
              </MetaItem>
            )}
            
            <MetaItem>
              <Calendar size={16} />
              <span>Joined {formatDate(profile?.createdAt)}</span>
            </MetaItem>
          </UserMeta>
        </ProfileInfo>
      </HeaderContent>
      
      {stats && (
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalItems || 0}</StatValue>
            <StatLabel>Items Listed</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{stats.successfulTrades || 0}</StatValue>
            <StatLabel>Trades Completed</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatValue>{stats.tradeRating || 'No ratings'}</StatValue>
            <StatLabel>Trade Rating</StatLabel>
          </StatCard>
        </StatsGrid>
      )}
    </HeaderContainer>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.object,
  stats: PropTypes.object,
  onEditClick: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  updating: PropTypes.bool,
  uploadProgress: PropTypes.number,
};

export default ProfileHeader;