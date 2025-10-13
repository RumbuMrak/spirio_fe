import { cn } from '@/services/utils';
import React from 'react';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import s from './form-input.module.css';
interface ISwitcherInput extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  children?: React.ReactNode;
}
const SwitcherInput = React.forwardRef<HTMLDivElement, ISwitcherInput & IInputWrapper>(
  ({ name, className, label, wrapperClassName, error, note, children, ...props }, ref) => {
    return (
      <InputWrapper ref={ref} name={name} error={error} className={wrapperClassName} note={note}>
        <div className="flex items-center gap-2">
          <label htmlFor={name} className={cn(['flex cursor-pointer', className], { '!cursor-not-allowed opacity-50': !!props.disabled })}>
            <input
              {...props}
              name={name}
              id={name}
              type="checkbox"
              aria-invalid={!!error || undefined}
              aria-describedby={error}
              aria-disabled={!!props.disabled || undefined}
              onChange={(e) => !props.disabled && props.onChange?.(e)}
              className={cn(s['form-switcher'])}
            />
            <span className="full h-6 w-11 rounded"></span>
          </label>
          <div>{children}</div>
        </div>
      </InputWrapper>
    );
  },
);
SwitcherInput.displayName = 'SwitcherInput';
export default SwitcherInput;
