import HowItWorksModule from '@/components/general/HowItWorksModule';
import Layout from '@/components/layout/Layout';
import PageTitle from '@/components/layout/PageTitle';
import React from 'react';
export default function HowItWorks() {
  return (
    <section className="pb-32 sm:pb-56">
      <PageTitle breadcrumbs={[{ title: 'Jak to funguje' }]} className="!max-w-screen-xl">
        Jak to funguje
      </PageTitle>
      <div className="container !max-w-screen-lg">
         <p className="mx-auto mt-7.5 max-w-4xl text-center sm:text-xl whitespace-break-spaces">
          Vítej na SPIRIO.
          </p>
        <p className="mx-auto mt-7.5 max-w-4xl text-center sm:text-xl whitespace-break-spaces">
          Místě, kde najdeš zklidnění, porozumění a zkušené průvodce, kteří jsou tu pro tebe.
          Ať už tě trápí vztahy, životní rozhodnutí nebo touha se víc napojit na sebe, na SPIRIO najdeš podporu a vedení, které ti může pomoci zorientovat se a vydat se dál s větší lehkostí.
        </p>
          <HowItWorksModule></HowItWorksModule>
        {}
      </div>
    </section>
  );
}
HowItWorks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export async function getServerSideProps() {
  return { props: {} };
}
