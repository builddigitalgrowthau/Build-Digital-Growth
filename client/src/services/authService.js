import api from './api';

export const authService = {
  // Register a new user
  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', userData);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      throw error.response?.data?.error || 'Signup failed';
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  },

  // Logout user
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  async getCurrentUser() {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userJson || !token) {
      return null;
    }

    return JSON.parse(userJson);
  }
};
