'use client';

import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const MenubarSub = MenubarPrimitive.Sub;

interface MenubarProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root> {
  className?: string;
}

const Menubar = ({ className, ...props }: MenubarProps) => (
  <MenubarPrimitive.Root
    className={cn(
      'flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm',
      className
    )}
    {...props}
  />
);

interface MenubarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger> {
  className?: string;
}

const MenubarTrigger = ({ className, ...props }: MenubarTriggerProps) => (
  <MenubarPrimitive.Trigger
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      className
    )}
    {...props}
  />
);

interface MenubarSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> {
  className?: string;
  inset?: boolean;
}

const MenubarSubTrigger = ({ className, inset, children, ...props }: MenubarSubTriggerProps) => (
  <MenubarPrimitive.SubTrigger
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
);

interface MenubarSubContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent> {
  className?: string;
}

const MenubarSubContent = ({ className, ...props }: MenubarSubContentProps) => (
  <MenubarPrimitive.SubContent
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
);

interface MenubarContentProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content> {
  className?: string;
}

const MenubarContent = ({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: MenubarContentProps) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
);

interface MenubarItemProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> {
  className?: string;
  inset?: boolean;
}

const MenubarItem = ({ className, inset, ...props }: MenubarItemProps) => (
  <MenubarPrimitive.Item
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
);

interface MenubarCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> {
  className?: string;
}

const MenubarCheckboxItem = ({ className, children, checked, ...props }: MenubarCheckboxItemProps) => (
  <MenubarPrimitive.CheckboxItem
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
);

interface MenubarRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem> {
  className?: string;
}

const MenubarRadioItem = ({ className, children, ...props }: MenubarRadioItemProps) => (
  <MenubarPrimitive.RadioItem
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-4 w-4 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
);

interface MenubarLabelProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> {
  className?: string;
  inset?: boolean;
}

const MenubarLabel = ({ className, inset, ...props }: MenubarLabelProps) => (
  <MenubarPrimitive.Label
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
);

interface MenubarSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator> {
  className?: string;
}

const MenubarSeparator = ({ className, ...props }: MenubarSeparatorProps) => (
  <MenubarPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
);

interface MenubarShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const MenubarShortcut = ({ className, ...props }: MenubarShortcutProps) => (
  <span
    className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
    {...props}
  />
);

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
