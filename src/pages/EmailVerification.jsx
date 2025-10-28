import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { apiService } from '../services/api';
import { Heart, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const email = location.state?.email;
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    // If there's a token in the URL, automatically verify
    if (token) {
      handleVerification(token);
    }
  }, [token]);

  const handleVerification = async (verificationToken) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.verifyEmail(verificationToken);
      const { token: authToken, user } = response.data;

      login(authToken, user);
      setSuccess(true);
      addNotification('success', 'Email verified!', 'Your email has been successfully verified. Welcome to DesireYourLove!');

      // Redirect to onboarding after a short delay
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Email address not found. Please try registering again.');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      await apiService.resendVerification(email);
      addNotification('success', 'Verification email sent!', 'Please check your email for the new verification link.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 relative overflow-hidden flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h2>
          <p className="text-gray-600 mb-6">Your email has been successfully verified. Redirecting you to complete your profile...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-500 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-rose-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-200 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-rose-200 rounded-full"></div>
      </div>

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
                to="/login"
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2.5 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign In
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
                  <Mail className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Verify Your Email
                </h2>
                <p className="text-gray-600 text-lg">
                  We've sent a verification link to{' '}
                  <span className="font-semibold text-pink-600">{email || 'your email'}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-6 py-4 rounded-2xl shadow-sm mb-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-pink-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Verifying your email...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 text-blue-800 px-6 py-4 rounded-2xl">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-1">Check your email</h3>
                        <p className="text-sm">
                          Click the verification link in the email we sent you. If you don't see it, check your spam folder.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      Didn't receive the email?{' '}
                      <button
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="font-semibold text-pink-600 hover:text-pink-700 transition-colors duration-200 underline decoration-2 underline-offset-2 disabled:opacity-50"
                      >
                        {isResending ? (
                          <span className="flex items-center space-x-1">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Resending...</span>
                          </span>
                        ) : (
                          'Resend verification email'
                        )}
                      </button>
                    </p>

                    <div className="pt-4">
                      <Link
                        to="/login"
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 font-medium"
                      >
                        <span>← Back to sign in</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
