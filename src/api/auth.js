import { apiClient } from './client';

export const auth = {
  async login(email, password) {
    // For now, accept any email/password and store in localStorage
    const user = {
      email,
      full_name: email.split('@')[0], // Use email prefix as name
      id: '1'
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    return user;
  },

  async logout() {
    // Clear any stored tokens
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/welcome';
  },

  async me() {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    throw new Error('Not authenticated');
  },

  async isAuthenticated() {
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  },
};

