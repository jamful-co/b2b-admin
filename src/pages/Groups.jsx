import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { JamGroup, Employee } from '@/api/entities';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GroupAddModal from '@/components/groups/GroupAddModal';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import DataTable from "@/components/common/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";

export default function GroupsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Fetch Groups
    const { data: groups, isLoading: isGroupsLoading } = useQuery({
        queryKey: ['groups'],
        queryFn: () => JamGroup.list('-created_date'),
        initialData: []
    });

    // Fetch Employees to calculate counts
    // Note: In a real large app, this count should come from the backend or a specific aggregation endpoint
    const { data: employees, isLoading: isEmployeesLoading } = useQuery({
        queryKey: ['employees_for_count'],
        queryFn: () => Employee.list(),
        initialData: []
    });

    // Calculate member counts per group
    const getMemberCount = (groupName) => {
        if (!employees) return 0;
        return employees.filter((emp) => emp.group_name === groupName && emp.employment_status === 'active').length;
    };

    // Create Group Mutation
    const createGroupMutation = useMutation({
        mutationFn: (data) => JamGroup.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            setIsAddModalOpen(false);
            toast({
                title: "그룹이 생성되었습니다",
                variant: "default"
            });
        },
        onError: (error) => {
            toast({
                title: "그룹 생성에 실패했습니다",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const deleteGroupMutation = useMutation({
        mutationFn: (id) => JamGroup.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
            toast({
                title: "그룹이 삭제되었습니다",
                variant: "destructive"
            });
        },
        onError: (error) => {
            toast({
                title: "그룹 삭제에 실패했습니다",
                description: error.message,
                variant: "destructive"
            });
        }
    });

    const handleCreateGroup = (data) => {
        createGroupMutation.mutate(data);
    };

    const getRechargeDateLabel = (value) => {
        switch(value) {
            case '1': return '매월 1일';
            case '15': return '매월 15일';
            case 'end': return '매월 말일';
            default: return `매월 ${value}일`;
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount).replace('₩', '') + '잼';
    };

    const columns = [
        {
            header: "그룹 이름",
            accessorKey: "name",
            cell: (row) => <span className="font-medium text-gray-900">{row.name}</span>,
            headerClassName: "w-[200px]"
        },
        {
            header: "그룹 인원",
            cell: (row) => <span className="text-gray-600">{getMemberCount(row.name)}명</span>
        },
        {
            header: "충전 잼",
            cell: (row) => <span className="text-gray-600">{formatAmount(row.amount)}</span>
        },
        {
            header: "충전일",
            cell: (row) => <span className="text-gray-600">{getRechargeDateLabel(row.recharge_date)}</span>
        },
        {
            header: "상태",
            cell: (row) => (
                <Badge 
                    variant="secondary" 
                    className={
                        row.status === 'inactive' 
                        ? "bg-gray-100 text-gray-500" 
                        : "bg-green-50 text-green-700"
                    }
                >
                    {row.status === 'inactive' ? '비활성' : '활성'}
                </Badge>
            )
        },
        {
            header: "옵션",
            cell: (row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            onClick={() => deleteGroupMutation.mutate(row.id)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>삭제</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            headerClassName: "text-right",
            cellClassName: "text-right"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">그룹 관리</h1>
                <Button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#1C1C1C] hover:bg-black text-white rounded-md px-4 py-2 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    그룹 추가
                </Button>
            </div>

            <DataTable 
                columns={columns}
                data={groups}
                isLoading={isGroupsLoading || isEmployeesLoading}
                emptyMessage="아직 생성된 그룹이 없습니다"
            />

            <GroupAddModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSubmit={handleCreateGroup}
                isSubmitting={createGroupMutation.isPending}
            />
        </div>
    );
}