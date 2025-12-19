'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  className?: string;
}

const SelectTrigger = ({ className, children, ...props }: SelectTriggerProps) => (
  <SelectPrimitive.Trigger
    className={cn(
      'flex h-11 w-full items-center justify-between whitespace-nowrap rounded-lg border border-border-default bg-white px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

interface SelectScrollButtonProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> {
  className?: string;
}

const SelectScrollUpButton = ({ className, ...props }: SelectScrollButtonProps) => (
  <SelectPrimitive.ScrollUpButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
);

const SelectScrollDownButton = ({ className, ...props }: SelectScrollButtonProps) => (
  <SelectPrimitive.ScrollDownButton
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
);

interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  className?: string;
  position?: 'popper' | 'item-aligned';
}

const SelectContent = ({ className, children, position = 'popper', ...props }: SelectContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  className?: string;
}

const SelectLabel = ({ className, ...props }: SelectLabelProps) => (
  <SelectPrimitive.Label
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
);

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  className?: string;
}

const SelectItem = ({ className, children, ...props }: SelectItemProps) => (
  <SelectPrimitive.Item
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground hover:bg-[#FFFDD2] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> {
  className?: string;
}

const SelectSeparator = ({ className, ...props }: SelectSeparatorProps) => (
  <SelectPrimitive.Separator
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
);

// Simple Select with items prop
interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  items: SelectOption[];
  placeholder?: string;
  triggerClassName?: string;
  itemClassName?: string;
  disabled?: boolean;
  // 커스텀 렌더링 함수들
  renderItem?: (item: SelectOption, isSelected?: boolean) => React.ReactNode;
  renderValue?: (selectedItem: SelectOption | undefined) => React.ReactNode;
}

const SimpleSelect = ({
  value,
  onValueChange,
  items,
  placeholder = 'Select...',
  triggerClassName,
  itemClassName = 'focus:bg-[#FFFDD2] cursor-pointer rounded-[4px]',
  disabled = false,
  renderItem,
  renderValue,
}: SimpleSelectProps) => {
  const selectedItem = items.find((item) => item.value === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={triggerClassName}>
        {renderValue && selectedItem ? (
          <div className="flex items-center justify-between w-full">
            <span>{renderValue(selectedItem)}</span>
          </div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value} className={itemClassName}>
            {renderItem ? renderItem(item, item.value === value) : item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SimpleSelect,
};
