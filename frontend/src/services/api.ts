const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Development logging
const isDevelopment = import.meta.env.DEV;

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (isDevelopment) {
    console.log(`API Response: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!response.ok) {
    if (isDevelopment) {
      console.error('API Error:', data);
    }
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Helper function to make authenticated requests
const authenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Include cookies for CORS
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (isDevelopment) {
    console.log(`API Request: ${config.method || 'GET'} ${API_BASE_URL}${url}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  return handleResponse(response);
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    register: async (userData: {
      name: string;
      email: string;
      password: string;
      location?: string;
      skillsOffered?: string[];
      skillsWanted?: string[];
      availability?: any;
      isPublic?: boolean;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },

  users: {
    getProfile: async () => {
      return authenticatedRequest('/users/me');
    },

    updateProfile: async (profileData: {
      name?: string;
      location?: string;
      profilePhoto?: string;
      skillsOffered?: string[];
      skillsWanted?: string[];
      availability?: any;
      isPublic?: boolean;
    }) => {
      return authenticatedRequest('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      });
    },

    searchBySkill: async (skill: string, page: number = 1, limit: number = 10) => {
      return authenticatedRequest(`/users/search?skill=${encodeURIComponent(skill)}&page=${page}&limit=${limit}`);
    },

    getUserById: async (userId: string) => {
      return authenticatedRequest(`/users/${userId}`);
    },

    getUserRating: async (userId: string) => {
      return authenticatedRequest(`/users/${userId}/rating`);
    },
  },

  swaps: {
    create: async (swapData: {
      toUser: string;
      offeredSkill: string;
      requestedSkill: string;
    }) => {
      return authenticatedRequest('/swaps', {
        method: 'POST',
        body: JSON.stringify(swapData),
      });
    },

    getUserSwaps: async (page: number = 1, limit: number = 10) => {
      return authenticatedRequest(`/swaps?page=${page}&limit=${limit}`);
    },

    acceptSwap: async (swapId: string) => {
      return authenticatedRequest(`/swaps/${swapId}/accept`, {
        method: 'PUT',
      });
    },

    rejectSwap: async (swapId: string) => {
      return authenticatedRequest(`/swaps/${swapId}/reject`, {
        method: 'PUT',
      });
    },

    deleteSwap: async (swapId: string) => {
      return authenticatedRequest(`/swaps/${swapId}`, {
        method: 'DELETE',
      });
    },

    submitFeedback: async (swapId: string, feedback: {
      rating: number;
      comment: string;
    }) => {
      return authenticatedRequest(`/swaps/${swapId}/feedback`, {
        method: 'POST',
        body: JSON.stringify(feedback),
      });
    },

    pollUpdates: async (since: string) => {
      return authenticatedRequest(`/swaps/poll?since=${encodeURIComponent(since)}`);
    },
  },
}; 