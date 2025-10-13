import FileInput, { FileInputType } from '@/components/Inputs/FileInput';
import MultiSelectInput from '@/components/Inputs/MultiSelectInput';
import ReservationsInput, { ReservationsType } from '@/components/Inputs/ReservationsInput';
import { SelectInput } from '@/components/Inputs/SelectInput';
import TextInput from '@/components/Inputs/TextInput';
import TextareaInput from '@/components/Inputs/TextareaInput';
import { IconAvatarCircle, IconPlayButton, IconVideoCircle } from '@/components/UI/Icons';
import { toast } from '@/components/UI/Toast';
import Button from '@/components/UI/button/Button';
import Layout from '@/components/layout/Layout';
import GuideProfileLayout from '@/components/layout/GuideProfileLayout';
import useUser from '@/features/user/hooks/useUser';
import useSpecializations from '@/hooks/data/useSpecializations';
import useTechniques from '@/hooks/data/useTechniques';
import useBreakpoint from '@/hooks/useBreakpoint';
import useFormErrors from '@/hooks/useFormErrors';
import api from '@/services/api';
import { cn, formatDateToTime, getImageUrl, serializeJsonToFormData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { File, PencilSimple, X } from '@phosphor-icons/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
const Profile = () => {
  const { user, revalidateUser } = useUser();
  const { techniques } = useTechniques();
  const { specializations } = useSpecializations();
  const { isInBreakpoint } = useBreakpoint();
  const { errors: formErrors, transformErrors } = useFormErrors();
  const schema = yup.object({
    first_name: yup.string().required(formErrors.required),
    last_name: yup.string().required(formErrors.required),
    status: yup.string().optional(),
    avatar: yup.mixed<FileInputType[]>().optional(),
    video: yup.mixed<FileInputType[]>().optional(),
    description: yup.string().optional(),
    short_description: yup.string().optional(),
    specialization_ids: yup.array().of(yup.string()).optional().nullable(),
    technique_ids: yup.array().of(yup.string()).optional().nullable(),
    business_hours: yup.mixed<ReservationsType[]>().optional(),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors, isSubmitting, defaultValues },
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
          video: data.video?.[0] ? { file: data.video?.[0].file } : null,
          business_hours: data.business_hours?.length ? data.business_hours : '',
        }),
      )
      .then(async () => {
        toast.success('Profil byl úspěšně aktualizován');
        await revalidateUser();
      })
      .catch((err) => {
        if (err.response.status === 422) {
          toast.error('Formulář obsahuje chyby, zkontrolujte prosím vyplněné údaje');
        }
        transformErrors(err, setError);
      });
  });
  React.useEffect(() => {
    reset({
      first_name: user?.guide_profile?.first_name ?? '',
      last_name: user?.guide_profile?.last_name ?? '',
      description: user?.guide_profile?.description ?? '',
      short_description: user?.guide_profile?.short_description ?? '',
      status: user?.guide_profile?.status ?? '',
      avatar: user?.guide_profile?.avatar ? [{ src: getImageUrl(user.guide_profile?.avatar), file: undefined }] : [],
      video: user?.guide_profile?.video ? [{ src: getImageUrl(user.guide_profile?.video), file: undefined }] : [],
      specialization_ids: user?.guide_profile?.specializations ? user?.guide_profile?.specializations.map((spec) => spec.id) : [],
      technique_ids: user?.guide_profile?.techniques ? user?.guide_profile?.techniques.map((spec) => spec.id) : [],
      business_hours:
        user?.guide_profile?.business_hours?.map(({ weekday, start_time, end_time }) => ({
          weekday,
          start_time: formatDateToTime(start_time),
          end_time: formatDateToTime(end_time),
        })) ?? [],
    });
  }, [JSON.stringify(user)]);
  return (
    <div className="container pb-32 xl:max-w-6xl">
      <h1 className="mb-4 text-xl font-500">Profil průvodce</h1>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <TextInput {...register('first_name')} label="Jméno" error={errors.first_name?.message} />
          <TextInput {...register('last_name')} label="Příjmení" error={errors.last_name?.message} />
          <SelectInput
            {...register('status')}
            label="Stav"
            error={errors.status?.message}
            options={[
              {
                label: 'Aktivní',
                value: 'active',
              },
              {
                label: 'Neaktivní',
                value: 'inactive',
              },
            ]}
            defaultValue={defaultValues?.status}
          />
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
                wrapperClassName="sm:col-span-2 md:col-span-2"
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
          <TextareaInput {...register('short_description')} maxLength={160} label="Uvodní popis na kartu (160 znaků)" error={errors.short_description?.message} wrapperClassName="sm:col-span-2" rows={4} />
          <div className="flex flex-col gap-4 sm:col-span-2">
            <MultiSelectInput
              {...register('specialization_ids')}
              label="Zaměření"
              error={errors.specialization_ids?.message}
              options={specializations.map((spec) => ({ label: spec.title, value: spec.id }))}
              defaultValue={defaultValues?.specialization_ids as string[]}
            />
            <MultiSelectInput
              {...register('technique_ids')}
              label="Techniky výkladu"
              error={errors.technique_ids?.message}
              options={techniques.map((tech) => ({ label: tech.title, value: tech.id }))}
              defaultValue={defaultValues?.technique_ids as string[]}
            />
          </div>
        </div>
        <div className="mt-16">
          <h2 className="mb-7.5 text-xl font-500">Revervační systém</h2>
          <ReservationsInput control={control} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-primary-750 py-2 sm:py-4">
          <div className="container flex justify-end xl:max-w-6xl">
            <Button type="submit" color="gradient" size={isInBreakpoint({ to: 'sm' }) ? 'sm' : 'default'} className="sm:!px-24" loading={isSubmitting}>
              Uložit změny
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Profile;
Profile.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <GuideProfileLayout>{page}</GuideProfileLayout>
    </Layout>
  );
};
export const ProfileVideo = (props: { src: string }) => {
  const [play, setPlay] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    if (videoRef.current) {
      if (play) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [play]);
  return (
    <div className="absolute left-0 top-0 inline-flex h-full w-full items-center justify-center">
      <video
        ref={videoRef}
        src={props.src}
        className="absolute left-0 top-0 h-full w-full object-cover"
        muted
        playsInline
        onClick={() => {
          if (play) {
            setPlay(false);
          }
        }}
      />
      {!play && (
        <button type="button" onClick={() => setPlay(true)} className="relative z-1 transition-transform hover:scale-105">
          <IconPlayButton className="w-24" />
        </button>
      )}
    </div>
  );
};
export async function getServerSideProps() {
  return { props: {} };
}
