import { cn } from '@/services/utils';
import React from 'react';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import { Check } from '@phosphor-icons/react';
import s from './form-input.module.css';
interface ICheckboxInput extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  children?: React.ReactNode;
}
const CheckboxInput = React.forwardRef<HTMLDivElement, ICheckboxInput & IInputWrapper>(
  ({ name, className, label, wrapperClassName, error, note, children, ...props }, ref) => {
    return (
      <InputWrapper ref={ref} name={name} error={error} className={wrapperClassName} note={note}>
        <div className="flex items-center">
          <label htmlFor={name} className={cn(['flex cursor-pointer items-start gap-3', className], { '!cursor-not-allowed opacity-50': !!props.disabled })}>
            <input
              {...props}
              name={name}
              id={name}
              type="checkbox"
              aria-invalid={!!error || undefined}
              aria-describedby={error}
              aria-disabled={!!props.disabled || undefined}
              className={cn(s['form-checkbox'])}
              onChange={(e) => !props.disabled && props.onChange?.(e)}
            />
            <span>
              <Check size={14} weight="bold" />
            </span>
            <div>{children}</div>
          </label>
        </div>
      </InputWrapper>
    );
  },
);
CheckboxInput.displayName = 'CheckboxInput';
export default CheckboxInput;
