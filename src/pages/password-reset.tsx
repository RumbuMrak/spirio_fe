import Layout from '@/components/layout/Layout';
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import { H3 } from '@/components/UI/typography/Typography';
import useFormErrors from '@/hooks/useFormErrors';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/UI/Toast';
import * as yup from 'yup';
import Button from '@/components/UI/button/Button';
import PasswordInput from '@/components/Inputs/PasswordInput';
import { logout } from '@/features/user/modules/user';
import api from '@/services/api';
import Routes from '@/services/routes';
import { serializeJsonToFormData } from '@/services/utils';
import { GetServerSideProps } from 'next';
import router from 'next/router';
import useUser from '@/features/user/hooks/useUser';
export default function PasswordReset({ token, email }: { token: string; email: string }) {
  const { errors: formErrors, transformErrors } = useFormErrors();
  const { revalidateUser } = useUser();
  const schema = yup.object({
    password: yup.string().required(formErrors.required),
    password_confirmation: yup
      .string()
      .nullable()
      .oneOf([yup.ref('password'), null], formErrors.password_match)
      .required(formErrors.required),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    await logout().catch(() => {});
    return api
      .post(
        '/password/reset',
        serializeJsonToFormData({
          password: data.password,
          email,
          token,
        }),
      )
      .then(async () => {
        await revalidateUser();
        toast.success('Heslo bylo úspěšně změněno');
        router.replace(Routes.homepage);
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <>
      <div className="flex h-full grow flex-col">
        <H3 tag="h1">Zapomenuté heslo</H3>
        <p className="mt-2.5">Stačí vyplnit Váš e-mail a my ti odešleme odkaz pro vytvoření nového hesla.</p>
        <form onSubmit={onSubmit} className="mt-12 flex grow flex-col justify-center gap-3">
          <PasswordInput {...register('password')} label="Nové heslo" error={errors.password?.message} autoComplete="new-password" />
          <PasswordInput
            {...register('password_confirmation')}
            label="Nové heslo znovu"
            error={errors.password_confirmation?.message}
            autoComplete="new-password"
          />
          <Button type="submit" color="gradient" className="mt-7.5 w-full" loading={isSubmitting}>
            Uložit heslo
          </Button>
        </form>
      </div>
    </>
  );
}
PasswordReset.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <AuthLayout>{page}</AuthLayout>
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const token = query.token;
  const email = query.email;
  if (token && email) {
    return {
      props: { token, email },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: Routes.homepage,
      },
    };
  }
};
