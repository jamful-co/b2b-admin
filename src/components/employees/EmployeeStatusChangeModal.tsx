import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SimpleSelect } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { EmployeeStatus } from '@/api/entities';
import { format, parse } from 'date-fns';
import { AlertCircle, CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useUpdateEmployeeStatus } from '@/hooks/useUpdateEmployeeStatus';
import { useEmployeeGroups } from '@/hooks/useEmployeeGroup';
import { getCompanyId } from '@/lib/company';
import { EmployeeStatusAction, ApproverType, type EmployeeTableData } from '@/graphql/types';

interface EmployeeStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeTableData | null;
}

// 상태 라벨 매핑 (테이블 재직상태 렌더링 로직과 동일)
const statusLabels: Record<EmployeeStatus, string> = {
  [EmployeeStatus.PENDING]: '승인 대기',
  [EmployeeStatus.REJECTED]: '승인 거절',
  [EmployeeStatus.ACTIVE]: '재직중',
  [EmployeeStatus.LEAVING]: '퇴사 예정',
  [EmployeeStatus.LEFT]: '퇴사',
};

// 상태별 배지 스타일
const getStatusBadgeStyle = (status: EmployeeStatus) => {
  switch (status) {
    case EmployeeStatus.PENDING:
      return 'bg-[#F2FAFF] text-[#009DFF]';
    case EmployeeStatus.REJECTED:
      return 'bg-[#FEF3F2] text-[#F04438]';
    case EmployeeStatus.ACTIVE:
      return 'bg-[#E8FFF1] text-[#12B76A]';
    case EmployeeStatus.LEAVING:
      return 'bg-[#FCF4D0] text-[#EA981E]';
    case EmployeeStatus.LEFT:
      return 'bg-[#F4F4F4] text-[#6C7885]';
    default:
      return 'bg-[#F4F4F4] text-[#6C7885]';
  }
};

// 상태 배지 컴포넌트
const StatusBadge = ({ 
  status, 
  label, 
  isHovered = false 
}: { 
  status: EmployeeStatus; 
  label: string;
  isHovered?: boolean;
}) => {
  // 호버 시 노란색 배경 적용 (특히 REJECTED 상태)
  const hoverStyle = isHovered && status === EmployeeStatus.REJECTED 
    ? 'bg-[#FFFDD2]' 
    : '';
  
  return (
    <span className={cn(
      'inline-flex items-center justify-center rounded-full px-3 py-[3px] text-sm font-semibold leading-[1.4]',
      getStatusBadgeStyle(status),
      hoverStyle
    )}>
      {label}
    </span>
  );
};

