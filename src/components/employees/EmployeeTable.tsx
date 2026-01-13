import { useState, useMemo, useRef, useEffect, type ChangeEvent } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type ColumnSizingState,
} from '@tanstack/react-table';
import { TableCell, TableHead, TableRow, ScrollableTableContainer } from '@/components/ui/table';
import { SimpleSelect } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil } from 'lucide-react';
import { TablePagination } from '@/components/ui/table-pagination';
import { format } from 'date-fns';
import JamAllocationModal from './JamAllocationModal';
import EmployeeEditModal from './EmployeeEditModal';
import EmployeeStatusChangeModal from './EmployeeStatusChangeModal';
import EmployeeGroupChangeModal from './EmployeeGroupChangeModal';
import { EmployeeStatus } from '@/api/entities';
import { type EmployeeTableData } from '@/graphql/types';
import { useB2bCreditSummary } from '@/hooks/useB2bCreditSummary';
import { getCompanyId } from '@/lib/company';

interface EmployeeTableProps {
  data: EmployeeTableData[];
}

const columnHelper = createColumnHelper<EmployeeTableData>();

// 날짜 정렬 함수
const dateSortingFn = (rowA: any, rowB: any, columnId: string) => {
  const dateA = rowA.getValue(columnId);
  const dateB = rowB.getValue(columnId);

  // null/undefined 처리
  if (!dateA && !dateB) return 0;
  if (!dateA) return 1;  // null은 뒤로
  if (!dateB) return -1;

  // Date 객체로 변환하여 비교
  return new Date(dateA).getTime() - new Date(dateB).getTime();
};

const getEmployeeStatusBadgeClassName = (status: EmployeeStatus) => {
  const base =
    'inline-flex items-center justify-center rounded-full px-3 py-[3px] text-sm font-semibold leading-[1.4]';
  switch (status) {
    case EmployeeStatus.ACTIVE:
      return `${base} bg-[#E8FFF1] text-[#12B76A]`;
    case EmployeeStatus.LEAVING:
      return `${base} bg-[#FCF4D0] text-[#EA981E]`;
    case EmployeeStatus.PENDING:
      return `${base} bg-[#F2FAFF] text-[#009DFF]`;
    case EmployeeStatus.REJECTED:
      return `${base} bg-[#FEF3F2] text-[#F04438]`;
    case EmployeeStatus.LEFT:
      return `${base} bg-[#F4F4F4] text-[#6C7885]`;
    default:
      return `${base} bg-[#F4F4F4] text-[#6C7885]`;
  }
};

const employeeStatusLabel: Record<EmployeeStatus, string> = {
  [EmployeeStatus.PENDING]: '승인 대기',
  [EmployeeStatus.REJECTED]: '승인 거절',
  [EmployeeStatus.ACTIVE]: '재직중',
  [EmployeeStatus.LEAVING]: '퇴사 예정',
  [EmployeeStatus.LEFT]: '퇴사',
};

