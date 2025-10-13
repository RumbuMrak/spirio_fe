import React from 'react';
import { GetServerSideProps } from 'next';
import Routes from '@/services/routes';
import Head from 'next/head';
import { pageTitle, serializeJsonToFormData } from '@/services/utils';
import { useRouter } from 'next/router';
import useUser from '@/features/user/hooks/useUser';
import useFormErrors from '@/hooks/useFormErrors';
import api from '@/services/api';
import { toast } from '@/components/UI/Toast';
import { logout } from '@/features/user/modules/user';
import Logo from '@/components/UI/Logo';
import { CheckCircle } from '@phosphor-icons/react';
import useEffectOnce from '@/hooks/useEffectOnce';
import Spinner from '@/components/UI/spinner/Spinner';
type Props = {
  email: string;
  token: string;
};
export default function EmailVerificationPage({ token, email }: Props) {
  const router = useRouter();
  const [verified, setVerified] = React.useState(false);
  const { setUser, revalidateUser } = useUser();
  const { errors } = useFormErrors();
  const onWindowFocus = async () => {
    const user = await revalidateUser();
    if (user) {
      router.replace(Routes.homepage);
    }
  };
  const handleVerification = async () => {
    if (!token || !email) return;
    api
      .post(
        '/email_verification/verify',
        serializeJsonToFormData({
          token,
          email,
        }),
      )
      .then(async () => {
        toast.success('E-mailová adresa byla úspěšně ověřena.');
        setVerified(true);
        await revalidateUser();
        router.replace(Routes.homepage);
      })
      .catch(async (err) => {
        if (err.response.status === 409) {
          toast.error('E-mailová adresa již byla ověřena a odkaz je neplatný.');
        } else if (err.response.status === 429) {
          toast.error('Příliš mnoho pokusů o ověření e-mailové adresy.');
        } else if (err.response.status === 401) {
          toast.success('E-mailová adresa byla úspěšně ověřena.');
          router.replace(Routes.homepage);
        } else if (err.response.status === 403) {
          await logout().catch(() => {});
          setUser(null);
          handleVerification();
        } else {
          toast.error(errors.general_error);
        }
      });
  };
  useEffectOnce(() => {
    if (router.isReady && token && email) {
      handleVerification();
    }
  });
  React.useEffect(() => {}, [router.query]);
  React.useEffect(() => {
    window.addEventListener('focus', onWindowFocus);
    onWindowFocus();
    return () => {
      window.removeEventListener('focus', onWindowFocus);
    };
  }, []);
  return (
    <>
      <Head>
        <title>{pageTitle('Ověření e-mailové adresy')}</title>
      </Head>
      <div className="-mt-[var(--topbar-height)] flex h-screen flex-col items-center justify-center gap-8">
        <Logo className="h-12" />
        {verified ? <CheckCircle weight="fill" size={32} className="text-success" /> : <Spinner color="primary" className="!h-8 !w-8" />}
      </div>
    </>
  );
}
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
