import { cn, pageTitle, serializeJsonToFormData } from '@/services/utils';
import Head from 'next/head';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import api from '@/services/api';
import { toast } from '@/components/UI/Toast';
import AuthLayout from '@/components/layout/AuthLayout';
import { Envelope } from '@phosphor-icons/react';
import Button from '@/components/UI/button/Button';
import { route } from '@/services/routes';

import { Input } from '@headlessui/react';
import s from '@/components/Inputs/form-input.module.css';
export const sendVerificationEmail = async (email: string) => {
  await api
    .post('/email_verification/resend', serializeJsonToFormData({ email }))
    .then(() => {
      toast.success('Ověřovací e-mail byl odeslán.');
    })
    .catch(() => {
      toast.error('Něco se pokazilo. Zkuste to prosím znovu.');
    });
};
export default function VerifyEmail() {
  const router = useRouter();
  const { email } = router.query;
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const submitCode = async () => {
    setStatus('loading');
    try {
         router.push({
          pathname: '/email-verification',
          query: {
            guard: 'users',
            token: code,
            email: email,
            locale: 'cs',
          },
        });
    } catch (error) {
      setStatus('error');
      setMessage('Nastala chyba, zkuste to prosím znovu později.');
    }
  };
  return (
    <>
      <Head>
        <title>{pageTitle('Ověřte Vaši e-mailovou adresu')}</title>
      </Head>
      <div className="my-auto pb-16">
        <Envelope size={60} className="mb-6 text-primary-550" />
        <h1 className="text-3xl font-600">Ověřte Vaši e-mailovou adresu</h1>
        <p className="text-gray-700 mt-3">
          Už jste skoro tam! Pro dokončení registrace klikněte na odkaz, který jsme vám poslali na{' '}
          <span className="font-600">{email}</span>. <br />
          <br />
          Pokud e-mail nevidíte, zkuste zkontrolovat spam složku.
        </p>
        <div className="text-gray-700 mt-7.5 text-sm">
        <span className="block text-sm font-medium text-gray-700 mb-2">Nebo zadejte ověřovací kód:</span>
          <Input
            type="text"
            maxLength={6}
            className={cn(s['form-input'],s['form-input__label'])}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Zadejte 6-místný kód"
          />
          <Button onClick={submitCode} color="gradient" className="mt-3.5 w-full" disabled={status === 'loading'}>
            Ověřit kód
          </Button>
          {status === 'error' && <p className="text-red-500 mt-2">{message}</p>}
          {status === 'success' && <p className="text-green-600 mt-2">{message}</p>}
        </div>
        <div className="text-gray-700 mt-7.5 text-sm">
          Stále nemůžete e-mail najít?
          <button onClick={() => sendVerificationEmail(email as string)} className="ml-2 font-600 text-primary-600 hover:underline">
            Poslat znovu
          </button>
        </div>
        <div className="text-gray-700 mt-7.5 text-sm">
          <span className="font-600">Již jste svůj e-mail potvrdili? </span>
        </div>
        <br />
        <Button href={route.login()} color="primary" size="default">
          Přihlásit se
        </Button>
      </div>
    </>
  );
}
VerifyEmail.getLayout = function getLayout(page: React.ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
