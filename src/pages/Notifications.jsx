import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { apiService } from '../services/api';
import { Bell, Check, CheckCheck } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotifications();
      setNotifications(response.data.notifications || []);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          {notifications.length > 0 && notifications.some(n => !n.is_read) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No notifications yet</h2>
            <p className="text-gray-500">You'll see your notifications here when you have any.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border p-4 ${
                  !notification.is_read ? 'border-pink-200 bg-pink-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {notification.type || 'Notification'}
                    </h3>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="ml-4 flex items-center space-x-1 text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span className="text-sm">Mark as Read</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Notifications;
