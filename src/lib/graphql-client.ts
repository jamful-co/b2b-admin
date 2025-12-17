import { GraphQLClient } from 'graphql-request';

// GraphQL 엔드포인트 설정
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3335/graphql';

// GraphQL 클라이언트 인스턴스 생성
export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 인증 토큰을 헤더에 설정하는 함수
 * @param token JWT 토큰
 */
export const setAuthToken = (token: string) => {
  graphqlClient.setHeader('Authorization', `Bearer ${token}`);
};

/**
 * 인증 토큰을 헤더에서 제거하는 함수
 */
export const clearAuthToken = () => {
  graphqlClient.setHeader('Authorization', '');
};

/**
 * 로컬 스토리지에서 토큰을 가져와 헤더에 설정하는 함수
 */
export const initializeAuthToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
};

