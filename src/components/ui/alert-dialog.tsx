import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

interface AlertDialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> {
  className?: string;
}

const AlertDialogOverlay = ({ className, ...props }: AlertDialogOverlayProps) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
);

interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  className?: string;
}

const AlertDialogContent = ({ className, ...props }: AlertDialogContentProps) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
);

interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AlertDialogHeader = ({ className, ...props }: AlertDialogHeaderProps) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);

interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AlertDialogFooter = ({ className, ...props }: AlertDialogFooterProps) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);

interface AlertDialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> {
  className?: string;
}

const AlertDialogTitle = ({ className, ...props }: AlertDialogTitleProps) => (
  <AlertDialogPrimitive.Title className={cn('text-lg font-semibold', className)} {...props} />
);

interface AlertDialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> {
  className?: string;
}

const AlertDialogDescription = ({ className, ...props }: AlertDialogDescriptionProps) => (
  <AlertDialogPrimitive.Description
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);

interface AlertDialogActionProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> {
  className?: string;
}

const AlertDialogAction = ({ className, ...props }: AlertDialogActionProps) => (
  <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...props} />
);

interface AlertDialogCancelProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> {
  className?: string;
}

const AlertDialogCancel = ({ className, ...props }: AlertDialogCancelProps) => (
  <AlertDialogPrimitive.Cancel
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
);

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
