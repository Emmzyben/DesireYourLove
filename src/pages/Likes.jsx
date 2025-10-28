import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import { Heart, MapPin, MessageCircle, RefreshCw } from 'lucide-react';

const Likes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-likes');
  const [myLikes, setMyLikes] = useState([]);
  const [likesMe, setLikesMe] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [likedBackUsers, setLikedBackUsers] = useState(new Set());

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      setIsLoading(true);
      const [myLikesResponse, likesMeResponse] = await Promise.all([
        apiService.getMyLikes(),
        apiService.getLikesMe()
      ]);

      setMyLikes(myLikesResponse.data.likes);
      setLikesMe(likesMeResponse.data.likes);

      // Initialize likedBackUsers set based on API response
      const likedBackSet = new Set();
      likesMeResponse.data.likes.forEach(user => {
        if (user.liked_back) {
          likedBackSet.add(user.id);
        }
      });
      setLikedBackUsers(likedBackSet);
    } catch (error) {
      console.error('Error loading likes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadLikes();
  };

  const handleLikeBack = async (userId) => {
    if (actionLoading[userId]) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await apiService.likeUser(userId);
      // Mark user as liked back and remove from likes-me list since they are now matched or liked back
      setLikedBackUsers(prev => new Set([...prev, userId]));
      setLikesMe(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error liking back user:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const startConversation = async (userId) => {
    try {
      const response = await apiService.startConversation(userId);
      // Navigate to messages page
      window.location.href = '/messages';
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const UserCard = ({ user, type }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate(`/user/${user.id}`)}>
      {/* Profile Image */}
      <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
        {user.photos && user.photos.length > 0 ? (
          <img
            src={user.photos[0]}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-pink-600">
                {user.first_name[0]}{user.last_name[0]}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {user.first_name} {user.last_name}, {user.age}
        </h3>

        {(user.country || user.state || user.city) && (
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {[user.city, user.state, user.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

      
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            {type === 'my-likes' ? 'Liked' : 'Liked you'} on {new Date(user.liked_at).toLocaleDateString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {type === 'likes-me' && (
            likedBackUsers.has(user.id) ? (
              <button
                disabled
                className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg flex items-center justify-center text-sm cursor-not-allowed"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="h-4 w-4 mr-1" />
                Matched
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeBack(user.id);
                }}
                disabled={actionLoading[user.id]}
                className="flex-1 bg-pink-500 text-white py-2 px-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                <Heart className="h-4 w-4 mr-1" />
                Like Back
              </button>
            )
          )}
          {type === 'my-likes' && user.matched ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startConversation(user.id);
              }}
              className="flex-1 bg-pink-500 text-white py-2 px-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </button>
          ) : type === 'my-likes' ? (
            <div className="flex-1 bg-gray-200 text-gray-500 py-2 px-3 rounded-lg flex items-center justify-center text-sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              Like to Message
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startConversation(user.id);
              }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Likes</h1>
          <p className="text-gray-600">See who you've liked and who likes you</p>
          <button
            onClick={handleRefresh}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('my-likes')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'my-likes'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              People I Liked ({myLikes.length})
            </button>
            <button
              onClick={() => setActiveTab('likes-me')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'likes-me'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              People Who Liked Me ({likesMe.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'my-likes' ? (
          <div>
            {myLikes.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No likes yet</h2>
                <p className="text-gray-600">Start liking profiles to see them here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myLikes.map((likedUser) => (
                  <UserCard key={likedUser.id} user={likedUser} type="my-likes" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {likesMe.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No likes yet</h2>
                <p className="text-gray-600">When someone likes your profile, they'll appear here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likesMe.map((liker) => (
                  <UserCard key={liker.id} user={liker} type="likes-me" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Likes;
