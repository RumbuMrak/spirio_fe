import { H2 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import UserProfileLayout from '@/components/layout/UserProfileLayout';
import React from 'react';
const Publisher = () => {
  return (
    <div>
      <H2 tag="h1" className="mb-7.5">
        Vydavatel aplikace
      </H2>
      <div className="flex max-w-xl flex-col gap-2.5">
        {[
          { label: 'Verze', value: '1.2.0', href: '' },
          { label: 'Vydavatel', value: 'SpirioTech s.r.o.', href: '' },
          { label: 'Email', value: 'info@spirio.cz', href: 'mailto:info@spirio.cz' },
          { label: 'Facebook', value: 'Odkaz', href: 'https://facebook.com' },
          { label: 'Instagram', value: 'Odkaz', href: 'https://instagram.com' },
          { label: 'Web', value: 'www.spirio.cz', href: 'https://www.spirio.cz' },
          { label: 'Podmínky služby', value: 'Zobrazit', href: '/docs/term-and-conditions-cs.pdf' },
          { label: 'Zásady ochrany osobních údajů', value: 'Zobrazit', href: '/docs/privacy-policy-cs.pdf' },
        ].map(({ label, value, href }, index) => (
          <div key={label} className="flex items-center justify-between gap-4 rounded bg-primary-700 p-4 text-sm">
            <span className="font-500">{label}</span>
            {href ? (
              <a href={href} target="_blank" className="text-[#9579B8] hover:underline">
                {value || 'Zobrazit'}
              </a>
            ) : (
              <span className="text-[#9579B8]">{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Publisher;
Publisher.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
export async function getServerSideProps() {
  return {};
}
