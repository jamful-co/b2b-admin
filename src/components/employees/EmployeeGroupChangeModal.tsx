import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SimpleSelect } from '@/components/ui/select';
import { type Employee as EmployeeType } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { JamGroup } from '@/api/entities';

interface EmployeeGroupChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: EmployeeType) => void;
  employee: EmployeeType | null;
  isSubmitting?: boolean;
}

export default function EmployeeGroupChangeModal({
  isOpen,
  onClose,
  onSave,
  employee,
  isSubmitting = false,
}: EmployeeGroupChangeModalProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  // 그룹 목록 가져오기
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: () => JamGroup.list(),
    initialData: [],
  });

  useEffect(() => {
    if (employee) {
      setSelectedGroup(employee.group_name || '그룹 없음');
    }
  }, [employee]);

  const handleSave = () => {
    if (!employee) return;

    const updatedEmployee: EmployeeType = {
      ...employee,
      group_name: selectedGroup === '그룹 없음' ? '' : selectedGroup,
    };

    onSave(updatedEmployee);
  };

  const groupItems = useMemo(() => {
    return [
      { value: '그룹 없음', label: '그룹 없음' },
      ...groups.map((group) => ({ value: group.name, label: group.name })),
    ];
  }, [groups]);

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">그룹 변경</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 임직원 정보 표시 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">임직원 정보</Label>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-sm text-gray-700">
                <div className="font-medium">{employee.name}</div>
                <div className="text-gray-500 mt-1">{employee.email}</div>
              </div>
            </div>
          </div>

          {/* 그룹 선택 */}
          <div className="space-y-2">
            <Label htmlFor="group" className="text-sm font-medium text-gray-900">
              그룹*
            </Label>
            <SimpleSelect
              value={selectedGroup}
              onValueChange={setSelectedGroup}
              items={groupItems}
              placeholder="그룹을 선택해주세요"
            />
          </div>
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
            onClick={handleSave}
            disabled={isSubmitting || !selectedGroup}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


