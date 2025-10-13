import { cn } from '@/services/utils';
import { IconProps } from '@phosphor-icons/react';
import { IconType } from '@types';
import React, { PropsWithChildren } from 'react';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'base' | 'lg';
  color?: 'transparent-white';
  icon?: IconType;
  iconProps?: IconProps;
}
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps & PropsWithChildren>(
  ({ size = 'base', color = 'success', icon: Icon, iconProps, className, children, ...props }, ref) => {
    return (
      <span
        {...props}
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 whitespace-nowrap rounded-md font-500',
          { 'px-2 py-0.5 text-xs': size === 'sm' },
          { 'px-2 py-0.5 text-base': size === 'base' },
          { 'px-2.5 py-1.5 text-base sm:text-lg': size === 'lg' },
          { 'bg-white/10': color === 'transparent-white' },
          className,
        )}
        data-size={size}
        data-color={color}
      >
        {Icon && <Icon weight="bold" {...iconProps} className={cn('h-3 w-3 shrink-0', iconProps?.className)} />}
        {children}
      </span>
    );
  },
);
Badge.displayName = 'Badge';
export default Badge;
