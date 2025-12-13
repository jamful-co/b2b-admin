'use client';

import { Drawer as DrawerPrimitive } from 'vaul';
import { cn } from '@/lib/utils';

interface DrawerProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Root> {
  shouldScaleBackground?: boolean;
}

const Drawer = ({ shouldScaleBackground = true, ...props }: DrawerProps) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

interface DrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> {
  className?: string;
}

const DrawerOverlay = ({ className, ...props }: DrawerOverlayProps) => (
  <DrawerPrimitive.Overlay
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
);

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> {
  className?: string;
}

const DrawerContent = ({ className, children, ...props }: DrawerContentProps) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
);

interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const DrawerHeader = ({ className, ...props }: DrawerHeaderProps) => (
  <div className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)} {...props} />
);

interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);

interface DrawerTitleProps extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title> {
  className?: string;
}

const DrawerTitle = ({ className, ...props }: DrawerTitleProps) => (
  <DrawerPrimitive.Title
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
);

interface DrawerDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description> {
  className?: string;
}

const DrawerDescription = ({ className, ...props }: DrawerDescriptionProps) => (
  <DrawerPrimitive.Description
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
);

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
