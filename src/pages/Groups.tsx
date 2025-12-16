import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JamGroup, Employee, type JamGroup as JamGroupType } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import GroupAddModal from '@/components/groups/GroupAddModal';
import { toast } from 'sonner';
import GroupTable from '@/components/groups/GroupTable';

export default function GroupsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<JamGroupType | null>(null);
  const queryClient = useQueryClient();

  // Fetch Groups
  const { data: groups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => JamGroup.list(),
    initialData: [],
  });

  // Fetch Employees to calculate counts
  const { data: employees = [], isLoading: isEmployeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => Employee.list(),
    initialData: [],
  });

  // Create Group Mutation
  const createGroupMutation = useMutation({
    mutationFn: (data: Partial<JamGroupType>) => JamGroup.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsAddModalOpen(false);
      toast.success('그룹이 생성되었습니다.');
    },
    onError: (error: any) => {
      toast.error('그룹 생성에 실패했습니다.');
    },
  });

  // Delete Group Mutation
  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => JamGroup.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('그룹이 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error('그룹 삭제에 실패했습니다.');
    },
  });

  const handleCreateGroup = (data: Partial<JamGroupType>) => {
    createGroupMutation.mutate(data);
  };

  const handleEdit = (group: JamGroupType) => {
    setEditingGroup(group);
    // TODO: Open edit modal
    toast.info('편집 기능은 곧 추가될 예정입니다.');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 그룹을 삭제하시겠습니까?')) {
      deleteGroupMutation.mutate(id);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">그룹 관리</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#1C1C1C] hover:bg-black text-white rounded-md px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          그룹 추가
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <GroupTable
          data={groups}
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <GroupAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateGroup}
        isSubmitting={createGroupMutation.isPending}
      />
    </div>
  );
}
