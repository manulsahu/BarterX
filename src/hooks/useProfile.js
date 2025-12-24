import { useState, useEffect, useCallback } from 'react';
import profileService from '../services/profile.service';

export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await profileService.getProfile(userId);
      if (result.success) {
        setProfile(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    
    try {
      const result = await profileService.getUserStats(userId);
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [userId]);

  const updateProfile = async (profileData) => {
    setUpdating(true);
    setError(null);
    
    try {
      const result = await profileService.updateProfile(userId, profileData);
      if (result.success) {
        setProfile(result.data);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to update profile';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUpdating(false);
    }
  };

  const updateProfilePicture = async (imageFile) => {
    setUpdating(true);
    setError(null);
    
    try {
      const result = await profileService.updateProfilePicture(userId, imageFile);
      if (result.success) {
        setProfile(result.data);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to update profile picture';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUpdating(false);
    }
  };

  const changePassword = async (passwordData) => {
    setError(null);
    
    try {
      const result = await profileService.changePassword(userId, passwordData);
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMsg = 'Failed to change password';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchStats();
    }
  }, [userId, fetchProfile, fetchStats]);

  return {
    profile,
    stats,
    loading,
    error,
    updating,
    updateProfile,
    updateProfilePicture,
    changePassword,
    refreshProfile: fetchProfile,
    refreshStats: fetchStats,
  };
};