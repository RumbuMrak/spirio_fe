import TextareaInput from '@/components/Inputs/TextareaInput';
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
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
const Feedback = () => {
  const { user } = useUser();
  const { isInBreakpoint } = useBreakpoint();
  const { errors: formErrors, transformErrors } = useFormErrors();
  const schema = yup.object({
    message: yup.string().required(formErrors.required),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    handleSubmit,
    reset,
    setError,
    register,
    formState: { isSubmitting, errors },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit(async (data) => {
    return api
      .post('/feedbacks/send', serializeJsonToFormData({ ...data, email: user?.email }))
      .then(async () => {
        toast.success('Zpráva byla odeslána');
        reset();
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <div>
      <H2 tag="h1" className="mb-7.5">
        Napiš nám
      </H2>
      <form onSubmit={onSubmit} className="max-w-xl">
        <div className="flex flex-col gap-12">
          <TextareaInput {...register('message')} color="dark" rows={10} placeholder="Zpráva..." error={errors.message?.message} />
          <Button type="submit" color="gradient" size={isInBreakpoint({ to: 'sm' }) ? 'sm' : 'default'} className="sm:!px-24" loading={isSubmitting}>
            Odeslat
          </Button>
        </div>
      </form>
    </div>
  );
};
export default Feedback;
Feedback.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
