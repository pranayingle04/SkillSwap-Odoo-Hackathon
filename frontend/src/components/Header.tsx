import React from 'react';
import { Users, Search, User, MessageSquare, Star, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  currentUser: any;
  onLogout: () => void;
}

export function Header({ currentView, onViewChange, currentUser, onLogout }: HeaderProps) {
  const navItems = [
    { id: 'browse', label: 'Browse Skills', icon: Search },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'requests', label: 'Swap Requests', icon: MessageSquare },
    { id: 'ratings', label: 'Ratings', icon: Star }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SkillSwap</h1>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {currentUser && (
            <div className="flex items-center space-x-3">
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">
                  ⭐ {currentUser.rating.toFixed(1)} ({currentUser.totalRatings} reviews)
                </p>
              </div>
              {currentUser.profilePhoto && (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex space-x-1 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
                    currentView === item.id
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="truncate">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}