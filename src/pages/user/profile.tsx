import FileInput, { FileInputType } from '@/components/Inputs/FileInput';
import TextInput from '@/components/Inputs/TextInput';
import { toast } from '@/components/UI/Toast';
import Button from '@/components/UI/button/Button';
import { H2 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import UserProfileLayout from '@/components/layout/UserProfileLayout';
import useUser from '@/features/user/hooks/useUser';
import useBreakpoint from '@/hooks/useBreakpoint';
import useFormErrors from '@/hooks/useFormErrors';
import api from '@/services/api';
import { cn, getImageUrl, serializeJsonToFormData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { CaretRight } from '@phosphor-icons/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
const Profile = () => {
  const { isInBreakpoint } = useBreakpoint();
  const { errors: formErrors, transformErrors } = useFormErrors();
  const { user, revalidateUser } = useUser();
  const schema = yup.object({
    nickname: yup.string().required(formErrors.required),
    avatar: yup.mixed<FileInputType[]>().optional(),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    return api
      .post(
        '/me/update',
        serializeJsonToFormData({
          ...data,
          avatar: data.avatar?.[0] ? { file: data.avatar?.[0].file } : null,
        }),
      )
      .then(async () => {
        toast.success('Profil byl úspěšně aktualizován');
        await revalidateUser();
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  React.useEffect(() => {
    reset({
      nickname: user?.nickname ?? '',
      avatar: user?.avatar ? [{ src: getImageUrl(user?.avatar), file: undefined }] : [],
    });
  }, [JSON.stringify(user)]);
  return (
    <div>
      <H2 tag="h1" className="mb-7.5">
        Úprava profilu
      </H2>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-12">
          <div className="flex max-w-sm flex-col gap-4 ">
            <Controller
              control={control}
              name="avatar"
              render={({ field }) => (
                <FileInput
                  {...field}
                  onChange={(image) => field.onChange(image!)}
                  accept={{
                    'image/*': ['.jpeg', '.png', '.gif'],
                  }}
                  error={errors.avatar?.message}
                  multiple={false}
                  maxFiles={1}
                >
                  {({ getRootProps, input, isDragActive, error, removeFile }) => {
                    return (
                      <>
                        {!!field?.value?.length && (
                          <div className="mb-6 h-28">
                            <img src={field?.value[0].src} alt="Preview" className="h-28 w-28 rounded-full object-cover object-center" />
                          </div>
                        )}
                        <div
                          {...getRootProps()}
                          className={cn(
                            'relative flex cursor-pointer items-center justify-between gap-4 rounded border border-transparent bg-primary-700 p-4 text-sm font-500 hover:border-primary',
                            {
                              '!border-primary': isDragActive,
                              '!border-error !bg-error-800': !!error,
                            },
                          )}
                        >
                          {!!field?.value?.length ? 'Upravit profilovou fotku' : 'Přidat profilovou fotku'}
                          <CaretRight size={20} weight="bold" className="text-white/20" />
                          {input}
                        </div>
                      </>
                    );
                  }}
                </FileInput>
              )}
            />
            <TextInput {...register('nickname')} label="Jméno" error={errors.nickname?.message} color="dark" autoComplete="new-password" />
          </div>
          <Button type="submit" color="gradient" size={isInBreakpoint({ to: 'sm' }) ? 'sm' : 'default'} className="max-w-xl sm:!px-24" loading={isSubmitting}>
            Uložit změny
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Profile;
Profile.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
