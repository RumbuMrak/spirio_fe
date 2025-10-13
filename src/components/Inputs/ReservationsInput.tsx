import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { SelectInput } from './SelectInput';
import Button from '../UI/button/Button';
import { X } from '@phosphor-icons/react';
export type ReservationsType = { weekday: string; end_time: string; start_time: string };
const ReservationsInput: (props: { control: Control<any> }) => JSX.Element = ({ control }) => {
  return (
    <Controller
      name="business_hours"
      control={control}
      render={({ field }) => {
        const addNewLine = (day: string) => {
          const val: ReservationsType[] = [...(field.value ?? [])];
          field.onChange([...val, { weekday: day, start_time: '', end_time: '' }]);
        };
        const handleChange = (value: string, index: number, key: 'start_time' | 'end_time') => {
          const val: ReservationsType[] = [...(field.value ?? [])];
          val[index] = { ...val[index], [key]: value };
          if (key === 'start_time' && val[index].end_time && val[index].end_time <= value) {
            val[index].end_time = ''; // Reset invalid end_time
          }
          field.onChange(val);
        };
        const removeLine = (index: number) => {
          const val: ReservationsType[] = [...(field.value ?? [])];
          field.onChange(val.filter((_, i) => i !== index));
        };
        return (
          <div className="flex flex-col gap-12">
            {days.map(({ value, label }) => (
              <div key={value}>
                <div className="mb-4 font-500">{label}</div>
                <div className="flex flex-col items-start gap-4.5">
                  {field.value?.map((item: ReservationsType, index: number) => {
                    if (item.weekday !== value) return null;
                    const endTimeOptions = times.filter(time => time > item.start_time);
                    return (
                      <div key={index} className="flex w-[560px] max-w-full items-end gap-4">
                        <SelectInput
                          name={`reservation-${value}-${index}-from`}
                          options={times.map((time) => ({ label: time, value: time }))}
                          onChange={(e) => handleChange(e.target.value, index, 'start_time')}
                          label="Od"
                          wrapperClassName="grow"
                          defaultValue={item.start_time}
                        />
                        <SelectInput
                          name={`reservation-${value}-${index}-to`}
                          options={endTimeOptions.map((time) => ({ label: time, value: time }))}
                          onChange={(e) => handleChange(e.target.value, index, 'end_time')}
                          label="Do"
                          wrapperClassName="grow"
                          defaultValue={item.end_time}
                          disabled={!item.start_time} // Prevent selection before picking start_time
                        />
                        <Button color="gradient" className="mb-3.5 !w-auto !rounded-full !p-2" onClick={() => removeLine(index)}>
                          <X size={16} weight="bold" />
                        </Button>
                      </div>
                    );
                  })}
                  <Button color="gradient" onClick={() => addNewLine(value)}>
                    Přidat další časový slot
                  </Button>
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
};
export default ReservationsInput;
const days = [
  {
    value: 'mo',
    label: 'Pondělí',
  },
  {
    value: 'tu',
    label: 'Úterý',
  },
  {
    value: 'we',
    label: 'Středa',
  },
  {
    value: 'th',
    label: 'Čtvrtek',
  },
  {
    value: 'fr',
    label: 'Pátek',
  },
  {
    value: 'sa',
    label: 'Sobota',
  },
  {
    value: 'su',
    label: 'Neděle',
  },
] as const;
const times = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:15`, `${hour}:30`, `${hour}:45`];
}).flat();
