import React from 'react';
import commingSoonBgSrc from '@/images/coming-soon-background.jpg';
import Image from 'next/image';
import Logo from '@/components/UI/Logo';
import { H2 } from '@/components/UI/typography/Typography';
import Illustrations from '@/images/illustrations';
const ComingSoon = () => {
  return (
    <>
      <Image src={commingSoonBgSrc} fill alt="Coming soon" className="opacity-50" />
      <Logo className="absolute left-6 top-12 h-10 sm:left-12 sm:h-15" />
      <Illustrations.IllustrationLogo className="absolute left-1/2 top-1/2 -z-1 w-[574px] max-w-[80%] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative -mt-[var(--topbar-height)] flex min-h-screen flex-col items-center justify-center gap-8 py-32">
        <H2 className="max-w-3xl text-center">Spiritualita a&nbsp;esoterika našly svůj domov.</H2>
        <div className="text-xl font-600 text-gradient md:text-3xl">Již brzy...</div>
      </div>
    </>
  );
};
export default ComingSoon;
