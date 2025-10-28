import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { apiService } from '../services/api';
import ImageUploader from '../components/imageUploader';
import LocationPicker from '../components/locationPicker';
import { Heart, MapPin, Calendar, Users, User, ChevronRight, ChevronLeft, Check, Camera } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    interests: [],
    country: '',
    state: '',
    city: '',
    bio: '',
    age: '',
    gender: '',
    lookingFor: '',
    photos: []
  });

  const { user } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const steps = [
    { title: 'Interests', icon: Heart },
    { title: 'Location', icon: MapPin },
    { title: 'Photos', icon: Camera },
    { title: 'About You', icon: User },
    { title: 'Preferences', icon: Users }
  ];

  const interestOptions = [
    'Travel', 'Music', 'Sports', 'Reading', 'Cooking', 'Art', 'Photography',
    'Dancing', 'Hiking', 'Movies', 'Gaming', 'Fitness', 'Yoga', 'Meditation',
    'Food', 'Wine', 'Coffee', 'Pets', 'Nature', 'Technology', 'Fashion', 'Shopping'
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const lookingForOptions = [
    { value: 'male', label: 'Men' },
    { value: 'female', label: 'Women' },
    { value: 'both', label: 'Both' }
  ];

  useEffect(() => {
    // Check if user has already completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const response = await apiService.getOnboardingStatus();
        if (response.data.onboardingCompleted) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    if (user) {
      checkOnboardingStatus();
    }
  }, [user, navigate]);

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (locationData) => {
    setFormData(prev => ({
      ...prev,
      country: locationData.country,
      state: locationData.state,
      city: locationData.city
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const onboardingData = {
        interests: formData.interests,
        ...(formData.country && { country: formData.country }),
        ...(formData.state && { state: formData.state }),
        ...(formData.city && { city: formData.city }),
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.age && !isNaN(parseInt(formData.age)) && { age: parseInt(formData.age) }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.lookingFor && { lookingFor: formData.lookingFor }),
        ...(formData.photos.length > 0 && { photos: formData.photos })
      };

      await apiService.completeOnboarding(onboardingData);
      addNotification('success', 'Welcome!', 'Your profile has been set up successfully.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.map(err => err.msg).join(', ')
        : 'Failed to complete onboarding. Please try again.';
      addNotification('error', 'Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Interests
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">What are your interests?</h3>
              <p className="text-gray-600">Select all that apply to help us find better matches</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ${
                    formData.interests.includes(interest)
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );

      case 1: // Location
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Where are you located?</h3>
              <p className="text-gray-600">This helps us show you relevant matches nearby</p>
            </div>
            <div className="space-y-4">
              <LocationPicker onChange={handleLocationChange} />
            </div>
          </div>
        );

      case 2: // Photos
        return (
          <div className="space-y-6">
            <ImageUploader
              formData={formData}
              setFormData={setFormData}
              maxPhotos={5}
            />
          </div>
        );

      case 3: // About You
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h3>
              <p className="text-gray-600">Help others get to know you better</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-500" />
                    <input
                      type="number"
                      min="18"
                      max="100"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                <textarea
                  placeholder="Tell us a bit about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
              </div>
            </div>
          </div>
        );

      case 4: // Preferences
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">What are you looking for?</h3>
              <p className="text-gray-600">Help us find the perfect matches for you</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">I'm interested in meeting:</label>
                <div className="grid grid-cols-3 gap-3">
                  {lookingForOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('lookingFor', option.value)}
                      className={`p-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ${
                        formData.lookingFor === option.value
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-pink-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-200 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-rose-200 rounded-full"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      isCompleted
                        ? 'bg-pink-500 border-pink-500 text-white'
                        : isCurrent
                        ? 'border-pink-500 text-pink-500 bg-white'
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Glassmorphism Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>

                {currentStep === steps.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Completing...
                      </div>
                    ) : (
                      <>
                        Complete Setup
                        <Heart className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
