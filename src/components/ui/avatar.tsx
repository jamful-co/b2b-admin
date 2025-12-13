'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  className?: string;
}

const Avatar = ({ className, ...props }: AvatarProps) => (
  <AvatarPrimitive.Root
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
);

interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {
  className?: string;
}

const AvatarImage = ({ className, ...props }: AvatarImageProps) => (
  <AvatarPrimitive.Image
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
);

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  className?: string;
}

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
    {...props}
  />
);

export { Avatar, AvatarImage, AvatarFallback };
