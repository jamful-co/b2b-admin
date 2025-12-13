import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn('text-card-foreground bg-white rounded-lg border border-[color:var(--border-default)]', className)}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: CardProps) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardTitle = ({ className, ...props }: CardProps) => (
  <div
    className={cn('leading-none tracking-tight text-sm font-semibold text-[color:var(--text-secondary)]', className)}
    {...props}
  />
);

const CardDescription = ({ className, ...props }: CardProps) => (
  <div className={cn('text-sm text-muted-foreground', className)} {...props} />
);

const CardContent = ({ className, ...props }: CardProps) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

const CardFooter = ({ className, ...props }: CardProps) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
