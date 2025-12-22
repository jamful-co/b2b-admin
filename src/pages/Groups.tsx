import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PlusIcon from '@/assets/icons/plus.svg?react';
import GroupAddModal from '@/components/groups/GroupAddModal';
import GroupDeleteModal from '@/components/groups/GroupDeleteModal';
import { toast } from 'sonner';
import GroupTable from '@/components/groups/GroupTable';
import { useEmployeeGroups, useCreateEmployeeGroup, useUpdateEmployeeGroup, useDeleteEmployeeGroup } from '@/hooks/useEmployeeGroup';
import { getCompanyId } from '@/lib/company';
import { EmployeeGroupData, CreateEmployeeGroupInput } from '@/graphql/types';

export default function GroupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<EmployeeGroupData | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<EmployeeGroupData | null>(null);
  const companyId = getCompanyId();

  // Fetch Groups with GraphQL
  const { data: groupsData, isLoading: isGroupsLoading } = useEmployeeGroups(companyId);
  const groups = groupsData?.groups ?? [];

  // Create Group Mutation
  const createGroupMutation = useCreateEmployeeGroup();

  // Update Group Mutation
  const updateGroupMutation = useUpdateEmployeeGroup();

  // Delete Group Mutation
  const deleteGroupMutation = useDeleteEmployeeGroup();

  const handleSubmitGroup = (data: Partial<CreateEmployeeGroupInput>) => {
    if (editingGroup) {
      // 수정 모드
      updateGroupMutation.mutate(
        {
          input: {
            employeeGroupId: editingGroup.employeeGroupId,
            companyId,
            name: data.name,
            credits: data.credits,
            renewDate: data.renewDate,
            rolloverPercentage: data.rolloverPercentage,
            isActive: data.isActive,
          },
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingGroup(null);
            toast.success('그룹이 수정되었습니다.');
          },
          onError: () => {
            toast.error('그룹 수정에 실패했습니다.');
          },
        }
      );
    } else {
      // 생성 모드
      createGroupMutation.mutate(
        {
          input: {
            companyId,
            name: data.name || '',
            credits: data.credits || 0,
            renewDate: data.renewDate || 1,
            rolloverPercentage: data.rolloverPercentage || 0,
          },
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            toast.success('그룹이 생성되었습니다.');
          },
          onError: () => {
            toast.error('그룹 생성에 실패했습니다.');
          },
        }
      );
    }
  };

  const handleEdit = (group: EmployeeGroupData) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleDelete = (id: number) => {
    const group = groups.find((g) => g.employeeGroupId === id);
    if (group) {
      setDeletingGroup(group);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingGroup) return;

    deleteGroupMutation.mutate(
      {
        input: {
          companyId,
          employeeGroupId: deletingGroup.employeeGroupId,
        },
      },
      {
        onSuccess: () => {
          setDeletingGroup(null);
          toast.success('그룹이 삭제되었습니다.');
        },
        onError: () => {
          toast.error('그룹 삭제에 실패했습니다.');
        },
      }
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">그룹 관리</h1>
        <Button
          variant="active"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon/>
          그룹 추가
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <GroupTable
          data={groups}
          isLoading={isGroupsLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <GroupAddModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitGroup}
        isSubmitting={createGroupMutation.isPending || updateGroupMutation.isPending}
        editingGroup={editingGroup}
      />

      <GroupDeleteModal
        isOpen={!!deletingGroup}
        onClose={() => setDeletingGroup(null)}
        onConfirm={handleConfirmDelete}
        groupName={deletingGroup?.name || ''}
        isSubmitting={deleteGroupMutation.isPending}
      />
    </div>
  );
}
