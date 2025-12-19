import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnSizingState,
} from '@tanstack/react-table';
import { TableCell, TableHead, TableRow, ScrollableTableContainer } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';
import { EmployeeGroupData } from '@/graphql/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GroupTableProps {
  data: EmployeeGroupData[];
  isLoading?: boolean;
  onEdit?: (group: EmployeeGroupData) => void;
  onDelete?: (id: number) => void;
}

// 상태 배지 스타일
const getStatusBadgeClassName = (isActive: boolean) => {
  const base =
    'inline-flex items-center justify-center rounded-full px-3 py-[3px] text-sm font-semibold leading-[1.4]';
  if (isActive) {
    return `${base} bg-[#E8FFF1] text-[#12B76A]`;
  }
  return `${base} bg-[#F4F4F4] text-[#6C7885]`;
};

const columnHelper = createColumnHelper<EmployeeGroupData>();

export default function GroupTable({ data, isLoading, onEdit, onDelete }: GroupTableProps) {
  // TanStack Table State
  const [sorting, setSorting] = useState<SortingState>([{ id: 'memberCount', desc: false }]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  // 컬럼 폭을 비율로 설정 (전체 폭 사용)
  const columnWidths = {
    name: 150,
    memberCount: 150,
    credits: 180,
    renewDate: 180,
    status: 150,
    actions: 50,
  };

  // Format recharge date label
  const getRechargeDateLabel = (value: number) => {
    if (value === 0) {
      return '매월 말일';
    }
    return `매월 ${value}일`;
  };

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '잼';
  };



  // TanStack Table 컬럼 정의
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '그룹 이름',
        size: columnWidths.name,
        cell: (info) => <div className="text-gray-600">{info.getValue()}</div>,
      }),
      columnHelper.accessor('employeeCount', {
        header: '그룹 인원',
        size: columnWidths.memberCount,
        cell: (info) => <div className="text-gray-600">{info.getValue()}명</div>,
      }),
      columnHelper.accessor('credits', {
        header: '충전 잼',
        size: columnWidths.credits,
        cell: (info) => <div className="text-gray-600">{formatAmount(info.getValue())}</div>,
      }),
      columnHelper.accessor('renewDate', {
        header: '충전일',
        size: columnWidths.renewDate,
        enableSorting: false,
        cell: (info) => <div className="text-gray-600">{getRechargeDateLabel(info.getValue())}</div>,
      }),
      columnHelper.accessor('isActive', {
        header: '상태',
        size: columnWidths.status,
        cell: (info) => (
          <span className={getStatusBadgeClassName(info.getValue())}>
            {info.getValue() ? '활성화' : '비활성화'}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: '옵션',
        size: columnWidths.actions,
        enableSorting: false,
        enableResizing: false,
        cell: ({ row }) => (
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">메뉴 열기</span>
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[90px]">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row.original);
                    }}
                    className="cursor-pointer focus:bg-[#FFFDD2] focus:text-gray-900"
                  >
                    수정
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row.original.employeeGroupId);
                    }}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    삭제
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }),
    ],
    [columnWidths, onEdit, onDelete]
  );

  // TanStack Table 인스턴스
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnSizing,
    },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row.employeeGroupId),
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Table Area */}
      <ScrollableTableContainer>
        <table
          className="w-full caption-bottom text-sm"
          style={{ tableLayout: 'fixed' }}
        >
          <thead className="bg-gray-50 sticky top-0 z-10">
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
                        canSort ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                      }`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </ScrollableTableContainer>
    </div>
  );
}

