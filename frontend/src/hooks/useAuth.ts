import { useState, useEffect } from 'react';
import { AuthUser, User } from '../types';

export function useAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem('skillswap-auth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuthUser(parsedAuth);
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('skillswap-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password combination
    // In a real app, this would validate against a backend
    if (email && password) {
      const user: AuthUser = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0], // Use email prefix as default name
        isAuthenticated: true
      };
      
      setAuthUser(user);
      localStorage.setItem('skillswap-auth', JSON.stringify(user));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any valid input
    if (email && password && name) {
      const user: AuthUser = {
        id: Date.now().toString(),
        email,
        name,
        isAuthenticated: true
      };
      
      setAuthUser(user);
      localStorage.setItem('skillswap-auth', JSON.stringify(user));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Please fill in all fields' };
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem('skillswap-auth');
    localStorage.removeItem('skillswap-users');
    localStorage.removeItem('skillswap-requests');
    localStorage.removeItem('skillswap-ratings');
  };

  return {
    authUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!authUser?.isAuthenticated
  };
}