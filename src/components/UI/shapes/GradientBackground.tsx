import { cn } from '@/services/utils';
import React from 'react';
import s from './shapes.module.css';
const GradientBackground: (props: React.HTMLAttributes<HTMLDivElement>) => JSX.Element = ({ className, ...props }) => {
  return <div {...props} className={cn(s.gradient, className)} />;
};
export default GradientBackground;
