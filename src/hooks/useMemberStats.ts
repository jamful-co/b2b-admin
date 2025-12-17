import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_MEMBER_STATS } from '@/graphql/queries/dashboard';
import { MemberStats, GetMemberStatsVariables } from '@/graphql/types';

/**
 * 회원 통계를 조회하는 함수
 */
const fetchMemberStats = async (variables: GetMemberStatsVariables): Promise<MemberStats> => {
  const data = await graphqlClient.request<{ getMemberStats: MemberStats }>(
    GET_MEMBER_STATS,
    variables
  );
  return data.getMemberStats;
};

/**
 * 회원 통계 조회 커스텀 훅
 * 
 * @param companyId - 회사 ID
 * @param options - React Query 옵션
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useMemberStats(1);
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     <p>총 승인된 회원: {data.totalApprovedMembers}명</p>
 *     <p>구독 중인 회원: {data.subscribingMembers}명</p>
 *     <p>구독률: {data.subscriptionRate}%</p>
 *   </div>
 * );
 * ```
 */
export const useMemberStats = (companyId: number, options = {}) => {
  return useQuery<MemberStats, Error>({
    queryKey: ['memberStats', companyId],
    queryFn: () => fetchMemberStats({ companyId }),
    enabled: !!companyId,
    ...options,
  });
};

