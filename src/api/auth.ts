import { graphqlClient, clearAuthToken, setAuthToken } from '@/lib/graphql-client';
import { LOGIN_MUTATION } from '@/graphql/mutations/auth';
import { LoginResponse } from '@/graphql/types';
import { setCompanyId, clearCompanyId } from '@/lib/company';

// 기존 User 인터페이스 유지 (하위 호환성)
export interface User {
  id: string;
  email: string;
  full_name: string;
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
      localStorage.setItem('token', token);
      localStorage.setItem('isAuthenticated', 'true');

      // GraphQL 클라이언트에 인증 토큰 설정
      setAuthToken(token);

      // companyId 저장
      if (companyId) {
        setCompanyId(companyId);
      }

      // supportTypes 저장
      if (supportTypes && supportTypes.length > 0) {
        localStorage.setItem('supportTypes', JSON.stringify(supportTypes));
      }

      // 기존 User 인터페이스 형식으로 변환하여 저장
      const legacyUser: User = {
        id: user.userId,
        email: email,
        full_name: email.split('@')[0], // 임시로 이메일 prefix 사용
      };
      localStorage.setItem('user', JSON.stringify(legacyUser));

      return legacyUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('supportTypes');

    // GraphQL 클라이언트에서 인증 토큰 제거
    clearAuthToken();

    // companyId 제거
    clearCompanyId();

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
