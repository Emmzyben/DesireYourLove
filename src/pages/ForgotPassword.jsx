import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { apiService } from '../services/api';
import { Heart, Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiService.forgotPassword(email);
      setIsSubmitted(true);
      addNotification('success', 'Reset email sent!', 'Check your email for password reset instructions.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Background Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/90 to-red-500/90 z-10"></div>
          <img
            src="/images/sunset-happy-couple-e1425955022863.jpg"
            alt="Happy couple"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 z-20"></div>
          <div className="absolute bottom-10 left-10 text-white z-30 max-w-md">
            <h1 className="text-4xl font-bold mb-4 animate-fade-in">
              Check Your Email
            </h1>
            <p className="text-lg opacity-90 animate-fade-in-delay">
              We've sent you a password reset link. Click the link in the email to reset your password.
            </p>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white via-pink-50 to-red-50">
          <div className="w-full max-w-md space-y-8 animate-slide-up">
            {/* Navigation */}
            <nav className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center space-x-2 group">
                <Heart className="h-8 w-8 text-pink-500 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold text-gray-900">DesireYourLove</span>
              </Link>
            </nav>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-full">
                  <Mail className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>

              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">
                  If you don't see the email in your inbox, check your spam folder. The link will expire in 1 hour.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-block text-center"
                >
                  Back to Login
                </Link>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full text-gray-600 hover:text-pink-500 transition-colors font-medium"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/90 to-red-500/90 z-10"></div>
        <img
          src="/images/sunset-happy-couple-e1425955022863.jpg"
          alt="Happy couple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 z-20"></div>
        <div className="absolute bottom-10 left-10 text-white z-30 max-w-md">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">
            Reset Your Password
          </h1>
          <p className="text-lg opacity-90 animate-fade-in-delay">
            Don't worry! Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-white via-pink-50 to-red-50">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Navigation */}
          <nav className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <Heart className="h-8 w-8 text-pink-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-gray-900">DesireYourLove</span>
            </Link>
            <Link
              to="/login"
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-500 transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </nav>

          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-pink-100 to-red-100 rounded-full">
                <Mail className="h-12 w-12 text-pink-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-pink-600 hover:text-pink-500 transition-colors font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
