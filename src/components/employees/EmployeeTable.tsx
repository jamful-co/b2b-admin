import { useState, useMemo, type ChangeEvent } from 'react';
import { TableCell, TableHead, TableRow, ScrollableTableContainer } from '@/components/ui/table';
import { SimpleSelect } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, ArrowUpDown, Search, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import JamAllocationModal from './JamAllocationModal';
import EmployeeEditModal from './EmployeeEditModal';
import EmployeeStatusChangeModal from './EmployeeStatusChangeModal';
import EmployeeGroupChangeModal from './EmployeeGroupChangeModal';
import { toast } from 'sonner';
import { Employee, EmployeeStatus, type Employee as EmployeeType } from '@/api/entities';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EmployeeTableProps {
  data: EmployeeType[];
}

interface SortingState {
  key: string;
  direction: 'asc' | 'desc';
}

export default function EmployeeTable({ data }: EmployeeTableProps) {
  const queryClient = useQueryClient();

  // State
  const [sorting, setSorting] = useState<SortingState>({ key: 'name', direction: 'asc' });
  const [isJamModalOpen, setIsJamModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeType | null>(null);
  const [statusChangingEmployee, setStatusChangingEmployee] = useState<EmployeeType | null>(null);
  const [groupChangingEmployee, setGroupChangingEmployee] = useState<EmployeeType | null>(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set<string>());

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesGlobal =
        item.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        item.employee_code.includes(globalFilter) ||
        item.email.toLowerCase().includes(globalFilter.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.employment_status === statusFilter;

      return matchesGlobal && matchesStatus;
    });
  }, [data, globalFilter, statusFilter]);

  // Sorting
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sorting.key] < b[sorting.key]) return sorting.direction === 'asc' ? -1 : 1;
      if (a[sorting.key] > b[sorting.key]) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sorting]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handlers
  const handleSort = (key: string) => {
    setSorting((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleJamAllocation = (amount: number) => {
    // Here you would normally call an API to allocate jams
    toast.success(`${selectedRows.size}명의 직원에게 각각 ${amount}잼이 할당되었습니다.`);
    setSelectedRows(new Set());
  };

  const updateEmployeeMutation = useMutation({
    mutationFn: (updatedData: EmployeeType) => Employee.update(updatedData.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('직원 정보가 수정되었습니다.');
      setEditingEmployee(null);
    },
    onError: () => {
      toast.error('직원 정보 수정에 실패했습니다.');
    },
  });

  const updateEmployeeStatusMutation = useMutation({
    mutationFn: (updatedData: EmployeeType) => Employee.update(updatedData.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('직원 상태가 변경되었습니다.');
      setStatusChangingEmployee(null);
    },
    onError: () => {
      toast.error('직원 상태 변경에 실패했습니다.');
    },
  });

  const updateEmployeeGroupMutation = useMutation({
    mutationFn: (updatedData: EmployeeType) => Employee.update(updatedData.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('직원 그룹이 변경되었습니다.');
      setGroupChangingEmployee(null);
    },
    onError: () => {
      toast.error('직원 그룹 변경에 실패했습니다.');
    },
  });

  const handleSaveEmployee = (updatedData: EmployeeType) => {
    updateEmployeeMutation.mutate(updatedData);
  };

  const handleSaveStatusChange = (updatedData: EmployeeType) => {
    updateEmployeeStatusMutation.mutate(updatedData);
  };

  const handleSaveGroupChange = (updatedData: EmployeeType) => {
    updateEmployeeGroupMutation.mutate(updatedData);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((item) => item.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // Helper for columns
  const columns = [
    // 피그마(Table node 16436:14421) 기준 컬럼 폭(px) 적용
    { key: 'employee_code', label: '사번', sortable: true, width: 77 },
    { key: 'name', label: '이름', sortable: true, width: 106 },
    { key: 'phone', label: '전화번호', sortable: false, width: 156 },
    { key: 'email', label: '이메일', sortable: true, width: 169 },
    { key: 'jam_balance', label: '잼 잔여량', sortable: true, width: 236 },
    { key: 'join_date', label: '입사일', sortable: true, width: 122 },
    { key: 'employment_status', label: '재직 상태', sortable: true, width: 152 },
    { key: 'group_name', label: '그룹', sortable: true, width: 150 },
  ];

  return (
    <div className="flex flex-col h-full bg-white ">
      {/* Toolbar */}
      <div className="py-4 flex items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3 flex-1">
          <SimpleSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            items={[
              { value: 'all', label: '전체 상태' },
              { value: 'active', label: '재직중' },
              { value: 'resigning', label: '퇴사 예정' },
              { value: 'inactive', label: '퇴사' },
            ]}
            placeholder="전체 상태"
            triggerClassName="w-[120px]"
            itemClassName="focus:bg-[#FFFDD2] focus:text-gray-900 cursor-pointer"
          />

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="검색"
              value={globalFilter}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">페이지당 항목 수:</span>
          <SimpleSelect
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setCurrentPage(1);
            }}
            items={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
            ]}
            triggerClassName="w-[70px]"
            itemClassName="focus:bg-[#FFFDD2] focus:text-gray-900 cursor-pointer"
          />

          <Button
            className={`border-0 transition-colors duration-200 ${
              selectedRows.size > 0
                ? 'bg-[#282821] text-[#FFFA97] hover:bg-[#282821]/90'
                : 'bg-[#D9D9D9] text-[#6C7885] hover:bg-[#D9D9D9]'
            }`}
            disabled={selectedRows.size === 0}
            onClick={() => setIsJamModalOpen(true)}
          >
            잼 할당
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <ScrollableTableContainer>
        <table className="w-full table-fixed min-w-[1348px] caption-bottom text-sm">
          <colgroup>
            {/* 피그마 체크박스 컬럼 폭 */}
            <col style={{ width: 58 }} />
            {columns.map((col) => (
              <col key={col.key} style={{ width: col.width }} />
            ))}
          </colgroup>
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <TableRow>
              <TableHead className="text-center">
                <Checkbox
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-xs font-semibold text-gray-600 ${col.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown className="w-3 h-3 text-gray-400" />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="h-24 text-center text-gray-500">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={() => toggleSelectRow(row.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-gray-600">
                      <div className="truncate">{row.employee_code}</div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      <div className="truncate">{row.name}</div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="truncate">{row.phone}</div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="truncate">{row.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={(row.jam_balance / (row.jam_capacity || 100000)) * 100}
                          className="h-2 w-24 bg-gray-100"
                          indicatorClassName="bg-[#FEE666]"
                        />
                        <span className="text-xs font-bold text-gray-700">
                          {Math.round((row.jam_balance / (row.jam_capacity || 100000)) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="truncate">
                        {row.join_date ? format(new Date(row.join_date), 'yyyy-MM-dd') : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex-1 min-w-0">
                          {(row.employment_status === 'active' || row.employment_status === EmployeeStatus.ACTIVE) && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 font-normal">
                              재직중
                            </Badge>
                          )}
                          {(row.employment_status === 'resigning' || row.employment_status === EmployeeStatus.LEAVING) && (
                            <div className="flex flex-col items-start gap-0.5">
                              <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-0 font-normal">
                                퇴사 예정
                              </Badge>
                              {row.resignation_date && (
                                <span className="text-[10px] text-gray-400">
                                  {format(new Date(row.resignation_date), 'yyyy-MM-dd')}
                                </span>
                              )}
                            </div>
                          )}
                          {(row.employment_status === 'inactive' || row.employment_status === EmployeeStatus.LEFT) && (
                            <Badge className="text-gray-400 border-gray-200 font-normal">
                              퇴사
                            </Badge>
                          )}
                          {row.employment_status === EmployeeStatus.PENDING && (
                            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 font-normal">
                              승인 대기
                            </Badge>
                          )}
                          {row.employment_status === EmployeeStatus.REJECTED && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 font-normal">
                              승인 거절
                            </Badge>
                          )}
                        </div>
                        <button
                          onClick={() => setStatusChangingEmployee(row)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          aria-label="상태 변경"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <span className="text-gray-600 flex-1 min-w-0 truncate">
                          {row.group_name || '그룹 없음'}
                        </span>
                        <button
                          onClick={() => setGroupChangingEmployee(row)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          aria-label="그룹 변경"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
        </table>
      </ScrollableTableContainer>

      <JamAllocationModal
        isOpen={isJamModalOpen}
        onClose={() => setIsJamModalOpen(false)}
        onConfirm={handleJamAllocation}
        availablePoints={100} // Mocked value as per requirement
      />

      <EmployeeEditModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
      />

      <EmployeeStatusChangeModal
        isOpen={!!statusChangingEmployee}
        onClose={() => setStatusChangingEmployee(null)}
        onSave={handleSaveStatusChange}
        employee={statusChangingEmployee}
        isSubmitting={updateEmployeeStatusMutation.isPending}
      />

      <EmployeeGroupChangeModal
        isOpen={!!groupChangingEmployee}
        onClose={() => setGroupChangingEmployee(null)}
        onSave={handleSaveGroupChange}
        employee={groupChangingEmployee}
        isSubmitting={updateEmployeeGroupMutation.isPending}
      />

      {/* Footer Pagination */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 bg-white">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 text-xs"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          처음
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 text-xs gap-1"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" /> 이전
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Simple logic to show window around current page could be added,
            // but for now showing first 5 or logic to keep it simple
            let p = i + 1;
            if (totalPages > 5 && currentPage > 3) {
              p = currentPage - 2 + i;
              if (p > totalPages) p = p - (p - totalPages); // Clamp
            }
            // Adjust if we are near end
            if (totalPages > 5 && currentPage > totalPages - 2) {
              p = totalPages - 4 + i;
            }

            // Basic clamp for safety
            if (p <= 0 || p > totalPages) return null;

            return (
              <Button
                key={p}
                variant={currentPage === p ? 'default' : 'ghost'}
                size="sm"
                className={`w-8 h-8 p-0 text-xs ${currentPage === p ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'text-gray-500'}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            );
          })}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 text-xs gap-1"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          다음 <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 text-xs"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          끝
        </Button>
      </div>
    </div>
  );
}
