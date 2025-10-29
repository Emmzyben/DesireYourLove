import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import { Heart, X, Star, MapPin, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Check onboarding status on dashboard load
    const checkOnboardingStatus = async () => {
      try {
        const response = await apiService.getOnboardingStatus();
        if (!response.data.onboardingCompleted) {
          navigate('/onboarding');
          return;
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If we can't check status, assume onboarding is not completed
        navigate('/onboarding');
        return;
      }
    };

    checkOnboardingStatus();
  }, [navigate]);

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const loadUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await apiService.getUsers(page);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (userId) => {
    if (actionLoading[userId]) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await apiService.likeUser(userId);
      // Remove user from list
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error liking user:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDislike = async (userId) => {
    if (actionLoading[userId]) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await apiService.dislikeUser(userId);
      // Remove user from list
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error disliking user:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleAddToFavorites = async (userId) => {
    if (actionLoading[userId]) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await apiService.addToFavorites(userId);
      // Update user in list to show as favorited
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, is_favorited: true } : u
      ));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    loadUsers();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover</h1>
          <p className="text-gray-600">Find your perfect match</p>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No more users to show</h2>
            <p className="text-gray-600">Check back later for new potential matches!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
                {/* Profile Image */}
                <div className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100">
                  {user.photos && user.photos.length > 0 ? (
                    <img
                      src={user.photos[0]}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-pink-600">
                          {user.first_name[0]}{user.last_name[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {user.first_name} {user.last_name}, {user.age}
                  </h3>

                  {(user.country || user.state || user.city) && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDislike(user.id);
                      }}
                      disabled={actionLoading[user.id]}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm min-h-[44px]"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Pass
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToFavorites(user.id);
                      }}
                      disabled={actionLoading[user.id] || user.is_favorited}
                      className={`flex-1 py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm min-h-[44px] ${
                        user.is_favorited
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-yellow-500 text-white hover:bg-yellow-600'
                      }`}
                    >
                      <Star className="h-5 w-5 mr-2" />
                      {user.is_favorited ? 'Favorited' : 'Favorite'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(user.id);
                      }}
                      disabled={actionLoading[user.id]}
                      className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm min-h-[44px]"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Like
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrev}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <span className="text-sm text-gray-500">
                ({pagination.totalUsers} total users)
              </span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNext}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
