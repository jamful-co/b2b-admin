import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function ReviewList() {
  const scrollRef = React.useRef(null);
  const [scrollState, setScrollState] = React.useState({
    isTop: true,
    isBottom: false
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => base44.entities.Review.list('-date', 50),
    initialData: [],
  });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setScrollState({
        isTop: scrollTop === 0,
        isBottom: Math.ceil(scrollTop + clientHeight) >= scrollHeight
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
    <Card className="shadow-sm border-gray-100 h-full flex flex-col overflow-hidden bg-white">
      <CardHeader className="pb-4 flex-shrink-0 z-20 bg-white">
        <CardTitle className="text-lg font-bold text-gray-900">최신 임직원 리뷰</CardTitle>
      </CardHeader>
      
      <div className="relative flex-1 min-h-0">
        {/* Top Gradient */}
        <div 
          className={`absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            !scrollState.isTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable Content */}
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto px-6 pb-6 custom-scrollbar"
        >
          <div className="space-y-6 pt-2 pb-10">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-1 mb-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} 
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-800 font-medium mb-1 line-clamp-2">
                  {review.content}
                </p>
                <div className="flex items-center text-xs text-gray-400 gap-1">
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