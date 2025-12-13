import { Slot } from '@radix-ui/react-slot';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  className?: string;
}

const Breadcrumb = ({ ...props }: BreadcrumbProps) => <nav aria-label="breadcrumb" {...props} />;

interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<'ol'> {
  className?: string;
}

const BreadcrumbList = ({ className, ...props }: BreadcrumbListProps) => (
  <ol
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className
    )}
    {...props}
  />
);

interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<'li'> {
  className?: string;
}

const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => (
  <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
);

interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
  className?: string;
}

const BreadcrumbLink = ({ asChild, className, ...props }: BreadcrumbLinkProps) => {
  const Comp = asChild ? Slot : 'a';
  return <Comp className={cn('transition-colors hover:text-foreground', className)} {...props} />;
};

interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<'span'> {
  className?: string;
}

const BreadcrumbPage = ({ className, ...props }: BreadcrumbPageProps) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
);

interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<'li'> {
  className?: string;
}

const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('[&>svg]:w-3.5 [&>svg]:h-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);

interface BreadcrumbEllipsisProps extends React.ComponentPropsWithoutRef<'span'> {
  className?: string;
}

const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
