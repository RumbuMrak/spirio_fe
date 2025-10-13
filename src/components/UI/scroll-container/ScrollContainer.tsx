import React, { ReactNode } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { cn } from '@/services/utils';
import s from './scroll-container.module.css';
const ScrollContainer = React.forwardRef<HTMLDivElement, { children: ReactNode; maxHeight?: string } & ScrollArea.ScrollAreaProps>(
  ({ children, className, maxHeight = 'none', ...props }, ref) => {
    return (
      <ScrollArea.Root ref={ref} {...props} className={cn('overflow-hidden', className)}>
        <ScrollArea.Viewport className="h-full w-full" style={{ maxHeight }}>
          {children}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className={s.scrollbar} orientation="vertical">
          <ScrollArea.Thumb className={s.thumb} />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-gray-200" />
      </ScrollArea.Root>
    );
  },
);
ScrollContainer.displayName = 'ScrollContainer';
export default ScrollContainer;
