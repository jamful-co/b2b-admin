import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  className?: string;
}

const Label = ({ className, ...props }: LabelProps) => (
  <LabelPrimitive.Root
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
);

export { Label };
