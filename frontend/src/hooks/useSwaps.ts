import { useState, useEffect } from 'react';
import { SwapRequest } from '../types';
import { api } from '../services/api';

export function useSwaps() {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserSwaps = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await api.swaps.getUserSwaps(page);
      
      // Transform backend swap data to frontend format
      const transformedSwaps: SwapRequest[] = data.swaps.map((swap: any) => ({
        id: swap._id,
        fromUserId: swap.fromUser._id,
        toUserId: swap.toUser._id,
        skillOffered: swap.offeredSkill,
        skillWanted: swap.requestedSkill,
        status: swap.status,
        message: '', // Backend doesn't have message field, will need to be added
        createdAt: swap.createdAt,
        completedAt: swap.updatedAt // Using updatedAt as completedAt for now
      }));
      
      setSwapRequests(transformedSwaps);
      return { swaps: transformedSwaps, total: data.total, totalPages: data.totalPages };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load swaps');
      return { swaps: [], total: 0, totalPages: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  const createSwapRequest = async (toUserId: string, skillOffered: string, skillWanted: string) => {
    try {
      const data = await api.swaps.create({
        toUser: toUserId,
        offeredSkill: skillOffered,
        requestedSkill: skillWanted
      });
      
      // Add the new swap to local state
      const newSwap: SwapRequest = {
        id: data.swap._id,
        fromUserId: data.swap.fromUser,
        toUserId: data.swap.toUser,
        skillOffered: data.swap.offeredSkill,
        skillWanted: data.swap.requestedSkill,
        status: data.swap.status,
        message: '',
        createdAt: data.swap.createdAt
      };
      
      setSwapRequests(prev => [newSwap, ...prev]);
      return newSwap;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create swap request');
      throw err;
    }
  };

  const acceptSwap = async (swapId: string) => {
    try {
      const data = await api.swaps.acceptSwap(swapId);
      
      setSwapRequests(prev =>
        prev.map(swap =>
          swap.id === swapId
            ? { ...swap, status: 'accepted' as const }
            : swap
        )
      );
      
      return data.swap;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept swap');
      throw err;
    }
  };

  const rejectSwap = async (swapId: string) => {
    try {
      const data = await api.swaps.rejectSwap(swapId);
      
      setSwapRequests(prev =>
        prev.map(swap =>
          swap.id === swapId
            ? { ...swap, status: 'rejected' as const }
            : swap
        )
      );
      
      return data.swap;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject swap');
      throw err;
    }
  };

  const deleteSwap = async (swapId: string) => {
    try {
      await api.swaps.deleteSwap(swapId);
      
      setSwapRequests(prev => prev.filter(swap => swap.id !== swapId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete swap');
      throw err;
    }
  };

  const submitFeedback = async (swapId: string, rating: number, comment: string) => {
    try {
      const data = await api.swaps.submitFeedback(swapId, { rating, comment });
      return data.swap;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
      throw err;
    }
  };

  return {
    swapRequests,
    isLoading,
    error,
    loadUserSwaps,
    createSwapRequest,
    acceptSwap,
    rejectSwap,
    deleteSwap,
    submitFeedback
  };
} 