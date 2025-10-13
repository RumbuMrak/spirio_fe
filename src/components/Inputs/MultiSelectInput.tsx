import React from 'react';
import { Transition } from '@headlessui/react';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import { scaleOpacityAnimation } from '@/services/animations';
import { cn } from '@/services/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CaretDown } from '@phosphor-icons/react';
import CheckboxInput from './CheckboxInput';
import ScrollContainer from '../UI/scroll-container/ScrollContainer';
import s from './form-input.module.css';
interface IMultiSelectInput {
  onChange: (event: { target: { value: string[]; name?: string }; type?: any }) => void;
  options: { label: string | JSX.Element; value: string }[];
  placeholder?: string;
  wrapperClassName?: string;
  defaultValue?: string[];
  size?: 'sm' | 'base';
  className?: string;
  preContent?: JSX.Element;
  postContent?: JSX.Element;
  showCommaValues?: boolean;
}
const MultiSelectInput = React.forwardRef<HTMLButtonElement, IMultiSelectInput & IInputWrapper>(
  (
    {
      options,
      onChange,
      placeholder,
      defaultValue,
      className,
      name,
      label,
      error,
      note,
      wrapperClassName,
      size = 'base',
      preContent,
      postContent,
      showCommaValues,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<string[]>([]);
    React.useEffect(() => {
      defaultValue && setSelectedValue(defaultValue);
    }, [defaultValue]);
    return (
      <InputWrapper name={name} label={label} error={error} className={wrapperClassName} note={note}>
        <DropdownMenu.Root onOpenChange={setOpen} open={open}>
          <DropdownMenu.Trigger
            ref={ref}
            className={cn(s['form-input'], s['form-select'], className, { '!p-2': selectedValue?.length && !showCommaValues })}
            aria-invalid={!!error || undefined}
            aria-describedby={error}
            data-size={size}
            data-placeholder={!selectedValue?.length}
          >
            <div className="relative flex grow flex-wrap items-center gap-1 overflow-hidden">
              {selectedValue?.length ? (
                <>
                  {showCommaValues ? (
                    <div className="truncate whitespace-nowrap text-black">
                      {options
                        .filter((val) => selectedValue.indexOf(val.value) > -1)
                        .map((value) => value.label)
                        .join(', ')}
                    </div>
                  ) : (
                    <>
                      {options
                        .filter((val) => selectedValue.indexOf(val.value) > -1)
                        .map((value) => (
                          <span key={value.value} className="rounded bg-gray-100 px-4 py-2.5 text-gray-600">
                            {value.label}
                          </span>
                        ))}
                    </>
                  )}
                </>
              ) : (
                placeholder || 'Vybrat'
              )}
            </div>
            <CaretDown className="text-gray-500 ml-auto w-3.5 shrink-0" weight="bold" />
          </DropdownMenu.Trigger>
          <div>
            <Transition {...scaleOpacityAnimation} show={open} as={React.Fragment}>
              <DropdownMenu.Content sideOffset={6} align="start" className="z-10 min-w-[var(--radix-dropdown-menu-trigger-width)]">
                <div className="overflow-hidden rounded border border-gray-300 bg-white shadow-lg">
                  {preContent}
                  <ScrollContainer type="auto" maxHeight="15rem">
                    <div className="py-2">
                      {options.map((option) => (
                        <DropdownMenu.Item
                          key={option.value}
                          onSelect={(e) => {
                            if (selectedValue.indexOf(option.value) > -1) {
                              setSelectedValue((val) => {
                                const newVal = val.filter((v) => v !== option.value);
                                onChange({ target: { value: newVal, name } });
                                return newVal;
                              });
                            } else {
                              setSelectedValue((val) => {
                                const newVal = [...val, option.value];
                                onChange({ target: { value: newVal, name } });
                                return newVal;
                              });
                            }
                            e.preventDefault();
                          }}
                          className={cn([s['form-select-item']])}
                        >
                          <CheckboxInput
                            name={`${name}-checkbox-${option.value}`}
                            checked={selectedValue.indexOf(option.value) > -1}
                            onClick={(e) => e.preventDefault()}
                          />
                          {option.label}
                        </DropdownMenu.Item>
                      ))}
                    </div>
                  </ScrollContainer>
                  {postContent}
                </div>
              </DropdownMenu.Content>
            </Transition>
          </div>
        </DropdownMenu.Root>
      </InputWrapper>
    );
  },
);
export default MultiSelectInput;
MultiSelectInput.displayName = 'MultiSelectInput';
