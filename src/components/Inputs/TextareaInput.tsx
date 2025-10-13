import { cn } from '@/services/utils';
import React from 'react';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import s from './form-input.module.css';
interface ITextareaInput extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  wrapperClassName?: string;
  size?: 'sm' | 'base';
  color?: 'light' | 'dark';
}
const TextareaInput = React.forwardRef<HTMLTextAreaElement, ITextareaInput & IInputWrapper>(
  ({ name, className, placeholder, label, wrapperClassName, error, size = 'base', color = 'light', ...props }, ref) => {
    return (
      <InputWrapper name={name} label={label} error={error} className={wrapperClassName}>
        <textarea
          ref={ref}
          {...props}
          name={name}
          placeholder={placeholder}
          id={name}
          className={cn([s['form-input'], className])}
          aria-invalid={!!error || undefined}
          aria-describedby={error}
          aria-disabled={!!props.disabled || undefined}
          data-size={size}
          data-color={color}
        ></textarea>
      </InputWrapper>
    );
  },
);
TextareaInput.displayName = 'TextareaInput';
export default TextareaInput;
