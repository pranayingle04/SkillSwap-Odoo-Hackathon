import React, { useState } from 'react';
import { Search, User, MapPin, Star, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';

interface BrowseSkillsProps {
  users: UserType[];
  currentUser: UserType;
  onSendSwapRequest: (toUserId: string, skillOffered: string, skillWanted: string, message: string) => void;
}

export function BrowseSkills({ users, currentUser, onSendSwapRequest }: BrowseSkillsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [swapModalData, setSwapModalData] = useState<{
    toUser: UserType;
    skillWanted: string;
  } | null>(null);
  const [swapForm, setSwapForm] = useState({
    skillOffered: '',
    message: ''
  });

  const publicUsers = users.filter(user => user.isPublic && user.id !== currentUser.id);

  const filteredUsers = publicUsers.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.skillsOffered.some(skill => skill.toLowerCase().includes(searchLower)) ||
      user.skillsWanted.some(skill => skill.toLowerCase().includes(searchLower)) ||
      (user.location && user.location.toLowerCase().includes(searchLower))
    );
  });

  const handleSendSwapRequest = () => {
    if (swapModalData && swapForm.skillOffered && swapForm.message) {
      onSendSwapRequest(
        swapModalData.toUser.id,
        swapForm.skillOffered,
        swapModalData.skillWanted,
        swapForm.message
      );
      setSwapModalData(null);
      setSwapForm({ skillOffered: '', message: '' });
    }
  };

  const openSwapModal = (user: UserType, skill: string) => {
    setSwapModalData({ toUser: user, skillWanted: skill });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Skills</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by skill, name, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {/* User Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                  {user.location && (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-3 w-3" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= user.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                      {user.rating.toFixed(1)} ({user.totalRatings} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Offered */}
            <div className="p-6">
              <h4 className="font-medium text-gray-900 mb-3">Can teach:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {user.skillsOffered.slice(0, 3).map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => openSwapModal(user, skill)}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                ))}
                {user.skillsOffered.length > 3 && (
                  <span className="text-gray-500 text-sm">+{user.skillsOffered.length - 3} more</span>
                )}
              </div>

              <h4 className="font-medium text-gray-900 mb-3">Wants to learn:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {user.skillsWanted.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {user.skillsWanted.length > 3 && (
                  <span className="text-gray-500 text-sm">+{user.skillsWanted.length - 3} more</span>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <strong>Available:</strong> {user.availability.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search terms to find more skill swappers.</p>
        </div>
      )}

      {/* Swap Request Modal */}
      {swapModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              Request Skill Swap with {swapModalData.toUser.name}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                You want to learn: <span className="font-medium text-orange-600">{swapModalData.skillWanted}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What skill will you offer in return?
              </label>
              <select
                value={swapForm.skillOffered}
                onChange={(e) => setSwapForm({ ...swapForm, skillOffered: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a skill to offer</option>
                {currentUser.skillsOffered.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={swapForm.message}
                onChange={(e) => setSwapForm({ ...swapForm, message: e.target.value })}
                placeholder="Introduce yourself and explain what you can offer..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSendSwapRequest}
                disabled={!swapForm.skillOffered || !swapForm.message}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send Request
              </button>
              <button
                onClick={() => setSwapModalData(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}