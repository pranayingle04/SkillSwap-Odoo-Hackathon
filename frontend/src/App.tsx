import React, { useState, useEffect } from 'react';
import { HomePage } from './components/Home/HomePage';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { ProfileSetup } from './components/Profile/ProfileSetup';
import { Header } from './components/Header';
import { UserProfile } from './components/UserProfile';
import { BrowseSkills } from './components/BrowseSkills';
import { SwapRequests } from './components/SwapRequests';
import { Ratings } from './components/Ratings';
import { useAuth } from './hooks/useAuth';
import { useUsers } from './hooks/useUsers';
import { useSwaps } from './hooks/useSwaps';
import { User, SwapRequest, Rating } from './types';
import { api } from './services/api';

function App() {
  const { authUser, isLoading: authLoading, login, register, logout, isAuthenticated } = useAuth();
  const { users, searchUsersBySkill, updateUserProfile } = useUsers();
  const { swapRequests, loadUserSwaps, createSwapRequest, acceptSwap, rejectSwap, deleteSwap, submitFeedback } = useSwaps();
  
  const [showHomePage, setShowHomePage] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currentView, setCurrentView] = useState('browse');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Load user profile when authenticated
  useEffect(() => {
    if (authUser && isAuthenticated) {
      loadUserProfile();
    }
  }, [authUser, isAuthenticated]);

  // Load swaps when user is authenticated
  useEffect(() => {
    if (authUser && isAuthenticated) {
      loadUserSwaps();
    }
  }, [authUser, isAuthenticated]);

  const loadUserProfile = async () => {
    try {
      const profile = await api.users.getProfile();
      
      const user: User = {
        id: profile._id,
        name: profile.name,
        email: profile.email,
        location: profile.location,
        profilePhoto: profile.profilePhoto,
        skillsOffered: profile.skillsOffered || [],
        skillsWanted: profile.skillsWanted || [],
        availability: profile.availability ? 
          Object.entries(profile.availability)
            .filter(([_, value]) => value === true)
            .map(([key]) => key) : [],
        isPublic: profile.isPublic,
        rating: 5.0,
        totalRatings: 0,
        joinedDate: profile.createdAt,
        isProfileComplete: true
      };
      
      setCurrentUser(user);
      setIsProfileComplete(true);
    } catch (error) {
      // User profile not complete, needs setup
      setIsProfileComplete(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setAuthError(result.error || 'Login failed');
    }
    setIsAuthLoading(false);
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    setIsAuthLoading(true);
    setAuthError('');
    
    const result = await register(email, password, name);
    if (!result.success) {
      setAuthError(result.error || 'Registration failed');
    }
    setIsAuthLoading(false);
  };

  const handleCompleteProfile = async (profileData: {
    name: string;
    location?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string[];
    isPublic: boolean;
  }) => {
    try {
      // Convert availability array to backend format
      const availability = {
        weekends: profileData.availability.includes('Weekends'),
        evenings: profileData.availability.includes('Evenings'),
        custom: profileData.availability.find(a => !['Weekends', 'Evenings'].includes(a)) || ''
      };

      await updateUserProfile({
        name: profileData.name,
        location: profileData.location,
        skillsOffered: profileData.skillsOffered,
        skillsWanted: profileData.skillsWanted,
        availability,
        isPublic: profileData.isPublic
      });

      // Reload user profile
      await loadUserProfile();
    } catch (error) {
      console.error('Failed to complete profile:', error);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const availability = {
        weekends: updatedUser.availability.includes('Weekends'),
        evenings: updatedUser.availability.includes('Evenings'),
        custom: updatedUser.availability.find(a => !['Weekends', 'Evenings'].includes(a)) || ''
      };

      await updateUserProfile({
        name: updatedUser.name,
        location: updatedUser.location,
        profilePhoto: updatedUser.profilePhoto,
        skillsOffered: updatedUser.skillsOffered,
        skillsWanted: updatedUser.skillsWanted,
        availability,
        isPublic: updatedUser.isPublic
      });

      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleSendSwapRequest = async (toUserId: string, skillOffered: string, skillWanted: string, message: string) => {
    try {
      await createSwapRequest(toUserId, skillOffered, skillWanted);
    } catch (error) {
      console.error('Failed to send swap request:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptSwap(requestId);
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectSwap(requestId);
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteSwap(requestId);
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const handleSubmitRating = async (swapRequestId: string, rating: number, feedback: string) => {
    try {
      await submitFeedback(swapRequestId, rating, feedback);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    }
  };

  const handleSearchUsers = async (skill: string) => {
    try {
      await searchUsersBySkill(skill);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading SkillSwap...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show home page if not authenticated and showHomePage is true
  if (!isAuthenticated && showHomePage) {
    return (
      <HomePage onGetStarted={() => setShowHomePage(false)} />
    );
  }

  // Show authentication forms if not logged in
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => {
            setAuthView('register');
            setAuthError('');
          }}
          onBackToHome={() => setShowHomePage(true)}
          isLoading={isAuthLoading}
          error={authError}
        />
      );
    } else {
      return (
        <RegisterForm
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setAuthView('login');
            setAuthError('');
          }}
          onBackToHome={() => setShowHomePage(true)}
          isLoading={isAuthLoading}
          error={authError}
        />
      );
    }
  }

  // Show profile setup if user is authenticated but profile is not complete
  if (isAuthenticated && !isProfileComplete) {
    return (
      <ProfileSetup
        user={authUser!}
        onCompleteProfile={handleCompleteProfile}
      />
    );
  }

  // Main app interface
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        currentUser={currentUser}
        onLogout={logout}
      />

      <main className="py-6">
        {currentView === 'browse' && (
          <BrowseSkills
            users={users}
            currentUser={currentUser!}
            onSendSwapRequest={handleSendSwapRequest}
            onSearchUsers={handleSearchUsers}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <UserProfile
            user={currentUser}
            onUpdateUser={handleUpdateUser}
          />
        )}

        {currentView === 'requests' && (
          <SwapRequests
            swapRequests={swapRequests}
            currentUser={currentUser!}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onDeleteRequest={handleDeleteRequest}
          />
        )}

        {currentView === 'ratings' && (
          <Ratings
            swapRequests={swapRequests}
            currentUser={currentUser!}
            onSubmitRating={handleSubmitRating}
          />
        )}
      </main>
    </div>
  );
}

export default App;