export default function EmployeeTable({ data }: EmployeeTableProps) {
  // Get company ID and fetch credit summary
  const companyId = getCompanyId();
  const { data: creditSummary } = useB2bCreditSummary(companyId);

  // TanStack Table State
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // Modal State
  const [isJamModalOpen, setIsJamModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeTableData | null>(null);
  const [statusChangingEmployee, setStatusChangingEmployee] = useState<EmployeeTableData | null>(null);
  const [groupChangingEmployee, setGroupChangingEmployee] = useState<EmployeeTableData | null>(null);
  const [statusFilter, setStatusFilter] = useState('default');
  const [groupFilter, setGroupFilter] = useState('all');

  // Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 감지
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollLeft > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 피그마 기준 컬럼 폭(px)
  const columnWidths = {
    select: 58,
    employee_code: 77,
    name: 106,
    phone: 156,
    email: 169,
    jam_balance: 236,
    join_date: 122,
    resignation_date: 150,
    membership_start_date: 150,
    employment_status: 180,
    group_name: 150,
  };

  // 그룹 목록 생성
  const groupList = useMemo(() => {
    const groups = new Set<string>();
    data.forEach((item) => {
      if (item.groupName) {
        groups.add(item.groupName);
      }
    });
    return Array.from(groups).sort();
  }, [data]);

  // 상태 및 그룹 필터링이 적용된 데이터
  const filteredData = useMemo(() => {
    let result = data;

    // 상태 필터링
    if (statusFilter !== 'all') {
      if (statusFilter === 'default') {
        result = result.filter((item) => {
          return item.userId || item.status === EmployeeStatus.LEAVING || item.status === EmployeeStatus.PENDING;
        });
      } else {
        result = result.filter((item) => item.status === statusFilter);
      }
    }

    // 그룹 필터링
    if (groupFilter !== 'all') {
      if (groupFilter === 'none') {
        result = result.filter((item) => !item.groupName);
      } else {
        result = result.filter((item) => item.groupName === groupFilter);
      }
    }

    return result;
  }, [data, statusFilter, groupFilter]);

  // TanStack Table 컬럼 정의
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'select',
        size: columnWidths.select,
        enableResizing: false,
        header: '선택',
        cell: ({ row }) => {
          const hasUserId = !!row.original.userId;
          const checkbox = (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              disabled={!hasUserId}
            />
          );

          if (!hasUserId) {
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex">{checkbox}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>잼플에 가입하지 않은 임직원입니다</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return checkbox;
        },
      }),
      columnHelper.accessor('employeeNumber', {
        header: '사번',
        size: columnWidths.employee_code,
        cell: (info) => <div className="truncate">{info.getValue()}</div>,
      }),
      columnHelper.accessor('name', {
        header: '이름',
        size: columnWidths.name,
        cell: (info) => <div className="truncate">{info.getValue()}</div>,
      }),
      columnHelper.accessor('phoneNumber', {
        header: '전화번호',
        size: columnWidths.phone,
        enableSorting: false,
        cell: (info) => {
          const phone = info.getValue();
          // 11자리 전화번호 포맷팅: 01012345678 -> 010-1234-5678
          const formatted =
            phone && phone.replace(/\D/g, '').length === 11
              ? phone.replace(/\D/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
              : phone;
          return <div className="truncate">{formatted}</div>;
        },
      }),
      columnHelper.accessor('email', {
        header: '이메일',
        size: columnWidths.email,
        cell: (info) => <div className="truncate">{info.getValue() || '-'}</div>,
      }),
      columnHelper.accessor('balanceJams', {
        header: '잼 잔여량',
        size: columnWidths.jam_balance,
        cell: ({ row }) => {
          const hasUserId = !!row.original.userId;
          if (!hasUserId) {
            return <div />;
          }
          const balance = row.original.balanceJams;
          const capacity = row.original.totalJams || 0;
          const percentage = (balance / capacity) * 100;
          return (
            <div className="flex items-center gap-3">
              <Progress
                value={percentage}
                className="h-2 w-24 bg-gray-100"
                indicatorClassName="bg-[#FEE666]"
              />
              <span className="text-xs font-bold text-gray-700">{balance.toLocaleString()}/{capacity.toLocaleString()}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('leaveDate', {
        header: '퇴사일',
        size: columnWidths.resignation_date,
        sortingFn: dateSortingFn,
        cell: ({ row }) => {
          const status = row.original.status as EmployeeStatus;
          const leaveDate = row.original.leaveDate;

          // LEAVING 또는 LEFT 상태일 때만 퇴사일 표시
          if (status === EmployeeStatus.LEAVING || status === EmployeeStatus.LEFT) {
            return (
              <div className="truncate">
                {leaveDate ? format(new Date(leaveDate), 'yyyy-MM-dd') : '-'}
              </div>
            );
          }

          return <div className="truncate">-</div>;
        },
      }),
      columnHelper.accessor('membershipStartDate', {
        header: '멤버십 개시일',
        size: columnWidths.membership_start_date,
        sortingFn: dateSortingFn,
        cell: (info) => (
          <div className="truncate">
            {info.getValue() ? format(new Date(info.getValue()), 'yyyy-MM-dd') : '-'}
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: '재직상태',
        size: columnWidths.employment_status,
        cell: ({ row }) => {
          const status = row.original.status as EmployeeStatus;
          const hasUserId = !!row.original.userId;
          const editButton = (
            <button
              onClick={() => setStatusChangingEmployee(row.original)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
              aria-label="상태 변경"
              disabled={!hasUserId}
            >
              <Pencil className="h-4 w-4" />
            </button>
          );

          return (
            <div className="flex items-center justify-between gap-2 min-w-0">
              <div className="flex-1 min-w-0">
                <span className={getEmployeeStatusBadgeClassName(status)}>
                  {employeeStatusLabel[status]}
                </span>
              </div>
              {!hasUserId ? (
                <Tooltip>
                  <TooltipTrigger asChild>{editButton}</TooltipTrigger>
                  <TooltipContent>
                    <p>잼플에 가입하지 않은 임직원입니다</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                editButton
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('groupName', {
        header: '그룹',
        size: columnWidths.group_name,
        cell: ({ row }) => {
          const hasUserId = !!row.original.userId;
          const editButton = (
            <button
              onClick={() => setGroupChangingEmployee(row.original)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400"
              aria-label="그룹 변경"
              disabled={!hasUserId}
            >
              <Pencil className="h-4 w-4" />
            </button>
          );

          return (
            <div className="flex items-center justify-between gap-2 min-w-0">
              <span className="text-gray-600 flex-1 min-w-0 truncate">
                {row.original.groupName || '그룹 없음'}
              </span>
              {!hasUserId ? (
                <Tooltip>
                  <TooltipTrigger asChild>{editButton}</TooltipTrigger>
                  <TooltipContent>
                    <p>잼플에 가입하지 않은 임직원입니다</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                editButton
              )}
            </div>
          );
        },
      }),
    ],
    [columnWidths]
  );

  // TanStack Table 인스턴스
  const table = useReactTable({
    data: filteredData,
    columns,
    initialState: {
      pagination: { pageSize: 20 },
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      columnSizing,
    },
    enableRowSelection: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase();
      return (
        (row.original.name || '').toLowerCase().includes(search) ||
        (row.original.employeeNumber || '').toLowerCase().includes(search) ||
        (row.original.email || '').toLowerCase().includes(search) ||
        (row.original.groupName || '').toLowerCase().includes(search) ||
        (row.original.phoneNumber || '').toLowerCase().includes(search)
      );
    },
  });

  // 선택된 행 수
  const selectedRowCount = Object.keys(rowSelection).length;
  const selectedEmployees = useMemo(
    () =>
      table
        .getSelectedRowModel()
        .rows.map((r) => ({ id: r.original.userId, name: r.original.name })),
    [table, rowSelection]
  );

  // 페이지네이션 정보
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-white">
      {/* Toolbar */}
      <div className="py-4 flex items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3 flex-1">
          <SimpleSelect
            value={statusFilter}
            onValueChange={setStatusFilter}
            items={[
              { value: 'all', label: '전체 상태' },
              { value: 'default', label: '기본' },
              { value: EmployeeStatus.LEFT, label: '퇴사' },
              { value: EmployeeStatus.PENDING, label: '승인 대기' },
              { value: EmployeeStatus.REJECTED, label: '승인 거절' },
            ]}
            placeholder="전체 상태"
            triggerClassName="w-[120px]"
          />

          <SimpleSelect
            value={groupFilter}
            onValueChange={setGroupFilter}
            items={[
              { value: 'all', label: '전체 그룹' },
              { value: 'none', label: '그룹 없음' },
              ...groupList.map((group) => ({ value: group, label: group })),
            ]}
            placeholder="전체 그룹"
            triggerClassName="w-[120px]"
          />

          <div className="relative w-64">
            <Input
              placeholder="검색"
              value={globalFilter}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">페이지당 항목 수:</span>
          <SimpleSelect
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(v) => {
              table.setPageSize(Number(v));
            }}
            items={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
            ]}
            triggerClassName="w-[70px]"
          />

          <Button
            variant={selectedRowCount > 0 ? 'active' : 'inactive'}
            disabled={selectedRowCount === 0}
            onClick={() => setIsJamModalOpen(true)}
          >
            잼 할당
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <ScrollableTableContainer ref={scrollContainerRef}>
        <table
          className="w-full min-w-[1348px] caption-bottom text-sm"
          style={{ width: table.getCenterTotalSize() }}
        >
          <thead className="bg-gray-50 sticky top-0 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const isSorted = header.column.getIsSorted();
                  const canResize = header.column.getCanResize();
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={`relative text-xs font-semibold text-gray-600 ${
                        header.id === 'select'
                          ? `sticky left-0 z-30 bg-gray-50 ${isScrolled ? 'border-r border-border-default' : ''}`
                          : ''
                      } ${canSort ? 'cursor-pointer select-none hover:bg-gray-100' : ''}`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <div className={`flex items-center gap-1 ${header.id === 'select' ? 'justify-center' : ''}`}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && header.id !== 'select' && (
                            <>
                              {isSorted === 'asc' && (
                                <ArrowUp className="w-3 h-3 text-gray-700" />
                              )}
                              {isSorted === 'desc' && (
                                <ArrowDown className="w-3 h-3 text-gray-700" />
                              )}
                              {!isSorted && (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </>
                          )}
                        </div>
                      )}
                      {/* 리사이즈 핸들러 */}
                      {canResize && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-yellow-400 ${
                            header.column.getIsResizing() ? 'bg-yellow-500' : ''
                          }`}
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-gray-500"
                >
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50/50">
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id;
                    let cellClassName = '';
                    if (columnId === 'select') {
                      cellClassName = `text-center sticky left-0 z-10 bg-white ${isScrolled ? 'border-r border-border-default' : ''}`;
                    } else if (columnId === 'employee_code') {
                      cellClassName = 'font-mono text-gray-600';
                    } else if (columnId === 'name') {
                      cellClassName = 'font-medium text-gray-900';
                    } else if (
                      columnId === 'phone' ||
                      columnId === 'email' ||
                      columnId === 'join_date'
                    ) {
                      cellClassName = 'text-gray-600';
                    }
                    return (
                      <TableCell
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={cellClassName}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </ScrollableTableContainer>

      <JamAllocationModal
        isOpen={isJamModalOpen}
        onClose={() => {
          setIsJamModalOpen(false);
          setRowSelection({});
        }}
        credits={creditSummary?.credits || []}
        targets={selectedEmployees}
      />

      <EmployeeEditModal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        employee={editingEmployee}
      />

      <EmployeeStatusChangeModal
        isOpen={!!statusChangingEmployee}
        onClose={() => setStatusChangingEmployee(null)}
        employee={statusChangingEmployee}
      />

      <EmployeeGroupChangeModal
        isOpen={!!groupChangingEmployee}
        onClose={() => setGroupChangingEmployee(null)}
        employee={groupChangingEmployee}
      />

      {/* Footer Pagination */}
      <TablePagination
        currentPage={currentPage}
        pageCount={pageCount}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onFirstPage={() => table.setPageIndex(0)}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
        onLastPage={() => table.setPageIndex(pageCount - 1)}
        onPageChange={(page) => table.setPageIndex(page - 1)}
      />
    </div>
    </TooltipProvider>
  );
}
