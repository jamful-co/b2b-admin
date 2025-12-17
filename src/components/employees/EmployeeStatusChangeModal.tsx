import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SimpleSelect } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { EmployeeStatus, type Employee as EmployeeType } from '@/api/entities';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployeeStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: EmployeeType) => void;
  employee: EmployeeType | null;
  isSubmitting?: boolean;
}

// 상태 라벨 매핑
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
      return 'bg-blue-50 text-blue-600';
    case EmployeeStatus.REJECTED:
      return 'bg-red-50 text-red-600';
    case EmployeeStatus.ACTIVE:
      return 'bg-green-50 text-green-600';
    case EmployeeStatus.LEAVING:
      return 'bg-gray-50 text-gray-600';
    case EmployeeStatus.LEFT:
      return 'bg-gray-100 text-gray-500';
    default:
      return 'bg-gray-50 text-gray-600';
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
      'inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium',
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
  onSave,
  employee,
  isSubmitting = false,
}: EmployeeStatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus | string>('');
  const [resignationDate, setResignationDate] = useState<Date | undefined>(undefined);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dateValidation, setDateValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (employee) {
      // 기존 상태를 EmployeeStatus로 변환 (하위 호환성)
      const currentStatus = employee.employment_status;
      if (currentStatus === 'active') {
        setSelectedStatus(EmployeeStatus.ACTIVE);
      } else if (currentStatus === 'resigning') {
        setSelectedStatus(EmployeeStatus.LEAVING);
      } else if (currentStatus === 'inactive') {
        setSelectedStatus(EmployeeStatus.LEFT);
      } else {
        setSelectedStatus(currentStatus as EmployeeStatus);
      }

      // 기존 퇴사일이 있으면 설정
      if (employee.resignation_date) {
        setResignationDate(new Date(employee.resignation_date));
      }
    }
  }, [employee]);

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

    if (selectedStatus === EmployeeStatus.LEAVING) {
      // 퇴사 예정일: 오늘 이후 날짜만 가능
      if (selectedDate > today) {
        setDateValidation({ isValid: true, message: '퇴사 예정일 설정 가능' });
      } else {
        setDateValidation({ isValid: false, message: '오늘 이후 날짜만 선택 가능합니다.' });
      }
    } else if (selectedStatus === EmployeeStatus.LEFT) {
      // 퇴사일: 오늘 이전 날짜만 가능
      if (selectedDate < today) {
        setDateValidation({ isValid: true, message: '퇴사일 설정 가능' });
      } else {
        setDateValidation({ isValid: false, message: '오늘 이전 날짜만 선택 가능합니다.' });
      }
    }
  }, [resignationDate, selectedStatus]);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    // 상태 변경 시 날짜 초기화
    if (value !== EmployeeStatus.LEAVING && value !== EmployeeStatus.LEFT) {
      setResignationDate(undefined);
      setDateValidation(null);
    }
  };

  const handleConfirm = () => {
    if (!employee) return;

    const updatedEmployee: EmployeeType = {
      ...employee,
      employment_status: selectedStatus as EmployeeStatus,
      resignation_date: resignationDate ? format(resignationDate, 'yyyy-MM-dd') : undefined,
    };

    onSave(updatedEmployee);
    setShowConfirmDialog(false);
  };

  const handleSaveClick = () => {
    // 날짜가 필요한 상태인데 유효하지 않은 경우 저장 불가
    if (
      (selectedStatus === EmployeeStatus.LEAVING || selectedStatus === EmployeeStatus.LEFT) &&
      (!resignationDate || !dateValidation?.isValid)
    ) {
      return;
    }
    setShowConfirmDialog(true);
  };

  const getStatusInfoText = (status: EmployeeStatus | string): string | null => {
    switch (status) {
      case EmployeeStatus.PENDING:
        return null;
      case EmployeeStatus.REJECTED:
        return '승인 거절 시 해당 사원은 서비스 사용이 불가합니다.';
      case EmployeeStatus.ACTIVE:
        if (employee?.employment_status === EmployeeStatus.PENDING) {
          return '승인 시 해당 사원은 서비스 사용이 가능합니다.';
        }
        return '재직중 변경 시 상태가 \'재직중\'으로 변경되며, 해당 사원은 서비스 사용이 가능합니다.';
      case EmployeeStatus.LEAVING:
        return null; // 날짜 입력 필드가 표시됨
      case EmployeeStatus.LEFT:
        return null; // 날짜 입력 필드가 표시됨
      default:
        return null;
    }
  };

  const getConfirmDialogContent = () => {
    switch (selectedStatus) {
      case EmployeeStatus.REJECTED:
        return {
          title: '사원 상태를 승인 거절로 변경하시겠습니까?',
          description:
            '승인 거절 시 상태가 \'승인 거절\'로 변경되며, 해당 사원은 서비스 사용이 불가합니다.',
        };
      case EmployeeStatus.ACTIVE:
        if (employee?.employment_status === EmployeeStatus.PENDING) {
          return {
            title: '사원 상태를 재직중으로 변경하시겠습니까?',
            description:
              '승인 시 상태가 \'재직중\'으로 변경되며, 해당 사원은 서비스 사용이 가능합니다.',
          };
        }
        return {
          title: '사원 상태를 재직중으로 변경하시겠습니까?',
          description:
            '재직중 변경 시 상태가 \'재직중\'으로 변경되며, 해당 사원은 서비스 사용이 가능합니다.',
        };
      case EmployeeStatus.LEAVING:
        return {
          title: '사원 상태를 퇴사 예정으로 변경하시겠습니까?',
          description:
            '퇴사 예정 시 상태가 \'퇴사 예정\'으로 변경되며, 설정한 퇴사 예정일까지 서비스 사용이 가능합니다.',
        };
      case EmployeeStatus.LEFT:
        return {
          title: '사원 상태를 퇴사로 변경하시겠습니까?',
          description:
            '퇴사 시 상태가 \'퇴사\'로 변경되며, 설정한 퇴사일 이후 서비스 사용이 불가합니다.',
        };
      default:
        return {
          title: '상태를 변경하시겠습니까?',
          description: '상태 변경을 진행하시겠습니까?',
        };
    }
  };

  const statusItems = Object.values(EmployeeStatus).map((status) => ({
    value: status,
    label: statusLabels[status],
  }));

  // 커스텀 렌더링 함수들
  const renderStatusItem = (item: { value: string; label: string }, isSelected?: boolean) => {
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

  const infoText = getStatusInfoText(selectedStatus);
  const needsDatePicker =
    selectedStatus === EmployeeStatus.LEAVING || selectedStatus === EmployeeStatus.LEFT;
  const canSave =
    selectedStatus &&
    (!needsDatePicker || (resignationDate && dateValidation?.isValid));

  if (!employee) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-bold text-gray-900">상태 변경</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 상태 선택 */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                상태*
              </Label>
              <SimpleSelect
                value={selectedStatus}
                onValueChange={handleStatusChange}
                items={statusItems}
                placeholder="상태를 선택해주세요"
                renderItem={renderStatusItem}
                renderValue={renderStatusValue}
              />
            </div>

            {/* 정보 텍스트 */}
            {infoText && (
              <p className="text-sm text-gray-500">{infoText}</p>
            )}

            {/* 날짜 선택 필드 (퇴사 예정 또는 퇴사) */}
            {needsDatePicker && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  {selectedStatus === EmployeeStatus.LEAVING ? '퇴사 예정일' : '퇴사일'}*
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !resignationDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {resignationDate ? (
                        format(resignationDate, 'yyyy.MM.dd')
                      ) : (
                        <span>날짜를 선택해주세요</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={resignationDate}
                      onSelect={setResignationDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* 날짜 유효성 검사 메시지 */}
                {dateValidation && (
                  <div
                    className={cn(
                      'flex items-center gap-2 text-sm',
                      dateValidation.isValid ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {dateValidation.isValid ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span>{dateValidation.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1 h-11 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              className="flex-1 h-11 bg-[#282821] text-white hover:bg-[#282821]/90"
              onClick={handleSaveClick}
              disabled={isSubmitting || !canSave}
            >
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 확인 다이얼로그 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getConfirmDialogContent().title}</AlertDialogTitle>
            <AlertDialogDescription>{getConfirmDialogContent().description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-[#282821] text-white hover:bg-[#282821]/90"
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
