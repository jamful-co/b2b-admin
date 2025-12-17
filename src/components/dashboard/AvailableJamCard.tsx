import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useB2bCreditSummary } from '@/hooks/useB2bCreditSummary';
import { getCompanyId } from '@/lib/company';
import { format } from 'date-fns';

export default function AvailableJamCard() {
  const companyId = getCompanyId();

  // GraphQL로 B2B 크레딧 요약 조회
  const { data: creditSummary, isLoading } = useB2bCreditSummary(companyId);

  // 데이터 계산
  const total = creditSummary?.totalCharged || 150000;
  const current = creditSummary?.totalBalance || 101250;
  const percentage = total > 0 ? ((total - current) / total) * 100 : 0; // 사용률

  // 만료 예정일 포맷팅
  const expiryText = React.useMemo(() => {
    if (creditSummary?.expiringSoon?.expiryDate) {
      try {
        const expiryDate = new Date(creditSummary.expiringSoon.expiryDate);
        return `${format(expiryDate, 'yyyy.M.d')}일까지 사용 가능`;
      } catch (e) {
        return '2026.5.9일까지 사용 가능';
      }
    }
    // 가장 빠른 만료일 찾기
    if (creditSummary?.credits && creditSummary.credits.length > 0) {
      const sortedCredits = [...creditSummary.credits]
        .filter(c => !c.isExpired)
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

      if (sortedCredits.length > 0) {
        try {
          const expiryDate = new Date(sortedCredits[0].expiryDate);
          return `${format(expiryDate, 'yyyy.M.d')}일까지 사용 가능`;
        } catch (e) {
          return '2026.5.9일까지 사용 가능';
        }
      }
    }
    return '2026.5.9일까지 사용 가능';
  }, [creditSummary]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">사용 가능한 잼</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-white font-bold text-sm">
              J
            </div>
            <div className="text-2xl font-bold text-gray-900">로딩 중...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">사용 가능한 잼</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-white font-bold text-sm">
            J
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {current.toLocaleString()}{' '}
            <span className="text-gray-300 font-normal">/ {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="relative mb-2">
          <Progress
            value={percentage}
            className="h-3 bg-gray-100"
            indicatorClassName="bg-yellow-400"
          />
          <span className="absolute right-0 -top-6 text-sm font-bold text-gray-900">
            {percentage.toFixed(1)}%
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-4">{expiryText}</p>
      </CardContent>
    </Card>
  );
}
