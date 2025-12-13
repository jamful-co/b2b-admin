import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />
);

export { Skeleton };
