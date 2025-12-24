import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
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
  const { data: graphqlReviews } = useRecentReviews(companyId, 30, 50);

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
    return [];
  }, [graphqlReviews]);

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
    <Card className="h-full w-full overflow-hidden bg-white rounded-[8px] border-[#E3E7EC] pl-6 pt-6 flex flex-col gap-4">
      <div className="text-[18px] font-semibold leading-[1.4] text-[color:var(--text-primary,#141414)]">
        최신 임직원 리뷰
      </div>

      <div className="relative flex-1 min-h-0 w-full">
        {/* Top Gradient */}
        <div
          className={`absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            !scrollState.isTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable Content */}
        <div ref={scrollRef} className="h-full overflow-y-auto custom-scrollbar">
          <div className="pb-10 pr-6">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className="flex flex-col justify-center gap-1 min-h-[72px] py-3 border-b border-[#E2E8F0] last:border-b-0"
                style={{
                  borderBottom: index < reviews.length - 1 ? '1px solid var(--gray-20, #E2E8F0)' : 'none',
                }}
              >
                <div className="flex items-center gap-0.5">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                </div>
                <p className="text-sm font-normal leading-[1.4] text-[color:var(--text-primary,#141414)] whitespace-pre-wrap">
                  {review.content}
                </p>
                <div
                  className="flex items-center gap-1 text-xs leading-[1.4] text-[color:var(--text-tertiary,#6C7885)]"
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: 'var(--text-tertiary, #6C7885)',
                  }}
                >
                  <span>{review.author_name}</span>
                  <span>・</span>
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
