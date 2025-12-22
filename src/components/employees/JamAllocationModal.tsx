import { useMemo, useState, useEffect, type ChangeEvent } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';
import { type B2bCredit } from '@/graphql/types';
import { useAllocateCredits } from '@/hooks/useAllocateCredits';
import { getCompanyId } from '@/lib/company';

type TargetEmployee = {
  id: number;
  name: string;
};

type JamAllocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** 크레딧 목록 (B2B 크레딧 요약에서 가져온 데이터) */
  credits?: B2bCredit[];
  /** 선택 대상 */
  targets?: TargetEmployee[];
};

export default function JamAllocationModal({
  isOpen,
  onClose,
  credits = [],
  targets = [],
}: JamAllocationModalProps) {

  console.log(targets)
  // 입력은 숫자만 허용
  const [amount, setAmount] = useState<string>('');
  // 만료 기간 (YYYY.MM.DD 형식)
  const [expiryDate, setExpiryDate] = useState<string>('');

  const companyId = getCompanyId();

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setExpiryDate('');
    }
  }, [isOpen]);
  const { mutate: allocateCredits, isPending } = useAllocateCredits();
  const selectedCount = targets.length;

  // 총 보유 잼 계산 (모든 크레딧의 balance 합계)
  const availableJam = useMemo(() => {
    return credits.reduce((sum, credit) => sum + credit.balance, 0);
  }, [credits]);

  // 만료되지 않은 크레딧 중 가장 늦은 만료일 찾기
  const latestExpiryDate = useMemo(() => {
    const validCredits = credits.filter(c => c.balance > 0 && !c.isExpired);
    if (validCredits.length === 0) return null;

    const dates = validCredits.map(c => new Date(c.expiryDate));
    return new Date(Math.max(...dates.map(d => d.getTime())));
  }, [credits]);

  const amountNumber = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const totalDeduction = useMemo(() => amountNumber * selectedCount, [amountNumber, selectedCount]);

  const isInsufficient = useMemo(
    () => amountNumber > 0 && totalDeduction > availableJam,
    [amountNumber, totalDeduction, availableJam]
  );

  // 할당 검증 로직
  const allocationValidation = useMemo(() => {
    if (amountNumber === 0 || !expiryDate) {
      return { isValid: true, error: '' };
    }

    // 날짜 파싱
    const dateParts = expiryDate.split('.');
    if (dateParts.length !== 3) {
      return { isValid: true, error: '' };
    }

    const year = dateParts[0].padStart(4, '0');
    const month = dateParts[1].padStart(2, '0');
    const day = dateParts[2].padStart(2, '0');
    const allocationExpiryDate = new Date(`${year}-${month}-${day}`);

    if (isNaN(allocationExpiryDate.getTime())) {
      return { isValid: true, error: '' };
    }

    // 총 할당량 계산
    const totalAmount = amountNumber * selectedCount;

    // 만료되지 않은 크레딧을 만료일 순으로 정렬
    const sortedCredits = [...credits]
      .filter(c => c.balance > 0 && !c.isExpired)
      .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

    if (sortedCredits.length === 0) {
      return { isValid: false, error: '사용 가능한 잼이 없습니다.' };
    }

    // 단일 크레딧으로 할당 가능한지 확인
    let canAllocateFromSingleCredit = false;

    for (const credit of sortedCredits) {
      const creditExpiryDate = new Date(credit.expiryDate);

      // 이 크레딧으로 전체 할당이 가능하고, 할당 만료일이 크레딧 만료일보다 이전인지 확인
      if (credit.balance >= totalAmount && allocationExpiryDate <= creditExpiryDate) {
        canAllocateFromSingleCredit = true;
        break;
      }
    }

    if (!canAllocateFromSingleCredit) {
      // 단일 크레딧으로 할당 불가능한 경우
      const hasEnoughInSingleCredit = sortedCredits.some(c => c.balance >= totalAmount);

      if (hasEnoughInSingleCredit) {
        // 잔액은 충분하지만 만료일이 문제
        const creditWithEnoughBalance = sortedCredits.find(c => c.balance >= totalAmount);
        if (creditWithEnoughBalance) {
          const creditExpiry = format(new Date(creditWithEnoughBalance.expiryDate), 'yyyy.M.d');
          return {
            isValid: false,
            error: `할당 만료일이 잼 만료일(${creditExpiry})을 초과할 수 없습니다.`
          };
        }
      } else {
        // 단일 크레딧에 충분한 잔액이 없음
        return {
          isValid: false,
          error: `단일 잼으로 ${totalAmount.toLocaleString()}잼을 할당할 수 없습니다. 잼은 혼합하여 사용할 수 없습니다.`
        };
      }
    }

    return { isValid: true, error: '' };
  }, [amountNumber, expiryDate, credits, selectedCount]);

  const isCtaEnabled = useMemo(
    () => selectedCount > 0 && amountNumber > 0 && !isInsufficient && expiryDate !== '' && allocationValidation.isValid,
    [selectedCount, amountNumber, isInsufficient, expiryDate, allocationValidation.isValid]
  );

  const visibleChips = targets.slice(0, 3);
  const remainingCount = Math.max(0, selectedCount - visibleChips.length);

  // 빠른 설정 버튼 비활성화 여부 계산
  const isQuickSetDisabled = (days: number) => {
    if (!latestExpiryDate) return true;
    const targetDate = addDays(new Date(), days);
    return targetDate > latestExpiryDate;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setAmount(digits);
  };

  // 날짜 입력 핸들러 (YYYY.MM.DD 형식)
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    // 점(.)으로 구분된 부분만 허용
    const parts = value.split('.');
    if (parts.length > 3) {
      value = parts.slice(0, 3).join('.');
    }
    setExpiryDate(value);
  };

  // 빠른 설정 버튼 핸들러
  const handleQuickSet = (days: number) => {
    const date = addDays(new Date(), days);
    const formatted = format(date, 'yyyy.M.d');
    setExpiryDate(formatted);
  };

  const handleConfirm = () => {
    if (!isCtaEnabled || isPending) return;

    // 날짜를 YYYY-MM-DD 형식으로 변환
    const dateParts = expiryDate.split('.');
    let formattedDate = expiryDate;
    if (dateParts.length === 3) {
      const year = dateParts[0].padStart(4, '0');
      const month = dateParts[1].padStart(2, '0');
      const day = dateParts[2].padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }

    // GraphQL mutation 호출
    allocateCredits(
      {
        input: {
          companyId,
          userIds:targets.map(t => t.id),
          creditsPerUser: amountNumber,
          expireDate: new Date(formattedDate),
          description: `${selectedCount}명에게 ${amountNumber}잼 할당`,
        },
      },
      {
        onSuccess: (data) => {
          // 성공 케이스 처리
          if (data.success && data.failedCount === 0) {
            // 모두 성공
            toast.success(`${data.successCount}명에게 잼이 성공적으로 할당되었습니다.`);
          } else if (data.successCount > 0 && data.failedCount > 0) {
            // 부분 성공
            toast.warning(
              `${data.successCount}명 성공, ${data.failedCount}명 실패했습니다.`,
              {
                description: data.results
                  .filter(r => !r.success)
                  .map(r => `유저 ID ${r.userId}: ${r.error}`)
                  .join(', '),
              }
            );
          } else {
            // 모두 실패
            toast.error(`잼 할당에 실패했습니다. (${data.failedCount}명 실패)`);
          }

          // 모달 닫기 (상태 초기화는 useEffect에서 처리)
          onClose();
        },
        onError: (error) => {
          // 에러 케이스 처리
          console.error('잼 할당 실패:', error);
          toast.error('잼 할당 중 오류가 발생했습니다.', {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[426px] p-6 gap-4 rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-4 w-full">
          <div className="text-[22px] font-semibold ">잼 할당</div>

          <div className="flex flex-col gap-2 w-full">
            <div className="text-[14px] font-semibold">
              대상({selectedCount}명)
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {visibleChips.map((t) => (
                <div
                  key={t.id}
                  className="rounded-[4px] bg-[#F7F7F7] px-[6px] py-[4px] text-[14px]  text-[#525E6A]"
                >
                  {t.name}
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="rounded-[4px] bg-[#F7F7F7] px-[6px] py-[4px] text-[14px]  text-[#525E6A]">
                  +{remainingCount}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="text-[14px] font-semibold  ">
              1인당 지급 잼{' '}
              <span className="font-normal text-[#6C7885]">(보유: {availableJam.toLocaleString()}잼)</span>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="relative w-full">
                <Input
                  value={amount}
                  onChange={handleChange}
                  autoFocus
                  inputMode="numeric"
                  placeholder=""
                  className={[
                    'w-full h-[44px] pr-10 text-[14px]  text-[#2E3A49]',
                    'rounded-[4px] border bg-white px-3',
                    isInsufficient ? 'border-[#F97066]' : 'border-[#E3E7EC] focus-visible:border-[#2E3A49]',
                    'focus-visible:ring-0',
                  ].join(' ')}
                />
                {amount !== '' && (
                  <button
                    type="button"
                    onClick={() => setAmount('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="입력 지우기"
                  >
                    <div className="rounded-full bg-[#AEB5BD] p-1">
                      <X className="h-3 w-3 text-white" />
                    </div>
                  </button>
                )}
              </div>

              {!isInsufficient && !allocationValidation.error && amountNumber > 0 && selectedCount > 0 && (
                <div className="text-[13px]  text-[#525E6A]">
                  총 <span className="font-bold">{totalDeduction.toLocaleString()}잼</span>이 차감됩니다
                </div>
              )}
              {isInsufficient && (
                <div className="text-[13px]  text-[#F97066]">잼이 부족합니다</div>
              )}
              {!isInsufficient && allocationValidation.error && (
                <div className="text-[13px]  text-[#F97066]">{allocationValidation.error}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="text-[14px] font-semibold">
              잼 만료 기간<span className="text-[#F97066]">*</span>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Input
                value={expiryDate}
                onChange={handleDateChange}
                placeholder="년도.월.일"
                className={[
                  'w-full h-[44px] text-[14px] text-[#2E3A49]',
                  'rounded-[4px] border bg-white px-3',
                  'border-[#E3E7EC] focus-visible:border-[#2E3A49]',
                  'focus-visible:ring-0',
                ].join(' ')}
              />

              <div className="flex gap-2 w-full flex-wrap">
                <button
                  type="button"
                  onClick={() => handleQuickSet(7)}
                  disabled={isQuickSetDisabled(7)}
                  className={[
                    'h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4]',
                    isQuickSetDisabled(7)
                      ? 'bg-[#F7F7F7] text-[#AEB5BD] cursor-not-allowed'
                      : 'bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors'
                  ].join(' ')}
                >
                  7일
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSet(30)}
                  disabled={isQuickSetDisabled(30)}
                  className={[
                    'h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4]',
                    isQuickSetDisabled(30)
                      ? 'bg-[#F7F7F7] text-[#AEB5BD] cursor-not-allowed'
                      : 'bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors'
                  ].join(' ')}
                >
                  1개월(30일)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSet(90)}
                  disabled={isQuickSetDisabled(90)}
                  className={[
                    'h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4]',
                    isQuickSetDisabled(90)
                      ? 'bg-[#F7F7F7] text-[#AEB5BD] cursor-not-allowed'
                      : 'bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors'
                  ].join(' ')}
                >
                  3개월(90일)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSet(180)}
                  disabled={isQuickSetDisabled(180)}
                  className={[
                    'h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4]',
                    isQuickSetDisabled(180)
                      ? 'bg-[#F7F7F7] text-[#AEB5BD] cursor-not-allowed'
                      : 'bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors'
                  ].join(' ')}
                >
                  6개월(180일)
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isPending}
            >
              취소
            </Button>
            <Button
              type="button"
              variant={!isCtaEnabled || isPending ? 'inactive' : 'active'}
              className="flex-1"
              onClick={handleConfirm}
              disabled={!isCtaEnabled || isPending}
            >
              {isPending ? '할당 중...' : '할당하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
