import React from 'react';
import s from './form-input.module.css';
export interface IInputWrapper {
  name: string;
  label?: string | JSX.Element;
  error?: string;
  note?: string;
}
const InputWrapper = React.forwardRef<HTMLDivElement, IInputWrapper & React.HTMLAttributes<HTMLDivElement>>(
  ({ name, label, error, note, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {label && (
          <label htmlFor={name} className={s['form-input__label']} aria-invalid={!!error || undefined}>
            {label}
          </label>
        )}
        {children}
        {!!error && (
          <div className={s['form-input__error']} role="alert">
            {error}
          </div>
        )}
        {note && !error && (
          <div className={s['form-input__note']} role="contentinfo">
            {note}
          </div>
        )}
      </div>
    );
  },
);
InputWrapper.displayName = 'InputWrapper';
export default InputWrapper;
