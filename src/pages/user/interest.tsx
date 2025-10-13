import { toast } from '@/components/UI/Toast';
import Button from '@/components/UI/button/Button';
import { H2 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import UserProfileLayout from '@/components/layout/UserProfileLayout';
import useUser from '@/features/user/hooks/useUser';
import useSpecializations from '@/hooks/data/useSpecializations';
import useBreakpoint from '@/hooks/useBreakpoint';
import useFormErrors from '@/hooks/useFormErrors';
import api from '@/services/api';
import { cn, serializeJsonToFormData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Check } from '@phosphor-icons/react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
const Interest = () => {
  const { isInBreakpoint } = useBreakpoint();
  const { transformErrors } = useFormErrors();
  const { user, revalidateUser } = useUser();
  const { specializations } = useSpecializations();
  const schema = yup.object({
    specialization_ids: yup.array().of(yup.string()).optional().nullable(),
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
        toast.success('Zájem byl úspěšně aktualizován');
        await revalidateUser();
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  React.useEffect(() => {
    reset({
      specialization_ids: user?.specializations ? user?.specializations.map((spec) => spec.id) : [],
    });
  }, [JSON.stringify(user), JSON.stringify(specializations)]);
  return (
    <div>
      <H2 tag="h1" className="mb-7.5">
        O jaké témy máte
        <br /> dnes zájem?
      </H2>
      <form onSubmit={onSubmit} className="max-w-xl">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col divide-y divide-white/10">
            <Controller
              control={control}
              name="specialization_ids"
              render={({ field }) => (
                <>
                  {specializations?.map((spec) => {
                    const active = field.value?.includes(spec.id);
                    return (
                      <button
                        key={spec.id}
                        type="button"
                        onClick={() => {
                          if (active) {
                            field.onChange(field.value?.filter((id) => id !== spec.id));
                          } else {
                            field.onChange([...(field.value || []), spec.id]);
                          }
                        }}
                        className="flex items-center justify-between gap-4 bg-primary-700 p-4 font-500"
                      >
                        {spec.title}
                        <span
                          className={cn('flex h-6 w-6 items-center justify-center rounded-full border', {
                            'border-transparent bg-gradient-primary': active,
                            'border-white/10': !active,
                          })}
                        >
                          {active && <Check size={12} weight="bold" />}
                        </span>
                      </button>
                    );
                  })}
                </>
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
export default Interest;
Interest.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
