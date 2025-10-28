import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { apiService } from '../services/api';
import { Heart, Eye, EyeOff, User, Mail, Lock, UserCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',

  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('One special character (!@#$%^&*)');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Age validation removed as it's now collected in onboarding

    try {
      const userData = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      
      };

      const response = await apiService.register(userData);
      const { user } = response.data;

      addNotification('success', 'Registration successful!', 'Please check your email to verify your account before proceeding.');
      navigate('/verify-email', { state: { email: user.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 relative overflow-hidden">
      {/* Background Pattern */}

      {/* Navigation */}
      <nav className="relative z-10 bg-white/90 backdrop-blur-md shadow-lg border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <Heart className="h-9 w-9 text-pink-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">DesireYourLove</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-pink-600 transition-all duration-200 font-medium hover:scale-105"
              >
                Home
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Glassmorphism Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200/30 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-6 shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Join Our Love Story
                </h2>
                <p className="text-gray-600 text-lg">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200 underline decoration-2 underline-offset-2"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <User className="h-4 w-4 text-pink-500" />
                      <span>First Name</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <User className="h-4 w-4 text-pink-500" />
                      <span>Last Name</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label htmlFor="username" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <UserCheck className="h-4 w-4 text-pink-500" />
                    <span>Username</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a unique username"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Mail className="h-4 w-4 text-pink-500" />
                    <span>Email Address</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <Lock className="h-4 w-4 text-pink-500" />
                      <span>Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.length > 0 && (
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-medium">Password requirements:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {passwordErrors.map((error, index) => (
                            <li key={index} className="text-red-600">{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                      <Lock className="h-4 w-4 text-pink-500" />
                      <span>Confirm Password</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <Heart className="h-5 w-5" />
                        <span>Start Your Love Journey</span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
