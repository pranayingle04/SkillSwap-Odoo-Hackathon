import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Trash2, User, ArrowRight, MessageSquare, Play } from 'lucide-react';
import { SwapRequest, User as UserType } from '../types';

interface SwapRequestsProps {
  swapRequests: SwapRequest[];
  users: UserType[];
  currentUser: UserType;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onEndSession: (requestId: string) => void;
}

export function SwapRequests({ 
  swapRequests, 
  users, 
  currentUser, 
  onAcceptRequest, 
  onRejectRequest, 
  onDeleteRequest,
  onEndSession
}: SwapRequestsProps) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  const receivedRequests = swapRequests.filter(req => req.toUserId === currentUser.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === currentUser.id);

  const getUserById = (id: string) => users.find(user => user.id === id);

  const getStatusIcon = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: SwapRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const RequestCard = ({ request, isReceived }: { request: SwapRequest; isReceived: boolean }) => {
    const otherUser = getUserById(isReceived ? request.fromUserId : request.toUserId);
    if (!otherUser) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          {/* Header */}
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
                <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(request.status)}
              <span className={`text-sm font-medium ${
                request.status === 'pending' ? 'text-yellow-600' :
                request.status === 'accepted' ? 'text-green-600' :
                request.status === 'rejected' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {getStatusText(request.status)}
              </span>
            </div>
          </div>

          {/* Skill Exchange */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isReceived ? 'They offer' : 'You offer'}
                </p>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {request.skillOffered}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isReceived ? 'You teach' : 'They teach'}
                </p>
                <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  {request.skillWanted}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div className="mb-4">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{request.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            {isReceived && request.status === 'pending' && (
              <>
                <button
                  onClick={() => onRejectRequest(request.id)}
                  className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={() => onAcceptRequest(request.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Accept
                </button>
              </>
            )}
            
            {!isReceived && request.status === 'pending' && (
              <button
                onClick={() => onDeleteRequest(request.id)}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}

            {/* End Session Button for Accepted Requests */}
            {request.status === 'accepted' && (
              <button
                onClick={() => onEndSession(request.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <Play className="h-4 w-4" />
                <span>End Session</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Swap Requests</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Received ({receivedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'sent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sent ({sentRequests.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'received' && (
          <>
            {receivedRequests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests received</h3>
                <p className="text-gray-600">When someone wants to swap skills with you, their requests will appear here.</p>
              </div>
            ) : (
              receivedRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={true} />
              ))
            )}
          </>
        )}

        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests sent</h3>
                <p className="text-gray-600">Start browsing skills to send your first swap request!</p>
              </div>
            ) : (
              sentRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={false} />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}