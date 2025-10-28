import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData) {
    return this.api.post('/auth/register', userData);
  }

  async verifyEmail(token) {
    return this.api.post('/auth/verify-email', { token });
  }

  async resendVerification(email) {
    return this.api.post('/auth/resend-verification', { email });
  }

  async forgotPassword(email) {
    return this.api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token, password) {
    return this.api.post('/auth/reset-password', { token, password });
  }

  async getProfile() {
    return this.api.get('/users/profile');
  }

  async updateProfile(userData) {
    return this.api.put('/users/profile', userData);
  }

  async updatePassword(passwordData) {
    return this.api.put('/users/password', passwordData);
  }

  async deleteAccount() {
    return this.api.delete('/users/account');
  }

  async getUser(userId) {
    return this.api.get(`/users/${userId}`);
  }

  // User discovery endpoints
  async getUsers(page = 1, limit = 12) {
    return this.api.get(`/users?page=${page}&limit=${limit}`);
  }

  async likeUser(userId) {
    return this.api.post(`/matches/like/${userId}`);
  }

  async dislikeUser(userId) {
    return this.api.post(`/matches/dislike/${userId}`);
  }

  // Matches endpoints
  async getMyMatches() {
    return this.api.get('/matches/my-matches');
  }

  async getMyLikes() {
    return this.api.get('/matches/my-likes');
  }

  async getLikesMe() {
    return this.api.get('/matches/likes-me');
  }

  // Favorites endpoints
  async getFavorites() {
    return this.api.get('/favorites');
  }

  async addToFavorites(userId) {
    return this.api.post(`/favorites/${userId}`);
  }

  async removeFromFavorites(userId) {
    return this.api.delete(`/favorites/${userId}`);
  }

  // Message endpoints
  async getConversations() {
    return this.api.get('/messages/conversations');
  }

  async getMessages(conversationId) {
    return this.api.get(`/messages/conversation/${conversationId}`);
  }

  async sendMessage(conversationId, message) {
    return this.api.post('/messages/send', { conversationId, message });
  }

  async startConversation(userId) {
    return this.api.post(`/messages/start-conversation/${userId}`);
  }

  // Notification endpoints
  async getNotifications() {
    return this.api.get('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.api.put(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.api.put('/notifications/read-all');
  }

  async getUnreadNotificationCount() {
    return this.api.get('/notifications/unread-count');
  }

  // Onboarding endpoints
  async completeOnboarding(onboardingData) {
    return this.api.post('/onboarding/complete', onboardingData);
  }

  async getOnboardingStatus() {
    return this.api.get('/onboarding/status');
  }

  // Image upload endpoint
  async uploadImageToIPFS(formData) {
    return fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZTNhMTI1ZC04NDI2LTRjZmEtOGNhOC1lZDE3ODc0OGFlMjkiLCJlbWFpbCI6ImNvbm5lY3RhZGF0aW5nMjAyNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZTEwOTVkNGQ3N2Q2ZmM2NzZiNjUiLCJzY29wZWRLZXlTZWNyZXQiOiJiNjVhOTM1NmNmMGJiODdkMzhlNzk5MjBiNmVhOWUxZjI1NmY5MjFkN2NiMzA3NTcwOGMyYTNkNGM3MzFhYTgyIiwiZXhwIjoxNzg1NDg5NTY3fQ.0JOAowEvWKOAmo6TTArCt3nOu-QOgnTE9YL9Uy2QDYs`
      },
      body: formData
    });
  }
}

export const apiService = new ApiService();
