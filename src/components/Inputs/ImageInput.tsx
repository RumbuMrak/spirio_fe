import React from 'react';
import { Control, Controller } from 'react-hook-form';
import FileInput, { FileInputType } from './FileInput';
import Trans from 'next-translate/Trans';
import { cn } from '@/services/utils';
import { File, X } from '@phosphor-icons/react';
import { Accept } from 'react-dropzone';
import Button from '../UI/button/Button';
const ImageInput: (props: {
  name: string;
  error?: string;
  control: Control<any>;
  label?: string;
  note?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  accept?: Accept;
}) => JSX.Element = ({ name, error, control, label, note, multiple, maxFiles, maxFileSize, accept }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FileInput
          {...field}
          onChange={(image) => field.onChange(image!)}
          accept={
            accept ?? {
              'image/*': ['.jpeg', '.png', '.gif'],
            }
          }
          label={label}
          error={error}
          maxFileSize={maxFileSize}
          multiple={!!multiple}
          maxFiles={maxFiles ?? 1}
        >
          {({ getRootProps, input, isDragActive, error, removeFile }) => {
            return (
              <>
                {!field?.value?.length && (
                  <div
                    {...getRootProps()}
                    className={cn(
                      'shadow-xs relative flex cursor-pointer items-center justify-center rounded border border-gray-300 bg-white p-4 hover:border-primary',
                      {
                        '!border-primary': isDragActive,
                        '!border-error !bg-error-100': !!error,
                      },
                    )}
                  >
                    <div className="text-center">
                      <div className="text-gray-500 mt-4 text-sm">
                        <Trans i18nKey="common.inputs.image.title" components={{ strong: <strong className="text-primary-600" /> }} />
                        {note && <div className="mt-1 text-xs">{note}</div>}
                      </div>
                    </div>
                    {input}
                  </div>
                )}
                {!!field?.value?.length && (
                  <div className="flex flex-wrap items-center gap-3">
                    {field.value.map((file: FileInputType, index: number) => (
                      <div key={index} className={cn('relative aspect-square w-24 overflow-hidden rounded', { 'border border-error': !!error })}>
                        <div className="absolute left-0 top-0 inline-flex h-full w-full items-center justify-center">
                          {file.file?.type.startsWith('image/') ? (
                            <img src={file.src} alt={file.file?.name} className="absolute left-0 top-0 h-full w-full object-cover" />
                          ) : (
                            <File size={40} className="text-gray-200" />
                          )}
                        </div>
                        {!file.file?.type.startsWith('image/') && <span className="relative z-1 text-center text-xs">{file.file?.name}</span>}
                        <Button className="absolute right-0 top-0 z-40 !rounded-full !p-1" onClick={() => removeFile(index)}>
                          <X className="w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          }}
        </FileInput>
      )}
    />
  );
};
export default ImageInput;
