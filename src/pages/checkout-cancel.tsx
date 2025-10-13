import Layout from '@/components/layout/Layout';
import Button from '@/components/UI/button/Button';
import { H4 } from '@/components/UI/typography/Typography';
import Routes from '@/services/routes';
import { XCircle } from '@phosphor-icons/react';
import React from 'react';
export default function CheckoutCancel() {
  return (
    <>
      <div className="container flex min-h-[calc(100vh-var(--topbar-height))] max-w-lg flex-col items-center justify-center pb-32 pt-12">
        <XCircle size={80} className="mb-8 text-error" />
        <H4 className="mb-4">Platba selhala</H4>
        <p className="text-center text-sm">
        Oops! <strong>Něco se nepovedlo</strong>
        </p>
        <Button href={Routes.discover} className="mt-8" color="gradient">
          Pokračovat do aplikace
        </Button>
      </div>
    </>
  );
}
CheckoutCancel.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout hideFooter>{page}</Layout>;
};
export async function getServerSideProps() {
  return {};
}
