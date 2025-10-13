import React, { useState, useCallback } from 'react';
import { DropzoneRootProps, DropzoneOptions, useDropzone } from 'react-dropzone';
import loadImage from 'blueimp-load-image';
import InputWrapper, { IInputWrapper } from './InputWrapper';
import useFormErrors from '@/hooks/useFormErrors';
import { toast } from '../UI/Toast';
export type FileInputType = { src?: string; id?: string; file?: File };
export interface IFileInput {
  name: string;
  onChange: (images: FileInputType[] | undefined) => void;
  children: (props: {
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    input: JSX.Element;
    removeFile: (id?: string | number) => void;
    loading: boolean;
    isDragActive: boolean;
    error?: string;
  }) => JSX.Element;
  maxFiles?: number;
  maxFileSize?: number;
  wrapperClassName?: string;
  value?: FileInputType[];
  onDelete?: (id: string) => void;
}
const FileInput = React.forwardRef<HTMLDivElement, IFileInput & DropzoneOptions & IInputWrapper>(
  ({ name, label, note, error, wrapperClassName, maxFiles, maxFileSize, onChange, children, value, onDelete, ...props }, ref) => {
    const [loading, setLoading] = useState(false);
    const { getFormError } = useFormErrors();
    function fixRotationOfFile(file: File): Promise<Blob> {
      return new Promise((resolve) => {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') return resolve(file);
        loadImage(
          file,
          (img) => {
            (img as HTMLCanvasElement).toBlob((blob) => {
              return resolve(blob!);
            }, 'image/jpeg');
          },
          { orientation: true, canvas: true },
        );
      });
    }
    const onDrop = useCallback(
      async (acceptedFiles: File[]) => {
        if (props.disabled) {
          return;
        }
        if (maxFileSize && acceptedFiles.some((file) => file.size > maxFileSize * 1000000)) {
          toast.error(getFormError('max_file_size', { size: `${maxFileSize} MB` }));
          if (maxFiles === 1) {
            return;
          }
        }
        const allFiles = [...acceptedFiles, ...(value ?? [])];
        const files = ((maxFiles ?? 0) > 1 && value ? acceptedFiles.filter((_, index) => index < maxFiles! - value.length) : acceptedFiles).filter((file) =>
          maxFileSize ? file.size < maxFileSize * 1000000 : true,
        );
        if (maxFiles && allFiles.length > maxFiles && maxFiles !== 1) {
          toast.error(getFormError('max_files_reached', { count: `${maxFiles} MB` }));
        }
        setLoading(true);
        const newFiles = await Promise.all(
          files.map(async (file) => {
            const fixedFile = await fixRotationOfFile(file);
            const newFile = new File([fixedFile], file.name, { type: file.type });
            const base64image = URL.createObjectURL(fixedFile);
            return { src: base64image as string, file: newFile };
          }),
        );
        setLoading(false);
        if (maxFiles === 1 || !props.multiple) {
          onChange(newFiles.length ? newFiles : undefined);
        } else {
          onChange(
            value?.length || newFiles.length ? [...(value || []), ...newFiles.filter((_, i) => i + 1 + (value?.length ?? 0) <= (maxFiles ?? 100))] : undefined,
          );
        }
      },
      [value, maxFiles, props.disabled, onChange],
    );
    const removeFile = (id?: string | number) => {
      if (typeof id === 'string') {
        onChange(value?.length === 1 ? undefined : value?.filter((val) => val.id !== id));
        onDelete?.(id);
      } else {
        onChange(value?.length === 1 ? undefined : value?.filter((_, i) => i !== id));
      }
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ ...props, onDrop });
    return (
      <InputWrapper ref={ref} name={name} label={label} error={error} className={wrapperClassName} note={note}>
        {children({
          getRootProps,
          input: (
            <input
              {...getInputProps()}
              aria-invalid={!!error || undefined}
              aria-describedby={error}
              aria-disabled={!!props.disabled || undefined}
              id={name}
              name={name}
              className="invisible absolute left-[-2000px]"
            />
          ),
          removeFile,
          loading,
          isDragActive,
          error,
        })}
      </InputWrapper>
    );
  },
);
FileInput.displayName = 'FileInput';
export default FileInput;
