import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SimpleSelect } from '@/components/ui/select';
import { type EmployeeTableData } from '@/graphql/types';
import { useEmployeeGroups, useAssignEmployeeToGroup, useUnassignEmployeeFromGroup } from '@/hooks/useEmployeeGroup';
import { getCompanyId } from '@/lib/company';
import { toast } from 'sonner';

interface EmployeeGroupChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeTableData | null;
}

export default function EmployeeGroupChangeModal({
  isOpen,
  onClose,
  employee,
}: EmployeeGroupChangeModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const companyId = getCompanyId();

  // 그룹 목록 가져오기 (GraphQL)
  const { data: groupsData, isLoading: isLoadingGroups } = useEmployeeGroups(companyId);
  const groups = groupsData?.groups ?? [];

  // 그룹 할당/해제 mutation
  const assignToGroupMutation = useAssignEmployeeToGroup();
  const unassignFromGroupMutation = useUnassignEmployeeFromGroup();

  useEffect(() => {
    if (employee && groups.length > 0) {
      // 현재 직원의 그룹명과 일치하는 그룹 ID 찾기
      const currentGroup = groups.find((g) => g.name === employee.groupName);
      setSelectedGroupId(currentGroup?.employeeGroupId ?? null);
    }
  }, [employee, groups]);

  const handleSave = async () => {
    if (!employee) return;

    // 그룹 없음을 선택한 경우
    if (selectedGroupId === null) {
      // 기존에 그룹이 있었다면 그룹 해제 API 호출
      const currentGroup = groups.find((g) => g.name === employee.groupName);
      if (currentGroup) {
        try {
          await unassignFromGroupMutation.mutateAsync({
            input: {
              companyId,
              employeeId: employee.id,
            },
          });

          toast.success('직원 그룹이 해제되었습니다.');
          onClose();
        } catch (error) {
          toast.error('직원 그룹 해제에 실패했습니다.');
          console.error('Failed to unassign employee from group:', error);
        }
      } else {
        // 기존에도 그룹이 없었다면 그냥 닫기
        onClose();
      }
      return;
    }

    // 그룹 할당 API 호출
    try {
      await assignToGroupMutation.mutateAsync({
        input: {
          companyId,
          employeeId: employee.id,
          employeeGroupId: selectedGroupId,
        },
      });

      toast.success('직원 그룹이 변경되었습니다.');
      onClose();
    } catch (error) {
      toast.error('직원 그룹 변경에 실패했습니다.');
      console.error('Failed to assign employee to group:', error);
    }
  };

  const groupItems = useMemo(() => {
    return [
      { value: 'null', label: '그룹 없음' },
      ...groups.map((group) => ({
        value: String(group.employeeGroupId),
        label: group.name,
      })),
    ];
  }, [groups]);

  const selectedValue = selectedGroupId === null ? 'null' : String(selectedGroupId);

  const handleGroupChange = (value: string) => {
    if (value === 'null') {
      setSelectedGroupId(null);
    } else {
      setSelectedGroupId(Number(value));
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[390px] max-w-[400px] rounded-[16px] bg-white p-6 gap-4 sm:max-w-none sm:rounded-[16px]">
        <DialogHeader className="space-y-0">
          <DialogTitle className="text-[22px] font-semibold leading-[1.4] text-[#141414]">
            그룹 변경
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 그룹 선택 */}
          <div>
            <p className="text-sm font-semibold leading-[1.4] text-[#141414] mb-2">
              그룹*
            </p>
            <SimpleSelect
              value={selectedValue}
              onValueChange={handleGroupChange}
              items={groupItems}
              placeholder="그룹을 선택해주세요"
              disabled={isLoadingGroups}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-4">
          <Button
            variant="outline"
            className="flex-1 h-[44px] rounded-[4px] border border-[#CDD3DB] bg-white px-6 py-3 text-sm font-semibold leading-[1.4] text-[#6C7885] hover:bg-white"
            onClick={onClose}
            disabled={assignToGroupMutation.isPending || unassignFromGroupMutation.isPending}
          >
            취소
          </Button>
          <Button
            className="flex-1 h-[44px] rounded-[4px] px-6 py-3 text-sm font-semibold leading-[1.4] bg-[#141414] text-white hover:bg-[#141414]/90"
            onClick={handleSave}
            disabled={assignToGroupMutation.isPending || unassignFromGroupMutation.isPending || selectedValue === ''}
          >
            {assignToGroupMutation.isPending || unassignFromGroupMutation.isPending ? '저장 중...' : '저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


