import React, { useState } from 'react';
import { User, MapPin, Calendar, Eye, EyeOff, Plus, X, Save, Star } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  isOwnProfile?: boolean;
  ratings?: any[];
  swapRequests?: any[];
}

export function UserProfile({ user, onUpdateUser, isOwnProfile = false, ratings = [], swapRequests = [] }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const handleSave = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setEditedUser({
        ...editedUser,
        skillsOffered: [...editedUser.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setEditedUser({
        ...editedUser,
        skillsWanted: [...editedUser.skillsWanted, newSkillWanted.trim()]
      });
      setNewSkillWanted('');
    }
  };

  const addAvailability = () => {
    if (newAvailability.trim()) {
      setEditedUser({
        ...editedUser,
        availability: [...editedUser.availability, newAvailability.trim()]
      });
      setNewAvailability('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsOffered: editedUser.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillWanted = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsWanted: editedUser.skillsWanted.filter((_, i) => i !== index)
    });
  };

  const removeAvailability = (index: number) => {
    setEditedUser({
      ...editedUser,
      availability: editedUser.availability.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
              )}
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="text-2xl font-bold bg-white/20 text-white placeholder-white/70 rounded px-3 py-1 border border-white/30"
                    placeholder="Your name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                )}
                {user.location && (
                  <div className="flex items-center space-x-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.location || ''}
                        onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                        className="bg-white/20 text-white placeholder-white/70 rounded px-2 py-1 border border-white/30 text-sm"
                        placeholder="Location (optional)"
                      />
                    ) : (
                      <span className="text-white/90">{user.location}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center space-x-4 mt-3">
                  <span className="text-lg">⭐ {user.rating.toFixed(1)}</span>
                  <span className="text-white/80">({user.totalRatings} reviews)</span>
                  <span className="text-white/80">Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Privacy Setting */}
          {isOwnProfile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {user.isPublic ? <Eye className="h-5 w-5 text-green-600" /> : <EyeOff className="h-5 w-5 text-red-600" />}
                  <span className="font-medium">Profile Visibility</span>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setEditedUser({ ...editedUser, isPublic: !editedUser.isPublic })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      editedUser.isPublic 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {editedUser.isPublic ? 'Public' : 'Private'}
                  </button>
                )}
                {!isEditing && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isPublic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isPublic ? 'Public' : 'Private'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Skills Offered */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Can Teach</h2>
            <div className="flex flex-wrap gap-3">
              {(isEditing ? editedUser.skillsOffered : user.skillsOffered).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkillOffered(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add skill"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                  />
                  <button
                    onClick={addSkillOffered}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>
            <div className="flex flex-wrap gap-3">
              {(isEditing ? editedUser.skillsWanted : user.skillsWanted).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-2 rounded-full text-sm font-medium"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeSkillWanted(index)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add skill"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  />
                  <button
                    onClick={addSkillWanted}
                    className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
            <div className="flex flex-wrap gap-3">
              {(isEditing ? editedUser.availability : user.availability).map((time, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-teal-100 text-teal-800 px-3 py-2 rounded-full text-sm font-medium"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {time}
                  {isEditing && (
                    <button
                      onClick={() => removeAvailability(index)}
                      className="ml-2 text-teal-600 hover:text-teal-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newAvailability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    placeholder="Add availability"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
                  />
                  <button
                    onClick={addAvailability}
                    className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Ratings Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ratings & Reviews</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">⭐ {user.rating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">{user.totalRatings} reviews</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= user.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Average rating from {user.totalRatings} completed sessions
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            {ratings.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Recent Reviews</h3>
                {ratings
                  .filter((rating: any) => rating.toUserId === user.id)
                  .slice(0, 3)
                  .map((rating: any) => {
                    const swapRequest = swapRequests.find((req: any) => req.id === rating.swapRequestId);
                    const reviewer = swapRequests.find((req: any) => req.id === rating.swapRequestId)?.fromUserId;
                    return (
                      <div key={rating.id} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= rating.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {swapRequest && (
                          <p className="text-sm text-gray-600 mb-2">
                            Taught <span className="font-medium">{swapRequest.skillWanted}</span>
                          </p>
                        )}
                        <p className="text-sm text-gray-700">{rating.feedback}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}