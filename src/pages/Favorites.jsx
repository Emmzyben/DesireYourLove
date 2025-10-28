import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import { Star, MessageCircle, MapPin, Calendar, X } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const response = await apiService.getFavorites();
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromFavorites = async (userId) => {
    try {
      await apiService.removeFromFavorites(userId);
      setFavorites(prev => prev.filter(fav => fav.id !== userId));
    } catch (error) {
      console.error('Error removing favorite:', error);
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Favorites</h1>
          <p className="text-gray-600">People you've bookmarked for later</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-4">
              Start exploring and save profiles you like!
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Start Discovering
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer" onClick={() => navigate(`/user/${favorite.id}`)}>
                <div className="relative">
                  {/* Profile Image */}
                  <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    {favorite.photos && favorite.photos.length > 0 ? (
                      <img
                        src={favorite.photos[0]}
                        alt={`${favorite.first_name} ${favorite.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-pink-600">
                          {favorite.first_name[0]}{favorite.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Favorite Badge */}
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <Star className="h-4 w-4 inline mr-1 fill-current" />
                    Favorite
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromFavorites(favorite.id);
                    }}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {favorite.first_name} {favorite.last_name}, {favorite.age}
                    </h3>
                  </div>

                  {(favorite.country || favorite.state || favorite.city) && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {[favorite.city, favorite.state, favorite.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}

               

                  <div className="flex space-x-2">
                    {favorite.matched ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startConversation(favorite.id);
                        }}
                        className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </button>
                    ) : (
                      <div className="flex-1 bg-gray-200 text-gray-500 py-2 px-4 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Like to Message
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500">
                      Added {new Date(favorite.favorited_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
