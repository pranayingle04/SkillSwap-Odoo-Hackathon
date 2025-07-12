import React, { useState } from 'react';
import { Star, User, MessageSquare, Calendar } from 'lucide-react';
import { SwapRequest, Rating, User as UserType } from '../types';

interface RatingsProps {
  swapRequests: SwapRequest[];
  ratings: Rating[];
  users: UserType[];
  currentUser: UserType;
  onSubmitRating: (swapRequestId: string, rating: number, feedback: string) => void;
}

export function Ratings({ swapRequests, ratings, users, currentUser, onSubmitRating }: RatingsProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'given' | 'received'>('pending');
  const [ratingForm, setRatingForm] = useState<{
    swapRequestId: string;
    rating: number;
    feedback: string;
  } | null>(null);

  // Get completed sessions that need rating
  const completedSessions = swapRequests.filter(req => 
    req.status === 'completed' && 
    (req.fromUserId === currentUser.id || req.toUserId === currentUser.id)
  );

  const pendingRatings = completedSessions.filter(session => 
    !ratings.some(rating => 
      rating.swapRequestId === session.id && 
      rating.fromUserId === currentUser.id
    )
  );

  const givenRatings = ratings.filter(rating => rating.fromUserId === currentUser.id);
  const receivedRatings = ratings.filter(rating => rating.toUserId === currentUser.id);

  const getUserById = (id: string) => users.find(user => user.id === id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmitRating = () => {
    if (ratingForm && ratingForm.rating > 0 && ratingForm.feedback.trim()) {
      onSubmitRating(ratingForm.swapRequestId, ratingForm.rating, ratingForm.feedback);
      setRatingForm(null);
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }: { 
    rating: number; 
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange?.(star)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const PendingRatingCard = ({ session }: { session: SwapRequest }) => {
    const otherUser = getUserById(session.fromUserId === currentUser.id ? session.toUserId : session.fromUserId);
    if (!otherUser) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          {otherUser.profilePhoto ? (
            <img
              src={otherUser.profilePhoto}
              alt={otherUser.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-500">Session completed {formatDate(session.completedAt || session.createdAt)}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            You learned <span className="font-medium text-orange-600">{session.skillWanted}</span> from {otherUser.name}
          </p>
        </div>

        <button
          onClick={() => setRatingForm({ swapRequestId: session.id, rating: 0, feedback: '' })}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Rate This Session
        </button>
      </div>
    );
  };

  const RatingCard = ({ rating, isGiven }: { rating: Rating; isGiven: boolean }) => {
    const swapRequest = swapRequests.find(req => req.id === rating.swapRequestId);
    const otherUser = getUserById(isGiven ? rating.toUserId : rating.fromUserId);
    if (!otherUser || !swapRequest) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {otherUser.profilePhoto ? (
              <img
                src={otherUser.profilePhoto}
                alt={otherUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">{formatDate(rating.createdAt)}</p>
            </div>
          </div>
          <StarRating rating={rating.rating} readonly />
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600">
            {isGiven ? 'You taught' : 'They taught you'} <span className="font-medium text-blue-600">{swapRequest.skillWanted}</span>
          </p>
        </div>

        {rating.feedback && (
          <div className="flex items-start space-x-2">
            <MessageSquare className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <p className="text-gray-700 text-sm">{rating.feedback}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Ratings & Reviews</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending ({pendingRatings.length})
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'given'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Given ({givenRatings.length})
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Received ({receivedRatings.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'pending' && (
          <>
            {pendingRatings.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pending ratings</h3>
                <p className="text-gray-600">Complete skill swaps to rate your experience with other users.</p>
              </div>
            ) : (
              pendingRatings.map((session) => (
                <PendingRatingCard key={session.id} session={session} />
              ))
            )}
          </>
        )}

        {activeTab === 'given' && (
          <>
            {givenRatings.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings given</h3>
                <p className="text-gray-600">Your ratings for completed swaps will appear here.</p>
              </div>
            ) : (
              givenRatings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} isGiven={true} />
              ))
            )}
          </>
        )}

        {activeTab === 'received' && (
          <>
            {receivedRatings.length === 0 ? (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings received</h3>
                <p className="text-gray-600">Ratings from other users will appear here after you complete swaps.</p>
              </div>
            ) : (
              receivedRatings.map((rating) => (
                <RatingCard key={rating.id} rating={rating} isGiven={false} />
              ))
            )}
          </>
        )}
      </div>

      {/* Rating Modal */}
      {ratingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Rate Your Session</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate this skill exchange session?
              </label>
              <div className="flex justify-center mb-2">
                <StarRating 
                  rating={ratingForm.rating} 
                  onRatingChange={(rating) => setRatingForm({ ...ratingForm, rating })}
                />
              </div>
              <div className="text-center text-sm text-gray-600">
                {ratingForm.rating === 0 && "Click on a star to rate"}
                {ratingForm.rating === 1 && "Poor - Not helpful at all"}
                {ratingForm.rating === 2 && "Fair - Could be better"}
                {ratingForm.rating === 3 && "Good - Met expectations"}
                {ratingForm.rating === 4 && "Very Good - Exceeded expectations"}
                {ratingForm.rating === 5 && "Excellent - Outstanding experience"}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your feedback and comments
              </label>
              <textarea
                value={ratingForm.feedback}
                onChange={(e) => setRatingForm({ ...ratingForm, feedback: e.target.value })}
                placeholder="Tell us about your experience! What did you learn? How was the teaching? Any suggestions for improvement?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmitRating}
                disabled={ratingForm.rating === 0 || !ratingForm.feedback.trim()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setRatingForm(null)}
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