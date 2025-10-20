import { GuideProfileType } from '@/features/user/types/user';
import { cn } from '@/services/utils';
import React from 'react';

const GuideStatusBadge: (
  props: { state: GuideProfileType['call_status'] } & React.HTMLAttributes<HTMLSpanElement>
) => JSX.Element = ({ state, className, ...props }) => {
  const stateData = {
    'online': {
      className: 'bg-success-100 text-success-700',
      text: '(Video hovor + Audio hovor)',
      callst: 'Online'
    },
    'audio-online': {
      className: 'bg-success-100 text-success-700',
      text: '(Audio hovor)',
      callst: 'Audio',
    },
    'chat-online': {
      className: 'bg-success-100 text-success-700',
      text: '(Chat)',
      callst: 'Chat',
    },
    'chat-audio-online': {
      className: 'bg-success-100 text-success-700',
      text: '(Chat + Audio hovor)',
      callst: 'Online',
    },
    'chat-video-online': {
      className: 'bg-success-100 text-success-700',
      text: '(Chat + Video hovor)',
      callst: 'Online',
    },
    'all-online': {
      className: 'bg-success-100 text-success-700',
      text: '(Chat + Audio hovor + Video hovor)',
      callst: 'Online',
    },
    'offline': {
      className: 'text-[#500D0D] bg-[#cf9b0a]',
      text: 'Rezervuj si termín',
      callst: 'Offline',
    },
    'busy': {
      className: 'text-white bg-warning-100 text-warning-600',
      text: 'Obsazeno',
      callst: 'Průvodce právě volá',
    },
  } as const satisfies Record<GuideProfileType['call_status'], { className: string; text: string, callst: string }>;

  return (
    <div>
    <span
      {...props}
      className={cn(
        'rounded-md px-2.5 py-1 text-xs font-500 md:text-lg',
        stateData[state].className,
        className
      )}
    >
      {stateData[state].callst}
    </span>
    <span> {stateData[state].text}</span>
    </div>
  );
};


export default GuideStatusBadge;
