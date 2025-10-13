import Layout from '@/components/layout/Layout';
import PageTitle from '@/components/layout/PageTitle';
import React from 'react';
import Routes from '@/services/routes';
import Button from '@/components/UI/button/Button';
import { cn } from '@/services/utils';
import useSigns from '@/hooks/data/useSigns';
import { GetServerSideProps } from 'next';
import useHoroscopes, { HoroscopesType, getHoroscopes } from '@/hooks/data/useHoroscopes';
export default function HoroscopeDetail({ slug, type, data }: { slug: HoroscopesType['sign']; type: HoroscopesType['type']; data: HoroscopesType[] }) {
  const { horoscopes } = useHoroscopes(type, slug, [data]);
  const horoscope = horoscopes[0];
  const signs = useSigns();
  const SignIcon = signs[slug as HoroscopesType['sign']]?.icon;
  return (
    <>
      <section className="pb-12 sm:pb-24">
        <PageTitle
          breadcrumbs={[{ title: 'Přehled', url: Routes.discover }, { title: `Horoskop ${slug && signs[slug as HoroscopesType['sign']]?.title}` }]}
          className="[&>h1]:max-w-xs"
        >
          Horoskop {slug && signs[slug as HoroscopesType['sign']]?.title}
        </PageTitle>
        <div className="mt-8 flex items-center gap-12 overflow-auto px-5 sm:gap-16 lg:justify-center">
          {[
            { value: 'today', title: 'Dnes' },
            { value: 'tomorrow', title: 'Zítra' },
            { value: 'weekly', title: 'Týdenní' },
            { value: 'monthly', title: 'Měsíční' },
            { value: 'yearly', title: 'Roční' },
          ].map(({ value, title }) => {
            const active = type === value;
            return (
              <Button
                key={value}
                href={{ pathname: Routes['horoscope-detail'], query: { slug, type: value } }}
                className={cn(active ? '!px-16 sm:!px-18' : '!px-0')}
                color={active ? 'gradient' : 'transparent'}
                scroll={false}
              >
                {title}
              </Button>
            );
          })}
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col items-center gap-x-24 gap-y-9 px-6 py-12 bg-gradient sm:flex-row sm:rounded-xl sm:p-12 lg:p-24">
          <SignIcon className="h-24 flex-shrink-0 md:h-32" />
          <p className="whitespace-pre-wrap sm:text-lg">{horoscope?.content}</p>
        </div>
      </section>
      {}
    </>
  );
}
HoroscopeDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const cookies = req.cookies;
  const slug = query.slug as HoroscopesType['sign'];
  const type = (query.type as HoroscopesType['type']) ?? 'today';
  if (!cookies['user-id']) {
    return {
      redirect: {
        destination: Routes.registration,
        permanent: false,
      },
    };
  }
  const data = await getHoroscopes({ params: { sign: slug, type } });
  if (data?.data?.length === 0) {
    return {
      notFound: true,
    };
  }
  return {
    props: { slug, type, data },
  };
};
