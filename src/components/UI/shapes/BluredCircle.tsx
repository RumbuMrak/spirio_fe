import { cn } from '@/services/utils';
import s from './shapes.module.css';
import React from 'react';
const BluredCircle: (props: React.HTMLAttributes<HTMLSpanElement>) => JSX.Element = ({ className, ...props }) => {
  return <span {...props} className={cn(s.circle, className)} />;
};
export default BluredCircle;
