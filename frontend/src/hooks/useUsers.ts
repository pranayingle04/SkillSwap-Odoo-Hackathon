import { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUsersBySkill = async (skill: string, page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.users.searchBySkill(skill, page);
      
      // Transform backend user data to frontend format
      const transformedUsers: User[] = data.users.map((user: any) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        profilePhoto: user.profilePhoto,
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability ? 
          Object.entries(user.availability)
            .filter(([_, value]) => value === true)
            .map(([key]) => key) : [],
        isPublic: user.isPublic,
        rating: 5.0, // Default rating, will be updated by rating hook
        totalRatings: 0,
        joinedDate: user.createdAt,
        isProfileComplete: true
      }));
      
      setUsers(transformedUsers);
      return { users: transformedUsers, total: data.total, totalPages: data.totalPages };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search users');
      return { users: [], total: 0, totalPages: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserById = async (userId: string): Promise<User | null> => {
    try {
      const user = await api.users.getUserById(userId);
      
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        profilePhoto: user.profilePhoto,
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability ? 
          Object.entries(user.availability)
            .filter(([_, value]) => value === true)
            .map(([key]) => key) : [],
        isPublic: user.isPublic,
        rating: 5.0,
        totalRatings: 0,
        joinedDate: user.createdAt,
        isProfileComplete: true
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get user');
      return null;
    }
  };

  const updateUserProfile = async (profileData: {
    name?: string;
    location?: string;
    profilePhoto?: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
    availability?: any;
    isPublic?: boolean;
  }) => {
    try {
      const updatedUser = await api.users.updateProfile(profileData);
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser._id 
            ? {
                ...user,
                name: updatedUser.name,
                location: updatedUser.location,
                profilePhoto: updatedUser.profilePhoto,
                skillsOffered: updatedUser.skillsOffered || [],
                skillsWanted: updatedUser.skillsWanted || [],
                availability: updatedUser.availability ? 
                  Object.entries(updatedUser.availability)
                    .filter(([_, value]) => value === true)
                    .map(([key]) => key) : [],
                isPublic: updatedUser.isPublic
              }
            : user
        )
      );
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  return {
    users,
    isLoading,
    error,
    searchUsersBySkill,
    getUserById,
    updateUserProfile
  };
} 