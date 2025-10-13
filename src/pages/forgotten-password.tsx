import Layout from '@/components/layout/Layout';
import React from 'react';
import AuthLayout from '@/components/layout/AuthLayout';
import { H3 } from '@/components/UI/typography/Typography';
import useFormErrors from '@/hooks/useFormErrors';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/UI/Toast';
import * as yup from 'yup';
import TextInput from '@/components/Inputs/TextInput';
import Button from '@/components/UI/button/Button';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
export default function ForgottenPassword() {
  const { errors: formErrors, transformErrors } = useFormErrors();
  const schema = yup.object({
    email: yup.string().email(formErrors.email).required(formErrors.required),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    return api
      .post('/password/forgot', serializeJsonToFormData(data))
      .then(() => {
        toast.success('Odeslání proběhlo úspěšně. Nyní zkontrolujte svůj e-mail.');
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <>
      <div className="flex h-full grow flex-col">
        <H3 tag="h1">Zapomenuté heslo</H3>
        <p className="mt-2.5">Stačí vyplnit Váš e-mail a my Vám odešleme odkaz pro vytvoření nového hesla.</p>
        <form onSubmit={onSubmit} className="mt-12 flex grow flex-col justify-center">
          <TextInput {...register('email')} label="E-mail" error={errors.email?.message} />
          <div className="mt-7.5 flex flex-col gap-2.5">
            <Button type="submit" color="gradient" className="w-full" loading={isSubmitting}>
              Odeslat
            </Button>
            {isSubmitSuccessful && (
              <Button color="transparent-white" className="w-full">
                Odeslat kód znova
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
ForgottenPassword.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <AuthLayout>{page}</AuthLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
