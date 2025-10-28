import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({
    notifications: 0,
    messages: 0,
    likes: 0,
    matches: 0
  });

  const addNotification = (type, title, message, duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const notification = {
      id,
      type,
      title,
      message,
      duration
    };

    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const fetchUnreadCounts = async () => {
    if (!isAuthenticated) return;

    try {
      const [notificationsRes, conversationsRes, likesRes, matchesRes] = await Promise.all([
        apiService.getUnreadNotificationCount(),
        apiService.getConversations(),
        apiService.getLikesMe(),
        apiService.getMyMatches()
      ]);

      const notificationsCount = notificationsRes.data.count;
      const messagesCount = conversationsRes.data.conversations.reduce((sum, conv) => sum + conv.unread_count, 0);
      const likesCount = likesRes.data.likes.filter(like => !like.liked_back).length;
      const matchesCount = matchesRes.data.matches.length;

      setUnreadCounts({
        notifications: notificationsCount,
        messages: messagesCount,
        likes: likesCount,
        matches: matchesCount
      });
    } catch (error) {
      console.error('Failed to fetch unread counts:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCounts();
      // Set up polling every 30 seconds
      const interval = setInterval(fetchUnreadCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCounts,
    addNotification,
    removeNotification,
    clearAllNotifications,
    fetchUnreadCounts
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
