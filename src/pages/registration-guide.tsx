import FileInput, { FileInputType } from '@/components/Inputs/FileInput';
import MultiSelectInput from '@/components/Inputs/MultiSelectInput';
import PasswordInput from '@/components/Inputs/PasswordInput';
import TextInput from '@/components/Inputs/TextInput';
import TextareaInput from '@/components/Inputs/TextareaInput';
import { IconAvatarCircle, IconVideoCircle } from '@/components/UI/Icons';
import Button from '@/components/UI/button/Button';
import Layout from '@/components/layout/Layout';
import PageTitle from '@/components/layout/PageTitle';
import useUser from '@/features/user/hooks/useUser';
import { logout } from '@/features/user/modules/user';
import { UserType } from '@/features/user/types/user';
import useSpecializations from '@/hooks/data/useSpecializations';
import useTechniques from '@/hooks/data/useTechniques';
import useBreakpoint from '@/hooks/useBreakpoint';
import useFormErrors from '@/hooks/useFormErrors';
import api from '@/services/api';
import Routes from '@/services/routes';
import { cn, serializeJsonToFormData, transformJSONAPIData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { File, PencilSimple, X } from '@phosphor-icons/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { ProfileVideo } from './guide';
import { toast } from '@/components/UI/Toast';
const Profile = () => {
  const router = useRouter();
  const { logInUser } = useUser();
  const { techniques } = useTechniques();
  const { specializations } = useSpecializations();
  const { isInBreakpoint } = useBreakpoint();
  const { errors: formErrors, transformErrors } = useFormErrors();
  const schema = yup.object({
    email: yup.string().email(formErrors.email).required(formErrors.required),
    password: yup.string().required(formErrors.required),
    password_confirmation: yup
      .string()
      .nullable()
      .oneOf([yup.ref('password'), null], formErrors.password_match)
      .required(formErrors.required),
    first_name: yup.string().required(formErrors.required),
    last_name: yup.string().required(formErrors.required),
    status: yup.string().optional(),
    avatar: yup.mixed<FileInputType[]>().optional(),
    video: yup.mixed<FileInputType[]>().optional(),
    description: yup.string().optional(),
    specialization_ids: yup.array().of(yup.string()).optional().nullable(),
    technique_ids: yup.array().of(yup.string()).optional().nullable(),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      specialization_ids: [],
      technique_ids: [],
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    const { password_confirmation, ...values } = data;
    await logout().catch(() => {});
    return api
      .post(
        '/auth/register',
        serializeJsonToFormData({
          ...values,
          avatar: data.avatar?.[0] ? { file: data.avatar?.[0].file } : null,
          video: data.video?.[0] ? { file: data.video?.[0].file } : null,
          role: 'guide',
          locale: 'cs',
        }),
      )
      .then((res) => {
        const user = transformJSONAPIData<UserType>(res.data).data;
        logInUser(user);
        if (user.email_verified_at) {
          router.push(Routes.homepage);
          toast.success('Registrace proběhla úspěšně.');
        } else {
          router.push({ pathname: Routes['verify-email'], query: { email: values.email } });
        }
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <div className="container pb-60 xl:max-w-6xl">
      <PageTitle className="mb-12">Registrace průvodce</PageTitle>
      <h3 className="mb-4 text-xl font-500">Přihlašovací údaje</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <TextInput {...register('email')} label="E-mail" error={errors.email?.message} />
          <PasswordInput {...register('password')} label="Heslo" error={errors.password?.message} />
          <PasswordInput {...register('password_confirmation')} label="Heslo znovu" error={errors.password_confirmation?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <TextInput {...register('first_name')} label="Jméno" error={errors.first_name?.message} />
          <TextInput {...register('last_name')} label="Příjmení" error={errors.last_name?.message} />
          {}
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
                label="Avatar"
                error={errors.avatar?.message}
                multiple={false}
                maxFiles={1}
              >
                {({ getRootProps, input, isDragActive, error, removeFile }) => {
                  return (
                    <>
                      {!field?.value?.length && (
                        <div
                          {...getRootProps()}
                          className={cn(
                            'relative flex aspect-[0.8] cursor-pointer flex-col items-center justify-center gap-4 rounded border border-transparent bg-primary-750 p-4 hover:border-primary',
                            {
                              '!border-primary': isDragActive,
                              '!border-error !bg-error-800': !!error,
                            },
                          )}
                        >
                          <IconAvatarCircle className="w-15" />
                          <span className="text-xl font-500">+ Pridat avatar</span>
                          {input}
                        </div>
                      )}
                      {!!field?.value?.length && (
                        <div className={cn('relative aspect-[0.8] w-full overflow-hidden rounded', { 'border border-error': !!error })}>
                          <div className="absolute left-0 top-0 inline-flex h-full w-full items-center justify-center">
                            {field.value[0].file?.type.startsWith('image/') || !field.value[0].file ? (
                              <img src={field.value[0].src} alt={field.value[0].file?.name} className="absolute left-0 top-0 h-full w-full object-cover" />
                            ) : (
                              <File size={40} className="text-gray-200" />
                            )}
                          </div>
                          <div className="absolute right-3 top-3 z-40 flex items-center gap-2.5 ">
                            <Button color="gradient" className="!rounded-full !p-1.5">
                              <PencilSimple size={20} weight="bold" />
                            </Button>
                            <Button color="gradient" className="!rounded-full !p-1.5" onClick={() => removeFile(0)}>
                              <X size={20} weight="bold" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                }}
              </FileInput>
            )}
          />
          <Controller
            control={control}
            name="video"
            render={({ field }) => (
              <FileInput
                {...field}
                onChange={(image) => field.onChange(image!)}
                accept={{
                  'video/*': ['.mp4', '.mpeg', '.webm'],
                }}
                label="Medailon"
                error={errors.video?.message}
                multiple={false}
                maxFiles={1}
                wrapperClassName="sm:col-span-2 md:col-span-3"
              >
                {({ getRootProps, input, isDragActive, error, removeFile }) => {
                  return (
                    <>
                      {!field?.value?.length && (
                        <div
                          {...getRootProps()}
                          className={cn(
                            'relative flex aspect-[1.75] cursor-pointer flex-col items-center justify-center gap-4 rounded border border-transparent bg-primary-750 p-4 hover:border-primary',
                            {
                              '!border-primary': isDragActive,
                              '!border-error !bg-error-800': !!error,
                            },
                          )}
                        >
                          <IconVideoCircle className="w-15" />
                          <span className="text-xl font-500">+ Pridat medailon</span>
                          {input}
                        </div>
                      )}
                      {!!field?.value?.length && (
                        <div className={cn('relative aspect-[1.75] w-full overflow-hidden rounded bg-primary-750', { 'border border-error': !!error })}>
                          <ProfileVideo src={field.value[0].src ?? ''} />
                          <div className="absolute right-3 top-3 z-40 flex items-center gap-2.5 ">
                            <Button color="gradient" className="!rounded-full !p-1.5">
                              <PencilSimple size={20} weight="bold" />
                            </Button>
                            <Button color="gradient" className="!rounded-full !p-1.5" onClick={() => removeFile(0)}>
                              <X size={20} weight="bold" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  );
                }}
              </FileInput>
            )}
          />
          <TextareaInput {...register('description')} label="O průvodci" error={errors.description?.message} wrapperClassName="sm:col-span-2" rows={6} />
          <div className="flex flex-col gap-4 sm:col-span-2">
            <MultiSelectInput
              {...register('specialization_ids')}
              label="Zaměření"
              error={errors.specialization_ids?.message}
              options={specializations.map((spec) => ({ label: spec.title, value: spec.id }))}
            />
            <MultiSelectInput
              {...register('technique_ids')}
              label="Techniky výkladu"
              error={errors.technique_ids?.message}
              options={techniques.map((tech) => ({ label: tech.title, value: tech.id }))}
            />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-primary-750 py-2 sm:py-4">
          <div className="container flex justify-end xl:max-w-6xl">
            <Button type="submit" color="gradient" size={isInBreakpoint({ to: 'sm' }) ? 'sm' : 'default'} className="sm:!px-24" loading={isSubmitting}>
              Zaregistrovat se
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Profile;
Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout hideFooter>{page}</Layout>;
};
export async function getServerSideProps() {
  return {};
}
