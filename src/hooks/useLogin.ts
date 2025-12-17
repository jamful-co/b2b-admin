import { useMutation } from '@tanstack/react-query';
import { graphqlClient, setAuthToken } from '@/lib/graphql-client';
import { LOGIN_MUTATION } from '@/graphql/mutations/auth';
import { LoginResponse, LoginVariables } from '@/graphql/types';
import { setCompanyId } from '@/lib/company';

/**
 * 로그인 mutation을 실행하는 함수
 */
const loginMutation = async (variables: LoginVariables): Promise<LoginResponse> => {
  const data = await graphqlClient.request<{ login: LoginResponse }>(LOGIN_MUTATION, variables);
  return data.login;
};

/**
 * 로그인 커스텀 훅
 * 
 * @example
 * ```tsx
 * const { mutate: login, isPending, isError, error } = useLogin();
 * 
 * const handleLogin = () => {
 *   login(
 *     { email: 'user@example.com', password: 'password123' },
 *     {
 *       onSuccess: (data) => {
 *         console.log('로그인 성공:', data);
 *       },
 *       onError: (error) => {
 *         console.error('로그인 실패:', error);
 *       }
 *     }
 *   );
 * };
 * ```
 */
export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: loginMutation,
    onSuccess: (data) => {
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');

      // GraphQL 클라이언트에 인증 토큰 설정
      setAuthToken(data.token);

      // companyId를 로컬 스토리지에 저장
      if (data.user.companyId) {
        setCompanyId(data.user.companyId);
      }
    },
  });
};

