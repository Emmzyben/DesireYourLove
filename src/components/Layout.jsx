import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Heart, User, MessageCircle, Star, Settings, LogOut, Search, Bell, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCounts } = useNotification();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation links configuration
  const navLinks = [
    { to: '/dashboard', icon: Search, label: 'Discover' },
    { to: '/matches', icon: Heart, label: 'Matches', count: unreadCounts.matches },
    { to: '/messages', icon: MessageCircle, label: 'Messages', count: unreadCounts.messages },
    { to: '/notifications', icon: Bell, label: 'Notifications', count: unreadCounts.notifications },
    { to: '/favorites', icon: Star, label: 'Favorites' },
    { to: '/likes', icon: Heart, label: 'Likes', count: unreadCounts.likes },
  ];

  const userMenuItems = [
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2 group">
                <Heart className="h-8 w-8 text-pink-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">DesireYourLove</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(({ to, icon: Icon, label, count }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 group relative"
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{label}</span>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </Link>
              ))}

              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 group"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-pink-200 group-hover:ring-pink-300 transition-all">
                    {user?.photos && user.photos.length > 0 ? (
                      <img
                        src={user.photos[0]}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-pink-500" />
                    )}
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                </button>

                {/* Dropdown menu */}
                <div className={`absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 z-10 transition-all duration-200 ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  {userMenuItems.map(({ to, icon: Icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600 transition-all duration-200 first:rounded-t-xl"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 rounded-b-xl"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */} 
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20 shadow-lg">
              <div className="px-4 pt-4 pb-6 space-y-2">
                {navLinks.map(({ to, icon: Icon, label, count }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 rounded-xl transition-all duration-200 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">{label}</span>
                    </div>
                    {count > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </Link>
                ))}

                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  {userMenuItems.map(({ to, icon: Icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 rounded-xl transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
