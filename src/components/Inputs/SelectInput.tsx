import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import { CaretDown, Check } from '@phosphor-icons/react';
import { cn } from '@/services/utils';
import { Transition } from '@headlessui/react';
import { scaleOpacityAnimation } from '@/services/animations';
import ScrollContainer from '../UI/scroll-container/ScrollContainer';
import ConditionalWrapper from '../UI/ConditionalWrapper';
import s from './form-input.module.css';
interface ISelect {
  onChange: (event: { target: { value: string; name?: string }; type?: any }) => void;
  options?: { label: string | JSX.Element; value: string }[];
  placeholder?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  contentItemClassName?: string;
  valueToShow?: string;
  size?: 'sm' | 'base';
  className?: string;
  preContent?: JSX.Element;
  postContent?: JSX.Element;
  portal?: boolean;
}
export const SelectInput = React.forwardRef<HTMLButtonElement, SelectPrimitive.SelectProps & ISelect & IInputWrapper>(
  (
    {
      children,
      preContent,
      postContent,
      portal,
      options,
      onChange,
      placeholder,
      className,
      name,
      label,
      error,
      note,
      wrapperClassName,
      contentClassName,
      contentItemClassName,
      valueToShow,
      size = 'base',
      ...props
    },
    forwardedRef,
  ) => {
    const [value, setValue] = React.useState(props.defaultValue ?? undefined);
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
      setValue(props.defaultValue);
    }, [props.defaultValue]);
    return (
      <SelectPrimitive.Root
        value={value}
        {...props}
        onValueChange={(value) => {
          setValue(value);
          onChange({ target: { value, name } });
        }}
        onOpenChange={(open) => setOpen(open)}
        open={open}
      >
        <InputWrapper name={name} label={label} error={error} className={wrapperClassName} note={note}>
          <div className="relative">
            <SelectPrimitive.Trigger
              ref={forwardedRef}
              className={cn(s['form-input'], s['form-select'], className)}
              aria-invalid={!!error || undefined}
              aria-describedby={error}
              data-size={size}
            >
              <SelectPrimitive.Value placeholder={placeholder || `Vybrat..`}>{valueToShow}</SelectPrimitive.Value>
              <SelectPrimitive.Icon className="ml-auto">
                <CaretDown className="w-4 text-gray" weight="bold" />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
          </div>
        </InputWrapper>
        <ConditionalWrapper condition={!!portal} wrapper={(children) => <SelectPrimitive.Portal>{children}</SelectPrimitive.Portal>}>
          <Transition {...scaleOpacityAnimation} show={open} unmount={false} as={React.Fragment}>
            <SelectPrimitive.Content sideOffset={6} position="popper" className={cn('min-w-[var(--radix-select-trigger-width)]', portal ? 'z-20' : 'z-10')}>
              <div className={cn('overflow-hidden rounded border border-gray-300 bg-white shadow-lg', contentClassName)}>
                {preContent}
                <ScrollContainer type="auto" maxHeight="15rem" className="">
                  <SelectPrimitive.Viewport className="py-2">
                    {options
                      ? options.map((option) => (
                          <SelectItem key={option.value} value={option.value} className={cn('flex items-center gap-2', contentItemClassName)}>
                            {option.label}
                          </SelectItem>
                        ))
                      : children}
                  </SelectPrimitive.Viewport>
                </ScrollContainer>
                {postContent}
              </div>
            </SelectPrimitive.Content>
          </Transition>
        </ConditionalWrapper>
      </SelectPrimitive.Root>
    );
  },
);
SelectInput.displayName = 'SelectInput';
export const SelectItem = React.forwardRef<
  HTMLDivElement,
  { hideActiveCheck?: boolean } & SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>
>(({ hideActiveCheck, children, ...props }, forwardedRef) => {
  return (
    <SelectPrimitive.Item
      {...props}
      ref={forwardedRef}
      className={cn([s['form-select-item'], { 'flex w-full items-center': hideActiveCheck }, props.className])}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {!hideActiveCheck && (
        <SelectPrimitive.ItemIndicator className="ml-auto">
          <Check className="w-5 text-primary" weight="bold" />
        </SelectPrimitive.ItemIndicator>
      )}
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = 'SelectItem';
