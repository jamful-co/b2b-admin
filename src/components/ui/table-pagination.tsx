import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  currentPage,
  pageCount,
  canPreviousPage,
  canNextPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  onPageChange,
}: TablePaginationProps) {
  return (
    <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 bg-white">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 text-xs"
        onClick={onFirstPage}
        disabled={!canPreviousPage}
      >
        처음
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 text-xs gap-1"
        onClick={onPreviousPage}
        disabled={!canPreviousPage}
      >
        <ChevronLeft className="w-4 h-4" /> 이전
      </Button>

      <div className="flex items-center gap-1 mx-2">
        {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
          let p = i + 1;
          if (pageCount > 5 && currentPage > 3) {
            p = currentPage - 2 + i;
            if (p > pageCount) p = p - (p - pageCount);
          }
          if (pageCount > 5 && currentPage > pageCount - 2) {
            p = pageCount - 4 + i;
          }

          if (p <= 0 || p > pageCount) return null;

          return (
            <Button
              key={p}
              variant={currentPage === p ? 'default' : 'ghost'}
              size="sm"
              className={`w-8 h-8 p-0 text-xs ${
                currentPage === p
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'text-gray-500'
              }`}
              onClick={() => onPageChange(p)}
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
        onClick={onNextPage}
        disabled={!canNextPage}
      >
        다음 <ChevronRight className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 text-xs"
        onClick={onLastPage}
        disabled={!canNextPage}
      >
        끝
      </Button>
    </div>
  );
}