export default function EmployeeStatusChangeModal({
  isOpen,
  onClose,
  employee,
}: EmployeeStatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [resignationDate, setResignationDate] = useState<Date | undefined>(undefined);
  const [dateInputValue, setDateInputValue] = useState<string>('');
  const [dateInputError, setDateInputError] = useState<string>('');
  const [dateValidation, setDateValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const companyId = getCompanyId();

  // 그룹 목록 가져오기 (GraphQL)
  const { data: groupsData } = useEmployeeGroups(companyId);
  const groups = groupsData?.groups ?? [];

  // 임직원 상태 변경 mutation
  const { mutate: updateEmployeeStatus, isPending: isMutationPending } = useUpdateEmployeeStatus();

  useEffect(() => {
    if (employee) {
      setSelectedStatus(employee.status);

      // 기존 그룹 설정 - 그룹명으로 그룹 ID 찾기
      if (employee.groupName && groups.length > 0) {
        const matchingGroup = groups.find(g => g.name === employee.groupName);
        setSelectedGroupId(matchingGroup?.employeeGroupId ?? null);
      } else {
        setSelectedGroupId(null);
      }

      // 기존 퇴사일이 있으면 설정
      if (employee.leaveDate) {
        const date = new Date(employee.leaveDate);
        setResignationDate(date);
        setDateInputValue(format(date, 'yyyy.MM.dd'));
      } else {
        setResignationDate(undefined);
        setDateInputValue('');
      }
    }
  }, [employee, groups]);

  // 날짜 유효성 검사
  useEffect(() => {
    if (!resignationDate) {
      setDateValidation(null);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(resignationDate);
    selectedDate.setHours(0, 0, 0, 0);

    const currentStatus = employee?.status as EmployeeStatus;

    if (selectedStatus === EmployeeStatus.LEAVING) {
      // 퇴사 예정: 미래 날짜만 가능
      if (selectedDate > today) {
        setDateValidation({ isValid: true, message: '퇴사 예정일 설정 가능' });
      } else {
        setDateValidation({ isValid: false, message: '퇴사 예정은 미래 날짜만 선택 가능합니다.' });
      }
    } else if (selectedStatus === EmployeeStatus.LEFT) {
      // 퇴사: 오늘이거나 과거 날짜만 가능
      if (selectedDate <= today) {
        setDateValidation({ isValid: true, message: '퇴사일 설정 가능' });
      } else {
        setDateValidation({ isValid: false, message: '퇴사는 오늘이거나 과거 날짜만 선택 가능합니다.' });
      }
    } else if (currentStatus === EmployeeStatus.LEAVING) {
      // LEAVING 상태에서 날짜만 변경하는 경우: 모든 날짜 허용
      // 날짜에 따라 자동으로 LEAVING/LEFT 결정됨
      setDateValidation({ isValid: true, message: '날짜 설정 가능' });
    }
  }, [resignationDate, selectedStatus, employee]);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);

    // 퇴사 상태가 아닌 경우 날짜 초기화
    if (value !== EmployeeStatus.LEAVING && value !== EmployeeStatus.LEFT) {
      setResignationDate(undefined);
      setDateInputValue('');
      setDateInputError('');
      setDateValidation(null);
    }
  };

  const handleSaveClick = () => {
    if (!employee) return;

    const currentStatus = employee.status as EmployeeStatus;

    // 날짜가 필요한 상태인데 유효하지 않은 경우 저장 불가
    if (
      (selectedStatus === EmployeeStatus.LEAVING || selectedStatus === EmployeeStatus.LEFT) &&
      (!resignationDate || !dateValidation?.isValid)
    ) {
      return;
    }

    // LEAVING 상태에서 날짜만 변경하는 경우: 날짜에 따라 자동으로 액션 결정
    let finalStatus = selectedStatus;
    let action: EmployeeStatusAction;

    if (currentStatus === EmployeeStatus.LEAVING && selectedStatus === EmployeeStatus.LEAVING && resignationDate) {
      // LEAVING 상태에서 날짜만 변경: 날짜에 따라 자동 전환
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(resignationDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        // 과거/오늘 날짜 선택 시 자동으로 LEFT로 전환
        finalStatus = EmployeeStatus.LEFT;
        action = EmployeeStatusAction.LEAVE;
      } else {
        // 미래 날짜는 LEAVING 유지
        action = EmployeeStatusAction.SCHEDULE_LEAVE;
      }
    } else {
      // 일반적인 상태 전환
      switch (selectedStatus) {
        case EmployeeStatus.ACTIVE:
          action = EmployeeStatusAction.APPROVE;
          break;
        case EmployeeStatus.REJECTED:
          action = EmployeeStatusAction.REJECT;
          break;
        case EmployeeStatus.LEAVING:
          action = EmployeeStatusAction.SCHEDULE_LEAVE;
          break;
        case EmployeeStatus.LEFT:
          action = EmployeeStatusAction.LEAVE;
          break;
        default:
          action = EmployeeStatusAction.APPROVE;
      }
    }

    // GraphQL mutation 호출
    updateEmployeeStatus(
      {
        input: {
          companyId,
          id: employee.id,
          action,
          approverType: ApproverType.ADMIN,
          approverId: companyId,
          leaveDate: resignationDate ? format(resignationDate, 'yyyy-MM-dd') : undefined,
          employeeGroupId: selectedGroupId ?? undefined,
          rejectionReason: action === EmployeeStatusAction.REJECT ? '어드민 거절' : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('직원 상태가 변경되었습니다.');
          onClose();
        },
        onError: (error) => {
          console.error('Failed to update employee status:', error);
          toast.error('직원 상태 변경에 실패했습니다.');
        },
      }
    );
  };

  // 현재 상태 확인 함수
  const getCurrentStatus = (): EmployeeStatus => {
    if (!employee) return EmployeeStatus.PENDING;
    return employee.status as EmployeeStatus;
  };

  // 현재 상태에 따라 허용되는 상태 전환 목록 결정
  const getAvailableStatusTransitions = (): EmployeeStatus[] => {
    if (!employee) return [];

    const currentStatus = getCurrentStatus();

    // 재직중 -> 재직중, 퇴사 예정, 퇴사
    if (currentStatus === EmployeeStatus.ACTIVE) {
      return [EmployeeStatus.ACTIVE, EmployeeStatus.LEAVING, EmployeeStatus.LEFT];
    }

    // 승인 대기 -> 승인 대기, 재직중, 승인 거절
    if (currentStatus === EmployeeStatus.PENDING) {
      return [EmployeeStatus.PENDING, EmployeeStatus.ACTIVE, EmployeeStatus.REJECTED];
    }

    // 승인 거절 -> 승인 거절, 재직중
    if (currentStatus === EmployeeStatus.REJECTED) {
      return [EmployeeStatus.REJECTED, EmployeeStatus.ACTIVE];
    }

    // 퇴사 예정 -> 퇴사 예정, 퇴사 (날짜 변경 가능)
    if (currentStatus === EmployeeStatus.LEAVING) {
      return [EmployeeStatus.LEAVING, EmployeeStatus.LEFT];
    }

    // 퇴사 -> 퇴사만 (날짜 변경 가능)
    if (currentStatus === EmployeeStatus.LEFT) {
      return [EmployeeStatus.LEFT];
    }

    // 기타 상태는 모든 상태로 전환 가능 (기본 동작)
    return [
      EmployeeStatus.ACTIVE,
      EmployeeStatus.LEAVING,
      EmployeeStatus.LEFT,
      EmployeeStatus.PENDING,
      EmployeeStatus.REJECTED,
    ];
  };

  const statusItems = getAvailableStatusTransitions().map((status) => ({
    value: status,
    label: statusLabels[status]
  }));

  // 커스텀 렌더링 함수들
  const renderStatusItem = (item: { value: string; label: string }) => {
    const status = item.value as EmployeeStatus;
    return (
      <StatusBadge status={status} label={item.label} />
    );
  };

  const renderStatusValue = (selectedItem: { value: string; label: string } | undefined) => {
    if (!selectedItem) return null;
    const status = selectedItem.value as EmployeeStatus;
    return <StatusBadge status={status} label={selectedItem.label} />;
  };

  const currentStatus = getCurrentStatus();
  const statusChanged = selectedStatus && selectedStatus !== currentStatus;

  // 퇴사일 선택 필드 표시 조건: LEAVING/LEFT 선택 시 또는 이미 LEAVING/LEFT 상태일 때
  const needsResignationDatePicker =
    selectedStatus === EmployeeStatus.LEAVING ||
    selectedStatus === EmployeeStatus.LEFT ||
    currentStatus === EmployeeStatus.LEAVING ||
    currentStatus === EmployeeStatus.LEFT;

  // 그룹 선택 필드 표시 조건: 승인 대기 -> 재직중으로 변경할 때만
  const needsGroupSelection =
    currentStatus === EmployeeStatus.PENDING &&
    selectedStatus === EmployeeStatus.ACTIVE;

  // 퇴사일 변경 여부 확인
  const resignationDateChanged = useMemo(() => {
    if (!employee) return false;

    const originalDate = employee.leaveDate;
    const currentDate = resignationDate ? format(resignationDate, 'yyyy-MM-dd') : undefined;

    return originalDate !== currentDate;
  }, [employee, resignationDate]);

  // 저장 가능 조건:
  // 1. 상태가 변경되었거나
  // 2. 퇴사/퇴사예정 상태에서 퇴사일이 변경된 경우
  const canSave =
    (statusChanged ||
     ((currentStatus === EmployeeStatus.LEAVING || currentStatus === EmployeeStatus.LEFT) &&
      resignationDateChanged)) &&
    selectedStatus &&
    (!needsResignationDatePicker || (resignationDate && dateValidation?.isValid && !dateInputError));

  // 그룹 아이템 목록
  const groupItems = useMemo(() => {
    return [
      { value: 'null', label: '그룹 없음' },
      ...groups.map((group) => ({
        value: String(group.employeeGroupId),
        label: group.name
      })),
    ];
  }, [groups]);

  if (!employee) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[390px] max-w-[400px] rounded-[16px] bg-white p-6 gap-4 sm:max-w-none sm:rounded-[16px]">
          <DialogHeader className="space-y-0">
            <DialogTitle className="text-[22px] font-semibold leading-[1.4] text-[#141414]">
              상태 변경
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 상태 선택 */}
            <div>
              <SimpleSelect
                value={selectedStatus}
                onValueChange={handleStatusChange}
                items={statusItems}
                placeholder="상태를 선택해주세요"
                renderItem={renderStatusItem}
                renderValue={renderStatusValue}
              />
            </div>

            {/* 그룹 선택 필드 - 승인 대기 -> 재직중으로 변경할 때만 표시 */}
            {needsGroupSelection && (
              <div>
                <p className="text-sm font-semibold leading-[1.4] text-[#141414] mb-2">
                  그룹
                </p>
                <SimpleSelect
                  value={selectedGroupId === null ? 'null' : String(selectedGroupId)}
                  onValueChange={(value) => {
                    setSelectedGroupId(value === 'null' ? null : Number(value));
                  }}
                  items={groupItems}
                  placeholder="지급할 잼 그룹을 설정해주세요"
                  triggerClassName="h-[44px] rounded-[4px] border border-[#E3E7EC] bg-white px-3 py-2 text-sm leading-[1.4] text-[#141414] shadow-none focus:ring-0"
                />
              </div>
            )}

            {/* 퇴사일 선택 필드 - 재직중 -> 퇴사로 변경할 때만 표시 */}
            {needsResignationDatePicker && (
              <div className="space-y-2">
                <p className="text-sm font-semibold leading-[1.4] text-[#141414]">
                  퇴사일*
                </p>

                {/* 날짜 입력 필드 */}
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6C7885] pointer-events-none" />
                  <Input
                    value={dateInputValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDateInputValue(value);

                      if (!value) {
                        setResignationDate(undefined);
                        setDateInputError('');
                        return;
                      }

                      // yyyy.MM.dd 형식으로 파싱 시도 (완전한 날짜일 때만)
                      if (value.length === 10) {
                        try {
                          const parsed = parse(value, 'yyyy.MM.dd', new Date());
                          if (!isNaN(parsed.getTime())) {
                            setResignationDate(parsed);
                            setDateInputError('');
                          } else {
                            setResignationDate(undefined);
                            setDateInputError('유효하지 않은 날짜입니다.');
                          }
                        } catch (error) {
                          setResignationDate(undefined);
                          setDateInputError('유효하지 않은 날짜입니다.');
                        }
                      } else if (value.length > 10) {
                        setDateInputError('날짜 형식이 올바르지 않습니다. (년도.월.일)');
                      } else {
                        setDateInputError('');
                      }
                    }}
                    placeholder="년도.월.일"
                    className={cn(
                      "h-[44px] rounded-[4px] border bg-white pl-10 pr-10 py-2 text-sm leading-[1.4] text-[#141414] placeholder:text-[#6C7885] focus-visible:ring-0",
                      dateInputError
                        ? "border-[#F04438] focus-visible:border-[#F04438]"
                        : "border-[#E3E7EC] focus-visible:border-[#2E3A49]"
                    )}
                  />
                  {dateInputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setResignationDate(undefined);
                        setDateInputValue('');
                        setDateInputError('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-[#6C7885] hover:text-[#141414] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {dateInputError && (
                  <p className="text-[13px] leading-[1.4] text-[#F04438] mt-1">
                    {dateInputError}
                  </p>
                )}

                {/* 캘린더 */}
                <div className="border border-[#E3E7EC] rounded-[4px] bg-white w-full overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={resignationDate}
                    onSelect={(date: Date | undefined) => {
                      setResignationDate(date);
                      setDateInputValue(date ? format(date, 'yyyy.MM.dd') : '');
                      setDateInputError('');
                    }}
                    className="w-full p-0"
                    classNames={{
                      months: 'flex w-full',
                      month: 'w-full space-y-3 p-3',
                      table: 'w-full border-collapse',
                      head_row: 'flex w-full',
                      head_cell: 'text-[#6C7885] rounded-md flex-1 font-normal text-[13px] leading-[1.4] text-center',
                      row: 'flex w-full mt-1.5',
                      cell: 'flex-1 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                      day: cn(
                        'h-8 w-full p-0 font-normal text-[13px] leading-[1.4] hover:bg-[#F4F4F4] rounded-md',
                        'aria-selected:bg-[#141414] aria-selected:text-white aria-selected:hover:bg-[#141414] aria-selected:hover:text-white'
                      ),
                      day_today: 'bg-[#F4F4F4] text-[#141414] font-semibold',
                      day_outside: 'text-[#AEB5BD] opacity-50',
                      day_disabled: 'text-[#AEB5BD] opacity-30',
                      day_hidden: 'invisible',
                      caption: 'flex justify-center pt-1 relative items-center mb-2',
                      caption_label: 'text-sm font-medium',
                      nav: 'space-x-1 flex items-center',
                      nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                      nav_button_previous: 'absolute left-1',
                      nav_button_next: 'absolute right-1',
                    }}
                  />
                </div>

                {/* 경고 문구 */}
                <div className="flex items-start gap-2 text-[13px] leading-[1.4] text-[#6C7885]">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#F97066]" />
                  <span>퇴사일 이후 해당 사원은 서비스 사용이 불가합니다.</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              variant="outline"
              className="flex-1 h-[44px] rounded-[4px] border border-[#CDD3DB] bg-white px-6 py-3 text-sm font-semibold leading-[1.4] text-[#6C7885] hover:bg-white"
              onClick={onClose}
              disabled={isMutationPending}
            >
              취소
            </Button>
            <Button
              className={cn(
                'flex-1 h-[44px] rounded-[4px] px-6 py-3 text-sm font-semibold leading-[1.4]',
                canSave && !isMutationPending
                  ? 'bg-[#141414] text-white hover:bg-[#141414]/90'
                  : 'bg-[#D9D9D9] text-[#6C7885] hover:bg-[#D9D9D9]'
              )}
              onClick={handleSaveClick}
              disabled={isMutationPending || !canSave}
            >
              {isMutationPending ? '저장 중...' : '저장'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
