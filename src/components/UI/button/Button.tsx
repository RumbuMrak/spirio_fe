import style from './button.module.css';
import { cn } from '@/services/utils';
import React from 'react';
import Link, { LinkProps } from 'next/link';
import Spinner from '../spinner/Spinner';
export interface ButtonBase {
  color?: 'gradient' | 'gradient-dark' | 'primary' | 'white' | 'transparent-white' | 'transparent' | 'outline-white';
  size?: 'default' | 'sm' | 'lg' | 'xs';
  className?: string;
}
interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: 'submit' | 'button';
  loading?: boolean;
  disabled?: boolean;
}
type ILink = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & LinkProps;
const Button = React.forwardRef<HTMLButtonElement, ButtonBase & (IButton | ILink)>((props, ref) => {
  if ('href' in props) {
    const { className, color = 'primary', size = 'default', children, ...linkProps } = props;
    return (
      <Link {...linkProps} className={cn([style.button, className])} data-color={color} data-size={size}>
        {children}
      </Link>
    );
  } else {
    const { className, onClick, color = 'primary', children, disabled, loading, type = 'button', size = 'default', ...args } = props;
    return (
      <button
        {...args}
        ref={ref}
        type={type}
        onClick={disabled || loading ? () => {} : onClick}
        className={cn([style.button, 'appearance-none', className])}
        data-color={color}
        data-size={size}
        data-state={(loading && 'loading') || (disabled && 'disabled')}
        disabled={disabled}
        title={loading ? 'Načítám' : undefined}
      >
        {children}
        {loading && <Spinner color={color === 'white' ? 'primary' : 'white'} className={['!absolute', size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'].join(' ')} />}
      </button>
    );
  }
});
Button.displayName = 'Button';
export default Button;
