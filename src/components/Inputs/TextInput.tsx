import { cn } from '@/services/utils';
import React from 'react';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import { Icon } from '@phosphor-icons/react';
import s from './form-input.module.css';
interface ITextInput extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'base';
  color?: 'light' | 'dark';
  wrapperClassName?: string;
  icon?: Icon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);
  preContent?: string | JSX.Element;
  postContent?: string | JSX.Element;
}
const TextInput = React.forwardRef<HTMLInputElement, ITextInput & IInputWrapper>(
  ({ name, className, label, note, wrapperClassName, error, size = 'base', color = 'light', icon: Icon, preContent, postContent, ...props }, ref) => {
    return (
      <InputWrapper name={name} label={label} note={note} error={error} className={wrapperClassName}>
        <div className="relative">
          {preContent}
          {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform select-none text-gray" />}
          <input
            ref={ref}
            {...props}
            name={name}
            id={name}
            onWheel={(e) => (props.type === 'number' ? (e.target as HTMLInputElement).blur() : props.onWheel)}
            aria-invalid={!!error || undefined}
            aria-describedby={error}
            aria-disabled={!!props.disabled || undefined}
            className={cn(s['form-input'], className)}
            inputMode={props.type === 'number' ? 'numeric' : (props.inputMode ?? 'text')}
            data-size={size}
            data-icon={!!Icon}
            data-color={color}
          />
          {postContent}
        </div>
      </InputWrapper>
    );
  },
);
TextInput.displayName = 'TextInput';
export default TextInput;
