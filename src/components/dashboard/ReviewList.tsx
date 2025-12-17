import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import { Review } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { useRecentReviews } from '@/hooks/useRecentReviews';
import { getCompanyId } from '@/lib/company';

export default function ReviewList() {
  const scrollRef = React.useRef(null);
  const [scrollState, setScrollState] = React.useState({
    isTop: true,
    isBottom: false,
  });

  const companyId = getCompanyId();

  // GraphQL로 최신 리뷰 조회
  const { data: graphqlReviews, isLoading: isGraphqlLoading } = useRecentReviews(companyId, 30, 50);

  // 기존 mock 데이터 (fallback용)
  const { data: mockReviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => Review.list('-date', 50),
    initialData: [],
  });

  // GraphQL 데이터를 기존 형식으로 변환
  const reviews = React.useMemo(() => {
    if (graphqlReviews?.reviews && graphqlReviews.reviews.length > 0) {
      return graphqlReviews.reviews.map((review, index) => ({
        id: `gql-review-${index}`,
        rating: review.rating,
        content: review.review,
        author_name: review.providerName,
        date: review.createdAt,
      }));
    }
    // GraphQL 데이터가 없으면 mock 데이터 사용
    return mockReviews;
  }, [graphqlReviews, mockReviews]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setScrollState({
        isTop: scrollTop === 0,
        isBottom: Math.ceil(scrollTop + clientHeight) >= scrollHeight,
      });
    }
  };

  React.useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => currentRef.removeEventListener('scroll', checkScroll);
    }
  }, [reviews]);

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-white" style={{ width: '290px' }}>
      <CardHeader className="flex-shrink-0 z-20 bg-white" style={{ padding: '24px', paddingBottom: '8px' }}>
        <CardTitle
          style={{
            fontSize: '18px',
            fontWeight: 600,
            marginBottom: '16px'
          }}
        >
          최신 임직원 리뷰
        </CardTitle>
      </CardHeader>

      <div className="relative flex-1 min-h-0">
        {/* Top Gradient */}
        <div
          className={`absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            !scrollState.isTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable Content */}
        <div ref={scrollRef} className="h-full overflow-y-auto custom-scrollbar" style={{ padding: '0 24px 24px 24px' }}>
          <div className="pt-2 pb-10">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="pb-6 last:border-0 last:pb-0"
                style={{
                  borderBottom: index < reviews.length - 1 ? '1px solid var(--gray-20, #E2E8F0)' : 'none'
                }}
              >
                <div className="flex items-center gap-1 mb-2">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                </div>
                <p className="text-sm text-gray-800 font-medium mb-1 line-clamp-2">
                  {review.content}
                </p>
                <div
                  className="flex items-center gap-1"
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'var(--text-tertiary, #6C7885)'
                  }}
                >
                  <span>{review.author_name}</span>
                  <span>·</span>
                  <span>{format(new Date(review.date), 'yyyy-MM-dd HH:mm')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Gradient */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            !scrollState.isBottom && reviews.length > 0 ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </Card>
  );
}
