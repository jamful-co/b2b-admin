import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_MONTHLY_JAM_USAGE } from '@/graphql/queries/dashboard';
import { MonthlyJamUsage, GetMonthlyJamUsageVariables } from '@/graphql/types';

/**
 * 월간 잼 사용량을 조회하는 함수
 */
const fetchMonthlyJamUsage = async (
  variables: GetMonthlyJamUsageVariables
): Promise<MonthlyJamUsage> => {
  const data = await graphqlClient.request<{ getMonthlyJamUsage: MonthlyJamUsage }>(
    GET_MONTHLY_JAM_USAGE,
    variables
  );
  return data.getMonthlyJamUsage;
};

/**
 * 월간 잼 사용량 조회 커스텀 훅
 * 
 * @param companyId - 회사 ID
 * @param months - 조회할 개월 수 (기본값: 10)
 * @param options - React Query 옵션
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useMonthlyJamUsage(1, 10);
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     <p>전체 평균 사용량: {data.overallAverageUsage}잼</p>
 *     <p>총 사용량: {data.totalUsage}잼</p>
 *     {data.monthlyUsage.map((month) => (
 *       <div key={month.yearMonth}>
 *         <p>{month.yearMonth}: {month.averageUsage}잼</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useMonthlyJamUsage = (
  companyId: number,
  months: number = 10,
  options = {}
) => {
  return useQuery<MonthlyJamUsage, Error>({
    queryKey: ['monthlyJamUsage', companyId, months],
    queryFn: () => fetchMonthlyJamUsage({ companyId, months }),
    enabled: !!companyId,
    ...options,
  });
};

