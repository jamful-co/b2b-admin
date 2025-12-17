import { useState, useMemo } from 'react';
import { TableCell, TableHead, TableRow, ScrollableTableContainer } from '@/components/ui/table';
import { SimpleSelect } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ArrowUpDown, Search, MoreHorizontal } from 'lucide-react';
import { JamGroup, type JamGroup as JamGroupType, Employee } from '@/api/entities';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GroupTableProps {
  data: JamGroupType[];
  employees: any[];
  onEdit?: (group: JamGroupType) => void;
  onDelete?: (id: string) => void;
}

interface SortingState {
  key: string;
  direction: 'asc' | 'desc';
}

export default function GroupTable({ data, employees, onEdit, onDelete }: GroupTableProps) {
  // State
  const [sorting, setSorting] = useState<SortingState>({ key: 'name', direction: 'asc' });
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate member count for each group
  const getMemberCount = (groupName: string) => {
    if (!employees) return 0;
    return employees.filter(
      (emp) => emp.group_name === groupName && emp.employment_status === 'active'
    ).length;
  };

  // Format recharge date label
  const getRechargeDateLabel = (value: string) => {
    switch (value) {
      case '1':
        return '매월 1일';
      case '15':
        return '매월 15일';
      case 'end':
        return '매월 말일';
      default:
        return `매월 ${value}일`;
    }
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '잼';
  };

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesGlobal = item.name.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
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

  // Helper for columns
  const columns = [
    { key: 'name', label: '그룹 이름', sortable: true },
    { key: 'member_count', label: '그룹 인원', sortable: false },
    { key: 'amount', label: '충전 잼', sortable: true },
    { key: 'recharge_date', label: '충전일', sortable: false },
    { key: 'status', label: '상태', sortable: true },
    { key: 'actions', label: '옵션', sortable: false },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3 flex-1">
          <SimpleSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            items={[
              { value: 'all', label: '전체 상태' },
              { value: 'active', label: '활성화' },
              { value: 'inactive', label: '비활성화' },
            ]}
            placeholder="전체 상태"
            triggerClassName="w-[120px] bg-gray-50 border-0"
            itemClassName="focus:bg-[#FFFDD2] focus:text-gray-900 cursor-pointer"
          />

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="검색"
              value={globalFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
              className="pl-9 bg-gray-50 border-0"
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
            triggerClassName="w-[70px] bg-gray-50 border-0"
            itemClassName="focus:bg-[#FFFDD2] focus:text-gray-900 cursor-pointer"
          />
        </div>
      </div>

      {/* Table Area */}
      <ScrollableTableContainer>
        <table className="w-full min-w-max caption-bottom text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
              <TableRow>
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
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                    데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                    <TableCell className="text-gray-600">{getMemberCount(row.name)}명</TableCell>
                    <TableCell className="text-gray-600">{formatAmount(row.amount)}</TableCell>
                    <TableCell className="text-gray-600">{getRechargeDateLabel(row.recharge_date)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          row.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100 border-0 font-normal'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-100 border-0 font-normal'
                        }
                      >
                        {row.status === 'active' ? '활성화' : '비활성화'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">메뉴 열기</span>
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={() => onEdit(row)}
                              className="cursor-pointer"
                            >
                              수정
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={() => onDelete(row.id)}
                              className="text-red-600 focus:text-red-600 cursor-pointer"
                            >
                              삭제
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
        </table>
      </ScrollableTableContainer>

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
            let p = i + 1;
            if (totalPages > 5 && currentPage > 3) {
              p = currentPage - 2 + i;
              if (p > totalPages) p = p - (p - totalPages);
            }
            if (totalPages > 5 && currentPage > totalPages - 2) {
              p = totalPages - 4 + i;
            }

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

