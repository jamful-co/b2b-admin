import { graphqlClient, clearAuthToken, setAuthToken } from '@/lib/graphql-client';
import { LOGIN_MUTATION } from '@/graphql/mutations/auth';
import { LoginResponse } from '@/graphql/types';
import { setCompanyId, clearCompanyId } from '@/lib/company';
import storage from '@/lib/storage';

export interface User {
  id: string;
  email: string;
}

export const auth = {
  async login(email: string, password: string): Promise<User> {
    try {
      // GraphQL mutation 실행
      const data = await graphqlClient.request<{ login: LoginResponse }>(
        LOGIN_MUTATION,
        { email, password }
      );

      const { token, companyId, user, supportTypes } = data.login;

      console.log('Login successful:', data.login);

      // 토큰과 사용자 정보를 로컬 스토리지에 저장
      storage.set('token', token);
      storage.set('isAuthenticated', 'true');

      // GraphQL 클라이언트에 인증 토큰 설정
      setAuthToken(token);

      // companyId 저장
      if (companyId) {
        setCompanyId(companyId);
      }

      // supportTypes 저장
      if (supportTypes && supportTypes.length > 0) {
        storage.set('supportTypes', supportTypes);
      }

      storage.set('user', user);

      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    // Clear any stored tokens
    storage.remove('token');
    storage.remove('user');
    storage.remove('isAuthenticated');
    storage.remove('supportTypes');

    // GraphQL 클라이언트에서 인증 토큰 제거
    clearAuthToken();

    // companyId 제거
    clearCompanyId();

    window.location.href = '/welcome';
  },

  async me(): Promise<User> {
    const user = storage.get<User>('user');
    if (user) {
      return user;
    }
    throw new Error('Not authenticated');
  },

  async isAuthenticated():Promise<boolean> {
    return storage.get<boolean>('isAuthenticated');
  },
};
