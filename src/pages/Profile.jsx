import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import Layout from '../components/Layout';
import ImageUploader from '../components/imageUploader';
import { User, Mail, Calendar, MapPin, Edit3, Save, X, Heart, Camera } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    interestedIn: '',
    bio: '',
    country: '',
    state: '',
    city: '',
    interests: '',
    photos: []
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setError(null);
      const response = await apiService.getProfile();
      const userData = response.data.user;
      setProfile(userData);
      setEditForm({
        firstName: userData.first_name,
        lastName: userData.last_name,
        age: userData.age ? userData.age.toString() : '',
        gender: userData.gender,
        interestedIn: userData.interested_in,
        bio: userData.bio || '',
        country: userData.country || '',
        state: userData.state || '',
        city: userData.city || '',
        interests: userData.interests ? userData.interests.join(', ') : '',
        photos: userData.photos || []
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const interestsArray = editForm.interests ? editForm.interests.split(',').map(i => i.trim()).filter(i => i) : [];
      await apiService.updateProfile({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        age: parseInt(editForm.age),
        gender: editForm.gender,
        interestedIn: editForm.interestedIn,
        bio: editForm.bio,
        country: editForm.country,
        state: editForm.state,
        city: editForm.city,
        interests: interestsArray,
        photos: editForm.photos
      });

      setIsEditing(false);
      loadProfile(); // Reload profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        firstName: profile.first_name,
        lastName: profile.last_name,
        age: profile.age ? profile.age.toString() : '',
        gender: profile.gender,
        interestedIn: profile.interested_in,
        bio: profile.bio || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
        interests: profile.interests ? profile.interests.join(', ') : '',
        photos: profile.photos || []
      });
    }
    setIsEditing(false);
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
        <div className="text-center py-16">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadProfile}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Full Screen Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedPhoto(null)}>
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={selectedPhoto}
                alt="Full screen photo"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100 transition-colors"
              >
                <X className="h-6 w-6 text-gray-800" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-32"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Profile Picture */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {profile.photos && profile.photos.length > 0 ? (
                  <img
                    src={profile.photos[0]}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-pink-600">
                      {profile.first_name[0]}{profile.last_name[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name and Edit Button */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-600">{profile.username}</p>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors flex items-center mx-auto"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Profile Form */}
            <div className="max-w-2xl mx-auto">
              {isEditing ? (
                <div className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* Age and Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        min="18"
                        max="100"
                        value={editForm.age}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={editForm.gender}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Interested In */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interested In
                    </label>
                    <select
                      name="interestedIn"
                      value={editForm.interestedIn}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="male">Men</option>
                      <option value="female">Women</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={editForm.country}
                        onChange={handleEditChange}
                        placeholder="Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={editForm.state}
                        onChange={handleEditChange}
                        placeholder="State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={editForm.city}
                        onChange={handleEditChange}
                        placeholder="City"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* Photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos
                    </label>
                    <ImageUploader
                      formData={editForm}
                      setFormData={setEditForm}
                      maxPhotos={5}
                    />
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interests
                    </label>
                    <input
                      type="text"
                      name="interests"
                      value={editForm.interests}
                      onChange={handleEditChange}
                      placeholder="e.g., reading, hiking, cooking"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      About Me
                    </label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={editForm.bio}
                      onChange={handleEditChange}
                      placeholder="Tell others about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile Info Display */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Age</p>
                          <p className="font-medium">{profile.age} years old</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p className="font-medium capitalize">{profile.gender}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Interested In</p>
                          <p className="font-medium capitalize">{profile.interested_in}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>

                      {(profile.country || profile.state || profile.city) && (
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">
                              {[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interests */}
                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest, index) => (
                          <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {profile.bio && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
                      <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{profile.bio}</p>
                    </div>
                  )}

                  {/* Photos */}
                  {profile.photos && profile.photos.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Photos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {profile.photos.map((photo, index) => (
                          <div key={index} className="relative group cursor-pointer">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                              <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                                onClick={() => setSelectedPhoto(photo)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Account Actions */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                    <button
                      onClick={logout}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
