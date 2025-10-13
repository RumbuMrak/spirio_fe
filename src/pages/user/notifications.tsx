import SwitcherInput from '@/components/Inputs/SwitcherInput';
import { toast } from '@/components/UI/Toast';
import Button from '@/components/UI/button/Button';
import { H2 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import UserProfileLayout from '@/components/layout/UserProfileLayout';
import useUser from '@/features/user/hooks/useUser';
import useBreakpoint from '@/hooks/useBreakpoint';
import useFormErrors from '@/hooks/useFormErrors';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
const Notifications = () => {
  const { isInBreakpoint } = useBreakpoint();
  const { transformErrors } = useFormErrors();
  const { user, revalidateUser } = useUser();
  const schema = yup.object({
    push_notifications_news: yup.boolean().optional(),
    push_notifications_articles: yup.boolean().optional(),
    push_notifications_horoscope: yup.boolean().optional(),
    push_notifications_livestream: yup.boolean().optional(),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    handleSubmit,
    setError,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    return api
      .post('/me/update', serializeJsonToFormData(data))
      .then(async () => {
        toast.success('Notifikace byly úspěšně aktualizovány');
        await revalidateUser();
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  React.useEffect(() => {
    reset({
      push_notifications_news: user?.push_notifications_news,
      push_notifications_articles: user?.push_notifications_articles,
      push_notifications_horoscope: user?.push_notifications_horoscope,
      push_notifications_livestream: user?.push_notifications_livestream,
    });
  }, [JSON.stringify(user)]);
  return (
    <div>
      <H2 tag="h1" className="mb-7.5">
        Notifikace
      </H2>
      <form onSubmit={onSubmit} className="max-w-xl">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2.5">
            <Controller
              control={control}
              name="push_notifications_news"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => {
                    field.onChange(!field.value);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded bg-primary-700 p-4 text-sm"
                >
                  <span className="font-500">Novinky & Aktualizace</span>
                  <span>
                    <SwitcherInput name="news" value="1" checked={field.value} className="pointer-events-none !opacity-100" disabled />
                  </span>
                </button>
              )}
            />
            <Controller
              control={control}
              name="push_notifications_livestream"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => {
                    field.onChange(!field.value);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded bg-primary-700 p-4 text-sm"
                >
                  <span className="font-500">Live stream</span>
                  <span>
                    <SwitcherInput name="livestream" value="1" checked={field.value} className="pointer-events-none !opacity-100" disabled />
                  </span>
                </button>
              )}
            />
            <Controller
              control={control}
              name="push_notifications_articles"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => {
                    field.onChange(!field.value);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded bg-primary-700 p-4 text-sm"
                >
                  <span className="font-500">Články</span>
                  <span>
                    <SwitcherInput name="articles" value="1" checked={field.value} className="pointer-events-none !opacity-100" disabled />
                  </span>
                </button>
              )}
            />
            <Controller
              control={control}
              name="push_notifications_horoscope"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => {
                    field.onChange(!field.value);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded bg-primary-700 p-4 text-sm"
                >
                  <span className="font-500">Horoskopy</span>
                  <span>
                    <SwitcherInput name="horoscope" value="1" checked={field.value} className="pointer-events-none !opacity-100" disabled />
                  </span>
                </button>
              )}
            />
          </div>
          <Button type="submit" color="gradient" size={isInBreakpoint({ to: 'sm' }) ? 'sm' : 'default'} className="sm:!px-24" loading={isSubmitting}>
            Uložit změny
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Notifications;
Notifications.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
