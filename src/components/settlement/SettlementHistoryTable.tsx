import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function SettlementHistoryTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">월별 정산 내역</h2>

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[200px] text-xs font-semibold text-gray-600">
                이용 월
              </TableHead>
              <TableHead className="w-[200px] text-xs font-semibold text-gray-600">
                확정일
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-600">정산 인원</TableHead>
              <TableHead className="text-xs font-semibold text-gray-600">총 정산 금액</TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-gray-600 text-center">
                정산 진행
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-gray-600">{item.usage_month}</TableCell>
                  <TableCell className="text-gray-600">
                    {item.confirmation_date
                      ? format(new Date(item.confirmation_date), 'yyyy-MM-dd')
                      : '-'}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.headcount}명</TableCell>
                  <TableCell className="font-bold text-gray-900">
                    {item.total_amount.toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-center">
                    {item.status === 'scheduled' ? (
                      <Badge className="bg-[#FFF1E7] text-[#FF8A3D] hover:bg-[#FFF1E7] border-0 font-normal">
                        예정
                      </Badge>
                    ) : (
                      <Badge className="bg-[#E7FFFA] text-[#00C48C] hover:bg-[#E7FFFA] border-0 font-normal">
                        완료
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 bg-white">
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={currentPage === p ? 'default' : 'ghost'}
                size="sm"
                className={`w-8 h-8 p-0 text-xs ${
                  currentPage === p
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </Button>
            ))}
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
        </div>
      </div>
    </div>
  );
}
