import { useMemo, useState, type ChangeEvent } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { format, addDays } from 'date-fns';

type TargetEmployee = {
  id: string;
  name: string;
};

type JamAllocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amountPerPerson: number, expiryDate: string) => void;
  /** 보유 잼 (총 보유량) */
  availableJam?: number;
  /** 선택 대상 */
  targets?: TargetEmployee[];
};

export default function JamAllocationModal({
  isOpen,
  onClose,
  onConfirm,
  availableJam = 0,
  targets = [],
}: JamAllocationModalProps) {
  // 입력은 숫자만 허용
  const [amount, setAmount] = useState<string>('');
  // 만료 기간 (YYYY.MM.DD 형식)
  const [expiryDate, setExpiryDate] = useState<string>('');

  const selectedCount = targets.length;

  const amountNumber = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const totalDeduction = useMemo(() => amountNumber * selectedCount, [amountNumber, selectedCount]);
  const isInsufficient = useMemo(
    () => amountNumber > 0 && totalDeduction > availableJam,
    [amountNumber, totalDeduction, availableJam]
  );
  const isCtaEnabled = useMemo(
    () => selectedCount > 0 && amountNumber > 0 && !isInsufficient && expiryDate !== '',
    [selectedCount, amountNumber, isInsufficient, expiryDate]
  );

  const visibleChips = targets.slice(0, 3);
  const remainingCount = Math.max(0, selectedCount - visibleChips.length);

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
    if (!isCtaEnabled) return;
    // 날짜를 YYYY-MM-DD 형식으로 변환하여 전달
    const dateParts = expiryDate.split('.');
    let formattedDate = expiryDate;
    if (dateParts.length === 3) {
      const year = dateParts[0].padStart(4, '0');
      const month = dateParts[1].padStart(2, '0');
      const day = dateParts[2].padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }
    onConfirm(amountNumber, formattedDate);
    setAmount('');
    setExpiryDate('');
    onClose();
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
              <span className="font-normal text-[#6C7885]">(보유: {availableJam}잼)</span>
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

              {!isInsufficient && amountNumber > 0 && selectedCount > 0 && (
                <div className="text-[13px]  text-[#525E6A]">
                  총 <span className="font-bold">{totalDeduction}잼</span>이 차감됩니다
                </div>
              )}
              {isInsufficient && (
                <div className="text-[13px]  text-[#F97066]">잼이 부족합니다</div>
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
                  className="h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4] bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors"
                >
                  7일
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSet(30)}
                  className="h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4] bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors"
                >
                  1개월(30일)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSet(90)}
                  className="h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4] bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors"
                >
                  3개월(90일)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSet(180)}
                  className="h-[36px] rounded-[4px] px-2 py-1.5 text-[13px] font-normal leading-[1.4] bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED] transition-colors"
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
            >
              취소
            </Button>
            <Button
              type="button"
              variant={!isCtaEnabled ? 'inactive' : 'active'}
              className="flex-1"
              onClick={handleConfirm}
            >
              할당하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
