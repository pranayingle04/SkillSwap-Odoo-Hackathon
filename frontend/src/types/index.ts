export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalRatings: number;
  joinedDate: string;
  isProfileComplete: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  createdAt: string;
  completedAt?: string;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isAuthenticated: boolean;
}