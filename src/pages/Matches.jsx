import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import { Heart, MessageCircle, MapPin, Calendar } from 'lucide-react';

const Matches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await apiService.getMyMatches();
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches</h1>
          <p className="text-gray-600">Connect with people who liked you back!</p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No matches yet</h2>
            <p className="text-gray-600 mb-4">
              Keep swiping to find your perfect match!
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
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer" onClick={() => navigate(`/user/${match.id}`)}>
                <div className="relative">
                  {/* Profile Image */}
                  <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    {match.photos && match.photos.length > 0 ? (
                      <img
                        src={match.photos[0]}
                        alt={`${match.first_name} ${match.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-pink-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-pink-600">
                          {match.first_name[0]}{match.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Match Badge */}
                  <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    <Heart className="h-4 w-4 inline mr-1" />
                    Match!
                  </div>
                </div>

                {/* Profile Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {match.first_name} {match.last_name}, {match.age}
                    </h3>
                  </div>

                  {(match.country || match.state || match.city) && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {[match.city, match.state, match.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}


                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startConversation(match.id);
                      }}
                      className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </button>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500">
                      Matched {new Date(match.match_date).toLocaleDateString()}
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

export default Matches;
