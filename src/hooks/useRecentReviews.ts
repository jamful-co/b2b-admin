import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_RECENT_REVIEWS } from '@/graphql/queries/dashboard';
import { RecentReviews, GetRecentReviewsVariables } from '@/graphql/types';

/**
 * 최신 리뷰를 조회하는 함수
 */
const fetchRecentReviews = async (
  variables: GetRecentReviewsVariables
): Promise<RecentReviews> => {
  const data = await graphqlClient.request<{ getRecentReviews: RecentReviews }>(
    GET_RECENT_REVIEWS,
    variables
  );
  return data.getRecentReviews;
};

/**
 * 최신 리뷰 조회 커스텀 훅
 * 
 * @param companyId - 회사 ID
 * @param days - 조회할 일수 (기본값: 30)
 * @param limit - 조회할 리뷰 개수 (기본값: 50)
 * @param options - React Query 옵션
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useRecentReviews(1, 30, 50);
 * 
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     <p>평균 평점: {data.averageRating}</p>
 *     <p>총 리뷰 수: {data.totalCount}</p>
 *     {data.reviews.map((review, index) => (
 *       <div key={index}>
 *         <p>{review.providerName} - {review.rating}점</p>
 *         <p>{review.review}</p>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useRecentReviews = (
  companyId: number,
  days: number = 30,
  limit: number = 50,
  options = {}
) => {
  return useQuery<RecentReviews, Error>({
    queryKey: ['recentReviews', companyId, days, limit],
    queryFn: () => fetchRecentReviews({ companyId, days, limit }),
    enabled: !!companyId,
    ...options,
  });
};

