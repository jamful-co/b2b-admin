import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

const Table = ({ className, ...props }: TableProps) => (
  <div className="relative w-full overflow-auto">
    <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
);

// Scrollable Table Container with sticky horizontal scrollbar
interface ScrollableTableContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  bordered?: boolean;
}

const ScrollableTableContainer = forwardRef<HTMLDivElement, ScrollableTableContainerProps>(
  ({ className, bordered = true, children, ...props }, ref) => (
    <div
      className={cn(
        'flex-1 flex flex-col overflow-hidden',
        bordered && 'border border-border-default rounded-lg',
        className
      )}
      {...props}
    >
      <div ref={ref} className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  )
);

ScrollableTableContainer.displayName = 'ScrollableTableContainer';

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableHeader = ({ className, ...props }: TableHeaderProps) => (
  <thead className={cn('[&_tr]:border-b', className)} {...props} />
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableBody = ({ className, ...props }: TableBodyProps) => (
  <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
);

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableFooter = ({ className, ...props }: TableFooterProps) => (
  <tfoot
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableHead = ({ className, ...props }: TableHeadProps) => (
  <th
    className={cn(
      'h-12 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableCell = ({ className, ...props }: TableCellProps) => (
  <td
    className={cn(
      'h-[54px] px-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className
    )}
    {...props}
  />
);

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string;
}

const TableCaption = ({ className, ...props }: TableCaptionProps) => (
  <caption className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
);

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  ScrollableTableContainer
};
