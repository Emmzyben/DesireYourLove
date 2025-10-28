import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { apiService } from '../services/api';
import { Settings as SettingsIcon, Bell, Shield, User, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotification();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    profileVisibility: 'public'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiService.getProfile();
      const userData = response.data.user;
      setSettings({
        emailNotifications: userData.email_notifications !== undefined ? userData.email_notifications : true,
        profileVisibility: userData.profile_visibility || 'public'
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      const updateData = { [setting]: value };
      await apiService.updateProfile(updateData);
      setSettings(prev => ({
        ...prev,
        [setting]: value
      }));

      addNotification('success', 'Settings Updated', 'Your settings have been saved successfully.');
    } catch (error) {
      console.error('Error updating settings:', error);
      addNotification('error', 'Update Failed', 'Failed to update settings. Please try again.');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });

    if (name === 'newPassword') {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingPassword(true);

    // Validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification('error', 'Password Mismatch', 'New password and confirmation do not match.');
      setIsUpdatingPassword(false);
      return;
    }

    if (passwordErrors.length > 0) {
      addNotification('error', 'Invalid Password', 'Please ensure your new password meets all requirements.');
      setIsUpdatingPassword(false);
      return;
    }

    try {
      await apiService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      addNotification('success', 'Password Updated', 'Your password has been changed successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors([]);
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password. Please try again.';
      addNotification('error', 'Update Failed', errorMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      addNotification('error', 'Confirmation Required', 'Please type "DELETE" to confirm account deletion.');
      return;
    }

    setIsDeletingAccount(true);
    try {
      await apiService.deleteAccount();
      addNotification('success', 'Account Deleted', 'Your account has been permanently deleted.');
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error deleting account:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete account. Please try again.';
      addNotification('error', 'Deletion Failed', errorMessage);
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
      setDeleteConfirmation('');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="h-8 w-8 mr-3 text-pink-500" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        <div className="space-y-6">
          {/* Notifications Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-pink-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-pink-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Profile Visibility</h3>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="public">Public - Anyone can see my profile</option>
                  <option value="matches">Matches Only - Only my matches can see my profile</option>
                  <option value="private">Private - Only I can see my profile</option>
                </select>
              </div>
            </div>
          </div>



          {/* Change Password */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-pink-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordErrors.length > 0 && (
                  <div className="mt-1 text-xs text-gray-600">
                    <p className="font-medium">Password requirements:</p>
                    <ul className="list-disc list-inside">
                      {passwordErrors.map((error, index) => (
                        <li key={index} className="text-red-600">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-pink-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">Username</h3>
                  <p className="text-gray-600">{user?.username}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Member Since</h3>
                  <p className="text-gray-600">{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'January 2024'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Account Status</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-red-600">Danger Zone</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Delete Account Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  This action will permanently delete your account and all associated data including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li>Your profile and personal information</li>
                  <li>All your matches and conversations</li>
                  <li>Your likes and favorites</li>
                  <li>All notifications</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  <strong>This action cannot be undone.</strong> To confirm deletion, please type <strong>DELETE</strong> in the field below.
                </p>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 mb-4"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteConfirmation('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount || deleteConfirmation !== 'DELETE'}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDeletingAccount ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
