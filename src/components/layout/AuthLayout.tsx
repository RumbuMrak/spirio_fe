import React from 'react';
import { H4 } from '../UI/typography/Typography';
import { cn, pageTitle } from '@/services/utils';
import useBreakpoint from '@/hooks/useBreakpoint';
import Head from 'next/head';
import WomanMobile from '@/images/zenamobil.png';
import Image from 'next/image';
const AuthLayout: (props: React.PropsWithChildren) => JSX.Element = ({ children }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const { isInBreakpoint } = useBreakpoint();
  return (
    <>
      <Head>
        <title>{pageTitle()}</title>
      </Head>
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:py-8 xl:max-w-7xl">
        {isInBreakpoint({ from: 'lg' }) && (
          <div>
            <div className="flex flex-col items-center justify-center gap-20">
              {}
                 <Image src={WomanMobile} alt="Zakoupit čas"  
                       width={400} height={400} className="hidden sm:block mx-auto h-60 max-w-[200px] mt-24 object-cover sm:h-auto sm:max-w-none" />
              <div>
                <H4 className="relative px-8 text-center !font-500 italic [&>span]:pointer-events-none [&>span]:absolute [&>span]:text-[80px] [&>span]:text-primary-625">
                  <span className="-top-12 left-0">“</span> Poznejte perspektivu a budoucnost vašeho života <span className="-bottom-20 right-3">“</span>
                </H4>
              </div>
            </div>
            <div className="mt-16 flex items-center justify-center gap-1.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn('h-2.5 w-2.5 shrink-0 rounded-full transition-colors', index === activeIndex ? 'bg-white' : 'bg-white/30')}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex min-h-[calc(100vh-var(--topbar-height)-7.5rem)] flex-col rounded-xl py-10 sm:py-15 lg:px-18 lg:bg-gradient">{children}</div>
      </div>
    </>
  );
};
export default AuthLayout;
