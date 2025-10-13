import TextInput from '@/components/Inputs/TextInput';
import { toast } from '@/components/UI/Toast';
import Button from '@/components/UI/button/Button';
import { H2 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import UserProfileLayout from '@/components/layout/UserProfileLayout';
import useUser from '@/features/user/hooks/useUser';
import useFormErrors from '@/hooks/useFormErrors';
import illustrations from '@/images/illustrations';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Envelope, FacebookLogo, InstagramLogo, Link, WhatsappLogo } from '@phosphor-icons/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
const Invitation = () => {
  const { user } = useUser();
  const { IllustrationCoins } = illustrations;
  const referralLink = user?.referral_code ?? '';
  const copyRefferalCode = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Odkaz byl zkopírován do schránky');
  };
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="text-center">
        <H2 tag="h1" className="mb-7.5">
          Pozvi přátele
        </H2>
        <div>
          <h3 className="mb-5">Pošli pozvání pomocí</h3>
          <div className="mx-auto flex max-w-72 grid-cols-3 flex-wrap justify-center gap-5.5">
            {[
              { icon: Envelope, text: 'E-mail', link: '#' },
              { icon: WhatsappLogo, text: 'Whatsapp', link: '#' },
              { icon: InstagramLogo, text: 'Instagram', link: '#' },
              { icon: FacebookLogo, text: 'Messanger', link: '#' },
              { icon: Link, text: 'Link', link: '#' },
            ].map(({ icon: Icon, text, link }, index) => (
              <div key={index} className="flex w-18 shrink-0 flex-col items-center justify-center gap-1.5 text-xs font-600">
                <a href={link} target="_blank" className="inline-flex h-18 w-18 items-center justify-center rounded-full bg-gradient-primary">
                  <Icon size={36} />
                </a>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex flex-col gap-6">
          <IllustrationCoins className="mx-auto mb-4 w-1/2 max-w-[400px]" />
          <div>
            <h4 className="mb-4 text-xl !font-400">Pozvi své přátele na SPIRIO a získej odměnu!</h4>
            <p className="mt-2 max-w-2xl text-white/50">
              Sdílej svůj unikátní odkaz a poděl se o kouzlo SPIRIA. Když tví přátelé při registraci použijí tvůj odkaz a zakoupí časový balíček
              jakékoliv hodnoty, získáte oba 5 minut zdarma jako dárek.
            </p>
          </div>
          <TextInput
            name="referral-link"
            label="Tvůj odkaz na doporučení"
            value={referralLink}
            readOnly
            color="dark"
            onClick={(e) => {
              e.currentTarget.select();
              copyRefferalCode();
            }}
            className="max-w-2xl"
          />
          <Button onClick={() => copyRefferalCode()} color="gradient" className="mt-6 max-w-[400px]">
            Zkopírovat kód
          </Button>
        </div>
        {!user?.has_referral && (
          <div className="mt-12">
            <SubmitReferralCode />
          </div>
        )}
      </div>
    </div>
  );
};
export default Invitation;
const SubmitReferralCode = () => {
  const { revalidateUser } = useUser();
  const { errors: formErrors, transformErrors } = useFormErrors();
  const schema = yup.object({
    referral_code: yup.string().required(formErrors.required),
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
    return api
      .post('/referrals/attach', serializeJsonToFormData(data))
      .then(async () => {
        await revalidateUser();
        toast.success('Odkaz za doporučení byl úspěšně přidán.');
      })
      .catch((err) => {
        transformErrors(err, setError);
      });
  });
  return (
    <div className="pb-12">
      <h4 className="mb-4 text-xl !font-400">Někdo Tě pozval?</h4>
      <form onSubmit={onSubmit}>
        <TextInput {...register('referral_code')} label="Referral kód" color="dark" error={errors.referral_code?.message} autoComplete="new-password" />
        <Button type="submit" color="gradient" loading={isSubmitting} className="mt-6 w-full max-w-[400px]">
          Odeslat
        </Button>
      </form>
    </div>
  );
};
Invitation.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
