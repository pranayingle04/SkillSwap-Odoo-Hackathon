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
import { useLocalStorage } from './hooks/useLocalStorage';
import { mockUsers, mockSwapRequests, mockRatings } from './data/mockData';
import { User, SwapRequest, Rating } from './types';

function App() {
  const { authUser, isLoading: authLoading, login, register, logout, isAuthenticated } = useAuth();
  const [showHomePage, setShowHomePage] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currentView, setCurrentView] = useState('browse');
  const [users, setUsers] = useLocalStorage<User[]>('skillswap-users', mockUsers);
  const [swapRequests, setSwapRequests] = useLocalStorage<SwapRequest[]>('skillswap-requests', mockSwapRequests);
  const [ratings, setRatings] = useLocalStorage<Rating[]>('skillswap-ratings', mockRatings);

  const currentUser = authUser ? users.find(user => user.email === authUser.email) : null;

  useEffect(() => {
    if (authUser && !currentUser) {
      // Check if user profile exists, if not, they need to complete setup
      const existingUser = users.find(user => user.email === authUser.email);
      if (!existingUser) {
        // User needs to complete profile setup
        return;
      }
    }
  }, [authUser, currentUser, users]);

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

  const handleCompleteProfile = (profileData: {
    name: string;
    location?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string[];
    isPublic: boolean;
  }) => {
    if (!authUser) return;

    const newUser: User = {
      id: authUser.id,
      email: authUser.email,
      name: profileData.name,
      location: profileData.location,
      skillsOffered: profileData.skillsOffered,
      skillsWanted: profileData.skillsWanted,
      availability: profileData.availability,
      isPublic: profileData.isPublic,
      rating: 5.0,
      totalRatings: 0,
      joinedDate: new Date().toISOString(),
      isProfileComplete: true
    };

    setUsers([...users, newUser]);
  };
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const handleSendSwapRequest = (toUserId: string, skillOffered: string, skillWanted: string, message: string) => {
    if (!authUser) return;
    
    const newRequest: SwapRequest = {
      id: Date.now().toString(),
      fromUserId: authUser.id,
      toUserId,
      skillOffered,
      skillWanted,
      status: 'pending',
      message,
      createdAt: new Date().toISOString()
    };
    setSwapRequests([...swapRequests, newRequest]);
  };

  const handleAcceptRequest = (requestId: string) => {
    setSwapRequests(requests =>
      requests.map(req =>
        req.id === requestId
          ? { ...req, status: 'accepted' as const, completedAt: new Date().toISOString() }
          : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setSwapRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const handleDeleteRequest = (requestId: string) => {
    setSwapRequests(requests => requests.filter(req => req.id !== requestId));
  };

  const handleEndSession = (requestId: string) => {
    setSwapRequests(requests =>
      requests.map(req =>
        req.id === requestId
          ? { ...req, status: 'completed' as const, completedAt: new Date().toISOString() }
          : req
      )
    );
  };

  const handleSubmitRating = (swapRequestId: string, rating: number, feedback: string) => {
    if (!authUser) return;
    
    const swapRequest = swapRequests.find(req => req.id === swapRequestId);
    if (!swapRequest) return;

    const newRating: Rating = {
      id: Date.now().toString(),
      swapRequestId,
      fromUserId: authUser.id,
      toUserId: swapRequest.fromUserId === authUser.id ? swapRequest.toUserId : swapRequest.fromUserId,
      rating,
      feedback,
      createdAt: new Date().toISOString()
    };

    setRatings([...ratings, newRating]);

    // Update the rated user's average rating
    const ratedUserId = newRating.toUserId;
    const userRatings = [...ratings, newRating].filter(r => r.toUserId === ratedUserId);
    const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;

    setUsers(users.map(user =>
      user.id === ratedUserId
        ? { ...user, rating: avgRating, totalRatings: userRatings.length }
        : user
    ));
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

  // Show profile setup if user hasn't completed their profile
  if (authUser && !currentUser) {
    return (
      <ProfileSetup
        user={{
          id: authUser.id,
          email: authUser.email,
          name: authUser.name || 'User'
        }}
        onCompleteProfile={handleCompleteProfile}
      />
    );
  }

  // Show main app if user is authenticated and has completed profile
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading SkillSwap...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        currentUser={currentUser}
        onLogout={logout}
      />
      
      <main className="py-8">
        {currentView === 'browse' && (
          <BrowseSkills
            users={users}
            currentUser={currentUser}
            onSendSwapRequest={handleSendSwapRequest}
          />
        )}
        
        {currentView === 'profile' && (
          <UserProfile
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            isOwnProfile={true}
            ratings={ratings}
            swapRequests={swapRequests}
          />
        )}
        
        {currentView === 'requests' && (
          <SwapRequests
            swapRequests={swapRequests}
            users={users}
            currentUser={currentUser}
            onAcceptRequest={handleAcceptRequest}
            onRejectRequest={handleRejectRequest}
            onDeleteRequest={handleDeleteRequest}
            onEndSession={handleEndSession}
          />
        )}
        
        {currentView === 'ratings' && (
          <Ratings
            swapRequests={swapRequests}
            ratings={ratings}
            users={users}
            currentUser={currentUser}
            onSubmitRating={handleSubmitRating}
          />
        )}
      </main>
    </div>
  );
}

export default App;