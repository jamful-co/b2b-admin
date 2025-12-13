import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonProps } from '@/components/ui/button';

interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  className?: string;
}

const Pagination = ({ className, ...props }: PaginationProps) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);

interface PaginationContentProps extends React.ComponentPropsWithoutRef<'ul'> {
  className?: string;
}

const PaginationContent = ({ className, ...props }: PaginationContentProps) => (
  <ul className={cn('flex flex-row items-center gap-1', className)} {...props} />
);

interface PaginationItemProps extends React.ComponentPropsWithoutRef<'li'> {
  className?: string;
}

const PaginationItem = ({ className, ...props }: PaginationItemProps) => (
  <li className={cn('', className)} {...props} />
);

interface PaginationLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  className?: string;
  isActive?: boolean;
  size?: ButtonProps['size'];
}

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className
    )}
    {...props}
  />
);

interface PaginationPreviousProps extends React.ComponentPropsWithoutRef<typeof PaginationLink> {
  className?: string;
}

const PaginationPrevious = ({ className, ...props }: PaginationPreviousProps) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);

interface PaginationNextProps extends React.ComponentPropsWithoutRef<typeof PaginationLink> {
  className?: string;
}

const PaginationNext = ({ className, ...props }: PaginationNextProps) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

interface PaginationEllipsisProps extends React.ComponentPropsWithoutRef<'span'> {
  className?: string;
}

const PaginationEllipsis = ({ className, ...props }: PaginationEllipsisProps) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
