import { cn } from '@/services/utils';
import React from 'react';
import styles from './spinner.module.css';
const Spinner: (props: { color?: 'black' | 'primary' | 'white' } & React.HTMLAttributes<HTMLSpanElement>) => JSX.Element = ({
  color = 'black',
  className,
  title,
  ...props
}) => {
  return <span {...props} data-color={color} className={cn([styles.spinner, className])} title={title ?? 'Načítám..'} />;
};
export default Spinner;
