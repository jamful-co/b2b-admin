import { useState, useEffect, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Loader2 } from 'lucide-react';
import { CreateEmployeeGroupInput, EmployeeGroupData, RenewalPeriodType } from '@/graphql/types';
import { SimpleSelect } from '@/components/ui/select';

// Extended type for form submission that includes isActive for edit mode
type GroupFormData = Partial<CreateEmployeeGroupInput> & { isActive?: boolean };

interface GroupAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GroupFormData) => void;
  isSubmitting: boolean;
  editingGroup?: EmployeeGroupData | null;
}

export default function GroupAddModal({ isOpen, onClose, onSubmit, isSubmitting, editingGroup }: GroupAddModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    credits: '',
    renewDate: '1',
    renewalPeriodType: RenewalPeriodType.MONTHLY,
    isActive: true,
  });

  const isEditMode = !!editingGroup;

  // 모달이 열릴 때 폼 초기화 또는 편집 데이터 로드
  useEffect(() => {
    if (isOpen) {
      if (editingGroup) {
        // 편집 모드: 기존 데이터로 초기화
        console.log('Editing group data:', editingGroup);
        setFormData({
          name: editingGroup.name,
          credits: String(editingGroup.credits),
          renewDate: String(editingGroup.renewDate),
          renewalPeriodType: editingGroup.renewalPeriodType || RenewalPeriodType.MONTHLY,
          isActive: editingGroup.isActive,
        });
      } else {
        // 추가 모드: 기본값으로 초기화
        setFormData({
          name: '',
          credits: '',
          renewDate: '1',
          renewalPeriodType: RenewalPeriodType.MONTHLY,
          isActive: true,
        });
      }
    }
  }, [isOpen, editingGroup]);

  const isValid =
    formData.name.trim() !== '' && formData.credits !== '' && formData.renewDate !== '';

  // 숫자만 허용
  const onlyDigits = (value: string) => value.replace(/[^0-9]/g, '');

  // 숫자에 콤마 포맷팅
  const formatNumberWithCommas = (value: string) => {
    const digits = onlyDigits(value);
    if (digits === '') return '';
    return Number(digits).toLocaleString('ko-KR');
  };

  // 콤마가 포함된 숫자 문자열에서 숫자만 추출
  const parseFormattedNumber = (value: string) => {
    return onlyDigits(value);
  };

  // 충전일 범위 보정(0~31, 0은 월말)
  const clampRechargeDay = (value: string) => {
    const digits = onlyDigits(value);
    if (digits === '') return '';
    const n = Number(digits);
    if (Number.isNaN(n)) return '';
    return String(Math.min(31, Math.max(0, n)));
  };

  // 갱신 주기에 따른 레이블 반환
  const getRenewDateLabel = () => {
    switch (formData.renewalPeriodType) {
      case RenewalPeriodType.MONTHLY:
        return '월 단위 충전일';
      case RenewalPeriodType.QUARTERLY:
        return '분기 단위 충전일';
      case RenewalPeriodType.YEARLY:
        return '연 단위 충전일';
      default:
        return '충전일';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const submitData = {
        name: formData.name,
        credits: Number(formData.credits),
        renewDate: Number(formData.renewDate),
        rolloverPercentage: 0,
        renewalPeriodType: formData.renewalPeriodType,
        ...(isEditMode && { isActive: formData.isActive }),
      };
      console.log('Submitting group data:', submitData);
      onSubmit(submitData);
    }
  };

  // 갱신 주기 타입 옵션
  const renewalPeriodTypeOptions = [
    { value: RenewalPeriodType.MONTHLY, label: '월 단위' },
    { value: RenewalPeriodType.QUARTERLY, label: '분기 단위' },
    { value: RenewalPeriodType.YEARLY, label: '연 단위' },
  ];

  const quickDays = ['1', '5', '10', '15', '25'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[426px] max-w-[calc(100vw-32px)] p-6 bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-semibold leading-[1.4] text-[#141414]">
            {isEditMode ? '그룹 수정' : '그룹 추가'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[14px] font-semibold leading-[1.4] text-[#141414]">
              그룹명*
            </Label>
            <div className="relative w-[378px] max-w-full">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-[44px] rounded-[8px] border-[#E9EBED] pr-10 text-[14px] leading-[1.4] placeholder:text-[#AEB5BD] focus-visible:border-[#2E3A49] focus-visible:ring-0"
                autoFocus
              />
              {formData.name && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, name: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AEB5BD] hover:text-[#6C7885]"
                  aria-label="그룹명 지우기"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits" className="text-[14px] font-semibold leading-[1.4] text-[#141414]">
              충전 포인트*
            </Label>
            <div className="w-[378px] max-w-full">
              <Input
                id="credits"
                inputMode="numeric"
                value={formData.credits ? formatNumberWithCommas(formData.credits) : ''}
                onChange={(e) => {
                  const numericValue = parseFormattedNumber(e.target.value);
                  setFormData({ ...formData, credits: numericValue });
                }}
                className="h-[44px] rounded-[8px] border-[#E9EBED] text-[14px] leading-[1.4] placeholder:text-[#AEB5BD] focus-visible:border-[#2E3A49] focus-visible:ring-0"
                placeholder="예: 1,000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewalPeriodType" className="text-[14px] font-semibold leading-[1.4] text-[#141414]">
              갱신 주기*
            </Label>
            <div className="w-[378px] max-w-full">
              <SimpleSelect
                value={formData.renewalPeriodType}
                onValueChange={(value) => setFormData({ ...formData, renewalPeriodType: value as RenewalPeriodType })}
                items={renewalPeriodTypeOptions}
                placeholder="갱신 주기를 선택하세요"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewDate" className="text-[14px] font-semibold leading-[1.4] text-[#141414]">
              {getRenewDateLabel()}*
            </Label>
            <div className="w-[378px] max-w-full space-y-2">
              <Input
                id="renewDate"
                inputMode="numeric"
                value={formData.renewDate}
                onChange={(e) => {
                  const value = onlyDigits(e.target.value);
                  setFormData({ ...formData, renewDate: clampRechargeDay(value) });
                }}
                className="h-[44px] rounded-[8px] border-[#E9EBED] text-[14px] leading-[1.4] placeholder:text-[#AEB5BD] focus-visible:border-[#2E3A49] focus-visible:ring-0"
                placeholder="예: 18"
              />
              <div className="flex flex-wrap gap-2">
                {quickDays.map((day) => {
                  const selected = formData.renewDate === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setFormData({ ...formData, renewDate: day })}
                      className={[
                        'h-[34px] rounded-[4px] px-2 py-1.5 text-[14px] font-semibold leading-[1.4] transition-colors',
                        selected ? 'bg-[#E9EBED] text-[#141414]' : 'bg-[#F7F7F7] text-[#525E6A] hover:bg-[#E9EBED]',
                      ].join(' ')}
                    >
                      {day}일
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="isActive" className="text-[14px] font-semibold leading-[1.4] text-[#141414]">
              그룹 활성화
            </Label>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              className="data-[state=checked]:bg-[#282821]"
            />
          </div>

          <DialogFooter className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-[44px] rounded-[4px] border-[#CDD3DB] bg-white text-[14px] font-semibold leading-[1.4] text-[#6C7885] hover:bg-white"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={[
                'flex-1 h-[44px] rounded-[4px] px-6 py-3 text-[14px] font-semibold leading-[1.4] transition-colors',
                isValid && !isSubmitting ? 'bg-[#282821] text-white hover:bg-[#282821]/90' : 'bg-[#D9D9D9] text-[#6C7885] opacity-60 cursor-not-allowed',
              ].join(' ')}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditMode ? '수정' : '생성'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
