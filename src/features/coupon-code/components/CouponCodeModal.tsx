import TextInput from '@/components/Inputs/TextInput';
import Button from '@/components/UI/button/Button';
import Modal from '@/components/UI/modal/Modal';
import { toast } from '@/components/UI/Toast';
import useUser from '@/features/user/hooks/useUser';
import useFormErrors from '@/hooks/useFormErrors';
import useModal from '@/hooks/useModal';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
const CouponCodeModal = () => {
  const { revalidateUser } = useUser();
  const { errors: formErrors, transformErrors } = useFormErrors();
  const { closeModal } = useModal();
  const schema = yup.object({
    coupon_code: yup.string().required(formErrors.required),
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
    return api
      .post('/coupons/use', serializeJsonToFormData(data))
      .then(async () => {
        await revalidateUser();
        reset({ coupon_code: '' });
        toast.success('Kód byl úspěšně použit.');
        closeModal('coupon-code');
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <Modal name="coupon-code" width="440px" showClose={true}>
      <form onSubmit={onSubmit}>
        <h3 className="mb-4 text-center text-3xl font-800">Zadejte promokód</h3>
        <TextInput
          {...register('coupon_code')}
          label="Promokód"
          placeholder="Zadejte..."
          error={errors.coupon_code?.message}
          autoComplete="new-password"
          color="dark"
        />
        <div className="mt-8 flex items-center justify-between gap-4 [&>button]:flex-1">
          <Button onClick={() => closeModal('coupon-code')} color="transparent-white">
            Zrušit
          </Button>
          <Button type="submit" color="gradient" loading={isSubmitting}>
            Použít
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default CouponCodeModal;
