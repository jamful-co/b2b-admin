import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_B2B_CREDIT_SUMMARY } from '@/graphql/queries/dashboard';
import { B2bCreditSummary, GetB2bCreditSummaryVariables } from '@/graphql/types';

/**
 * B2B 크레딧 요약을 조회하는 함수
 */
const fetchB2bCreditSummary = async (
  variables: GetB2bCreditSummaryVariables
): Promise<B2bCreditSummary> => {
  const data = await graphqlClient.request<{ getB2bCreditSummary: B2bCreditSummary }>(
    GET_B2B_CREDIT_SUMMARY,
    variables
  );
  return data.getB2bCreditSummary;
};

/**
 * B2B 크레딧 요약 조회 커스텀 훅
 * 
 * @param companyId - 회사 ID
 * @param options - React Query 옵션
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useB2bCreditSummary(1);
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     <p>총 충전 금액: {data.totalCharged.toLocaleString()}원</p>
 *     <p>총 잔액: {data.totalBalance.toLocaleString()}원</p>
 *     <p>사용률: {data.usageRate}%</p>
 *     {data.expiringSoon && (
 *       <p>만료 예정: {data.expiringSoon.amount}원 ({data.expiringSoon.daysUntilExpiry}일 후)</p>
 *     )}
 *   </div>
 * );
 * ```
 */
export const useB2bCreditSummary = (companyId: number, options = {}) => {
  return useQuery<B2bCreditSummary, Error>({
    queryKey: ['b2bCreditSummary', companyId],
    queryFn: () => fetchB2bCreditSummary({ companyId }),
    enabled: !!companyId,
    ...options,
  });
};

