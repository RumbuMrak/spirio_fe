import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFormErrors from '@/hooks/useFormErrors';
import { toast } from '../UI/Toast';
import TextInput from '../Inputs/TextInput';
import Button from '../UI/button/Button';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
const FooterContactForm = () => {
  const { errors: formErrors, transformErrors } = useFormErrors();
  const schema = yup.object({
    email: yup.string().email(formErrors.email).required(formErrors.required),
  });
  type FormType = yup.InferType<typeof schema>;
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit((data) => {
    return api
      .post('/newsletter_subscriptions/store', serializeJsonToFormData(data))
      .then(() => {
        reset();
        toast.success('Zpráva byla odeslána.');
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <form onSubmit={onSubmit} className="w-full">
      <TextInput {...register('email')} label="E-mail" placeholder="E-mail" error={errors.email?.message} />
      <Button type="submit" color="gradient" className="mt-9 w-full" loading={isSubmitting}>
        Odebírat
      </Button>
    </form>
  );
};
export default FooterContactForm;
