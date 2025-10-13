import PasswordInput from '@/components/Inputs/PasswordInput';
import { toast } from '@/components/UI/Toast';
import Button from '@/components/UI/button/Button';
import { H2 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import UserProfileLayout from '@/components/layout/UserProfileLayout';
import useBreakpoint from '@/hooks/useBreakpoint';
import useFormErrors from '@/hooks/useFormErrors';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
const ChangePassword = () => {
  const { isInBreakpoint } = useBreakpoint();
  const { errors: formErrors, transformErrors } = useFormErrors();
  const schema = yup.object({
    password: yup.string().required(formErrors.required),
    new_password: yup.string().required(formErrors.required),
    new_password_confirmation: yup
      .string()
      .nullable()
      .oneOf([yup.ref('new_password'), null], formErrors.password_match)
      .required(formErrors.required),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    const { new_password_confirmation, ...values } = data;
    return api
      .post('/password/update', serializeJsonToFormData(values))
      .then(async () => {
        reset();
        toast.success('Změna hesla proběhla úspěšně.');
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <div>
      <H2 tag="h1" className="mb-7.5">
        Změna hesla
      </H2>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-12">
          <div className="flex max-w-sm flex-col gap-4 ">
            <PasswordInput {...register('password')} label="Staré heslo" error={errors.password?.message} color="dark" autoComplete="new-password" />
            <PasswordInput {...register('new_password')} label="Nové heslo" error={errors.new_password?.message} color="dark" autoComplete="new-password" />
            <PasswordInput
              {...register('new_password_confirmation')}
              label="Nové heslo znovu"
              error={errors.new_password_confirmation?.message}
              color="dark"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" color="gradient" size={isInBreakpoint({ to: 'sm' }) ? 'sm' : 'default'} className="max-w-xl sm:!px-24" loading={isSubmitting}>
            Uložit změny
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ChangePassword;
ChangePassword.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
