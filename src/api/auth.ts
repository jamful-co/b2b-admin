import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  full_name: string;
}

export const auth = {
  async login(email: string, password: string): Promise<User> {
    // For now, accept any email/password and store in localStorage
    const user: User = {
      email,
      full_name: email.split('@')[0], // Use email prefix as name
      id: '1',
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    return user;
  },

  async logout(): Promise<void> {
    // Clear any stored tokens
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/welcome';
  },

  async me(): Promise<User> {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user) as User;
    }
    throw new Error('Not authenticated');
  },

  async isAuthenticated(): Promise<boolean> {
    const isAuth = localStorage.getItem('isAuthenticated');
    return isAuth === 'true';
  },
};
