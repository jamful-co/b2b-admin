import { apiClient } from './client';

export const auth = {
  async login(email, password) {
    return apiClient.post('/auth/login', { email, password });
  },

  async logout() {
    // Clear any stored tokens
    localStorage.removeItem('token');
    window.location.href = '/welcome';
  },

  async me() {
    return apiClient.get('/auth/me');
  },

  async isAuthenticated() {
    try {
      await this.me();
      return true;
    } catch {
      return false;
    }
  },
};

