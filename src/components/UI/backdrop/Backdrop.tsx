import { cn } from '@/services/utils';
import React from 'react';
import style from './backdrop.module.css';
interface IBackdrop extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void;
}
const Backdrop: React.FC<IBackdrop> = ({ onClick, className, children, ...props }) => {
  return (
    <div onClick={onClick} onKeyUp={onClick} className={cn([style.backdrop, className])} {...props} role="button" tabIndex={0}>
      {children}
    </div>
  );
};
export default Backdrop;
