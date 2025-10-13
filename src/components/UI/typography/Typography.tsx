import { cn } from '@/services/utils';
import React from 'react';
import s from './typography.module.css';
export const H1: (props: React.HTMLAttributes<HTMLOrSVGElement> & { children: React.ReactNode; tag?: keyof JSX.IntrinsicElements }) => JSX.Element = ({
  className,
  children,
  tag: Tag = 'h1',
  ...props
}) => {
  return (
    <Tag {...props} className={cn(s.h1, className)}>
      {children}
    </Tag>
  );
};
export const H2: (props: React.HTMLAttributes<HTMLOrSVGElement> & { children: React.ReactNode; tag?: keyof JSX.IntrinsicElements }) => JSX.Element = ({
  className,
  children,
  tag: Tag = 'h2',
  ...props
}) => {
  return (
    <Tag {...props} className={cn(s.h2, className)}>
      {children}
    </Tag>
  );
};
export const H3: (props: React.HTMLAttributes<HTMLOrSVGElement> & { children: React.ReactNode; tag?: keyof JSX.IntrinsicElements }) => JSX.Element = ({
  className,
  children,
  tag: Tag = 'h3',
  ...props
}) => {
  return (
    <Tag {...props} className={cn(s.h3, className)}>
      {children}
    </Tag>
  );
};
export const H4: (props: React.HTMLAttributes<HTMLOrSVGElement> & { children: React.ReactNode; tag?: keyof JSX.IntrinsicElements }) => JSX.Element = ({
  className,
  children,
  tag: Tag = 'h4',
  ...props
}) => {
  return (
    <Tag {...props} className={cn(s.h4, className)}>
      {children}
    </Tag>
  );
};
export const GradientTitle: (
  props: React.HTMLAttributes<HTMLOrSVGElement> & { children: React.ReactNode; tag?: keyof JSX.IntrinsicElements },
) => JSX.Element = ({ className, children, tag: Tag = 'h3', ...props }) => {
  return (
    <Tag {...props} className={cn(s['gradient-title'], className)}>
      {children}
    </Tag>
  );
};
