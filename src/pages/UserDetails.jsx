import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import { MessageCircle, MapPin, Calendar, ArrowLeft, Heart, Star, X } from 'lucide-react';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { addNotification } = useNotification();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMessaging, setIsMessaging] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  const loadUserDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getUser(userId);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error loading user details:', error);
      setError(error.response?.data?.message || 'Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await apiService.likeUser(userId);
      if (response.data.isMatch) {
        addNotification('success', 'Match!', 'It\'s a match! You can now message each other.');
      } else {
        addNotification('success', 'Profile Liked', 'Profile liked! If they like you back, you\'ll be matched.');
      }
    } catch (error) {
      console.error('Error liking user:', error);
      if (error.response?.status === 400) {
        addNotification('error', 'Already Liked', 'You have already liked this user.');
      } else {
        addNotification('error', 'Like Failed', 'Failed to like user. Please try again.');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleMessage = async () => {
    if (isMessaging) return;

    setIsMessaging(true);
    try {
      await apiService.startConversation(userId);
      navigate('/messages');
    } catch (error) {
      console.error('Error starting conversation:', error);
      if (error.response?.status === 403) {
        // User is not matched, show appropriate message
        alert('You can only message matched users. Like their profile first to create a match!');
      } else {
        alert('Failed to start conversation. Please try again.');
      }
    } finally {
      setIsMessaging(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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

  if (error) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Accessible</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
            <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
            <button
              onClick={handleBack}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Image Placeholder */}
            <div className="h-48 bg-gradient-to-r from-pink-400 to-purple-500"></div>

            {/* Profile Image */}
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 bg-white rounded-full p-2 overflow-hidden">
                {user.photos && user.photos.length > 0 ? (
                  <img
                    src={user.photos[0]}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-pink-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-pink-600">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            {/* Name and Basic Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.first_name} {user.last_name}, {user.age}
              </h1>

              {(user.country || user.state || user.city) && (
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>
                    {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}

              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Photos */}
            {user.photos && user.photos.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            {user.interests && user.interests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )} 

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                <Heart className="h-5 w-5 mr-2" />
                {isLiking ? 'Liking...' : 'Like'}
              </button>
              <button
                onClick={handleMessage}
                disabled={isMessaging}
                className="flex-1 bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {isMessaging ? 'Starting Conversation...' : 'Message'}
              </button>
            </div>
          </div>
        </div>

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 text-gray-800 hover:text-gray-600 transition-colors shadow-lg z-10"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedPhoto}
                alt="Expanded photo"
                className="max-w-full max-h-full object-contain rounded-lg cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDetails;
