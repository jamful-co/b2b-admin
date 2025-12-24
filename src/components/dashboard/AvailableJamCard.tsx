import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { useB2bCreditSummary } from '@/hooks/useB2bCreditSummary';
import { getCompanyId } from '@/lib/company';
import { format } from 'date-fns';
import JamIcon from '@/assets/icons/jam.svg?react';

export default function AvailableJamCard() {
  const companyId = getCompanyId();

  // GraphQL로 B2B 크레딧 요약 조회
  const { data: creditSummary, isLoading } = useB2bCreditSummary(companyId);

  // 데이터 계산
  const total = creditSummary?.totalCharged || 0;
  const current = creditSummary?.totalBalance || 0;
  const percentage = total > 0 ? (current / total) * 100 : 0; // 남은 비율(디자인 기준)

  // 만료 예정일 포맷팅
  const expiryText = React.useMemo(() => {
    if (creditSummary?.expiringSoon?.expiryDate) {
      try {
        const expiryDate = new Date(creditSummary.expiringSoon.expiryDate);
        return `${format(expiryDate, 'yyyy.M.d')}일까지 사용 가능`;
      } catch {
        return '';
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
        } catch {
          return '';
        }
      }
    }
    return '';
  }, [creditSummary]);

  // 유효기간 목록(만료되지 않은 크레딧만, 빠른 만료일 순)
  const credits = React.useMemo(() => {
    const list = creditSummary?.credits ?? [];
    return [...list]
      .filter(c => !c.isExpired)
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [creditSummary?.credits]);

  const hasCredits = credits.length > 0;
  // 크레딧이 1개 이상이면 "유효기간 보기"는 접힌 상태가 기본
  const [isValidityOpen, setIsValidityOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Card className="border-[#E3E7EC] rounded-[8px]">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-4">
            <p className="text-[14px] font-semibold leading-[1.4] text-[#525E6A]">사용 가능한 잼</p>
            <div className="flex items-center gap-1">
              <JamIcon className="w-6 h-6" />
              <p className="text-[22px] font-bold leading-[1.4] text-[#222]">로딩 중...</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-[#E3E7EC] rounded-[8px]">
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-4">
          <p className="text-[14px] font-semibold leading-[1.4] text-[#525E6A]">사용 가능한 잼</p>
          <div className="flex items-center gap-1">
            <JamIcon className="w-6 h-6" />
            <p className="text-[22px] font-bold leading-[1.4] text-[#222]">{current.toLocaleString()}</p>
            <p className="text-[18px] font-semibold leading-[1.4] text-[#6C7885]">/ {total.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="w-full text-right text-[14px] font-semibold leading-[1.4] text-[#141414]">
            {percentage.toFixed(1)}%
          </p>
          <Progress
            value={percentage}
            className="h-[11px] bg-[#EDEDEC] rounded-[99px]"
            indicatorClassName="bg-[#FEE666] rounded-[99px]"
          />

          {hasCredits ? (
            <Collapsible open={isValidityOpen} onOpenChange={setIsValidityOpen}>
              <div className="flex flex-col gap-2">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[#6C7885] text-[13px] leading-[1.4]"
                  >
                    <span>{isValidityOpen ? '유효기간' : '유효기간 보기'}</span>
                    <ChevronDown
                      className={`size-[18px] text-[#AEB5BD] transition-transform ${
                        isValidityOpen ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <ul className="list-disc pl-5 text-[#6C7885] text-[12px] leading-[1.4] whitespace-pre-wrap">
                    {credits.map(c => {
                      // 유효기간 날짜 포맷
                      const formattedDate = format(new Date(c.expiryDate), 'yyyy.M.d');

                      return (
                        <li key={c.b2bCreditId}>
                          <span className="font-bold">{Number(c.balance).toLocaleString()}잼:</span>
                          <span className="font-normal"> {formattedDate}일까지 사용 가능</span>
                        </li>
                      );
                    })}
                  </ul>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ) : (
            <p className="text-[#6C7885] text-[12px] leading-[1.4]">{expiryText}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
