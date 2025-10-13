import { cn } from '@/services/utils';
import React from 'react';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import { Eye, EyeSlash, Icon } from '@phosphor-icons/react';
import s from './form-input.module.css';
interface IPasswordInput extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'base';
  color?: 'light' | 'dark';
  wrapperClassName?: string;
  icon?: Icon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);
  preContent?: string | JSX.Element;
  postContent?: string | JSX.Element;
}
const PasswordInput = React.forwardRef<HTMLInputElement, IPasswordInput & IInputWrapper>(
  ({ name, className, label, note, wrapperClassName, error, size = 'base', color = 'light', icon: Icon, preContent, postContent, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <InputWrapper name={name} label={label} note={note} error={error} className={wrapperClassName}>
        <div className="relative">
          {preContent}
          {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform select-none text-gray" />}
          <input
            ref={ref}
            {...props}
            type={showPassword ? 'text' : 'password'}
            name={name}
            id={name}
            aria-invalid={!!error || undefined}
            aria-describedby={error}
            aria-disabled={!!props.disabled || undefined}
            className={cn(s['form-input'], className)}
            data-size={size}
            data-icon={!!Icon}
            data-color={color}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn('absolute right-4 top-1/2 -translate-y-1/2', {
              'text-gray-300': color === 'light',
              'text-white': color === 'dark',
            })}
            tabIndex={-1}
          >
            {showPassword ? <EyeSlash size={22} /> : <Eye size={22} />}
          </button>
          {postContent}
        </div>
      </InputWrapper>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
