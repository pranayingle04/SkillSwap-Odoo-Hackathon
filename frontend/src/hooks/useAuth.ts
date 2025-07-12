import { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { api } from '../services/api';

export function useAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem('skillswap-auth');
    const token = localStorage.getItem('token');
    
    if (savedAuth && token) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuthUser(parsedAuth);
      } catch (error) {
        console.error('Error parsing saved auth:', error);
        localStorage.removeItem('skillswap-auth');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const data = await api.auth.login(email, password);
      
      const user: AuthUser = {
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        isAuthenticated: true
      };
      
      setAuthUser(user);
      localStorage.setItem('skillswap-auth', JSON.stringify(user));
      localStorage.setItem('token', data.token);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const data = await api.auth.register({ name, email, password });
      
      const user: AuthUser = {
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        isAuthenticated: true
      };
      
      setAuthUser(user);
      localStorage.setItem('skillswap-auth', JSON.stringify(user));
      localStorage.setItem('token', data.token);
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem('skillswap-auth');
    localStorage.removeItem('token');
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