import Image from 'next/image';
import React from 'react';
import { cn, getImageUrl, guideName } from '@/services/utils';
import { GuideProfileType } from '@/features/user/types/user';
import useUser from '@/features/user/hooks/useUser';
import Routes from '@/services/routes';
import Link from 'next/link';
import router from 'next/router';
import { TechniquesType } from '@/hooks/data/useTechniques';
const GuideCardHorizontal: (props: GuideProfileType & { className?: string }) => JSX.Element = (props) => {
  const { className, ...guide } = props;
  const { id, avatar } = guide;
  const { user } = useUser();
  return (
    <button
      onClick={() => router.push({ pathname: Routes['discover-detail'], query: { slug: id } })}
      className={cn(
        'cursor-pointer relative flex flex-row gap-2 overflow-hidden rounded-lg bg-gradient-to-t  from-[#DF7E60] to-[#B526D6]  p-3 sm:p-3  min-h-[150px] max-h-[180px]',
        className
      )}  >
    {}
    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-white/20">
        {avatar && (
          <Image
            src={getImageUrl(avatar)}
            fill
            className="object-cover object-center"
            alt={guideName(guide)}
          />
        )}
      </div>
      {!user && (
        <Link
          href={Routes.registration}
          className="absolute bottom-2 left-2 right-2 rounded-full bg-highlight px-2 py-1 text-center text-xxs font-700 leading-normal text-primary-900 sm:text-xs"
        >
          Prvních 15 minut po registraci ZDARMA
        </Link>
      )}
    </div>
    {}
    <div className="flex grow flex-col justify-between text-left text-white">
      <div>
        <div className="text-lg font-600 sm:text-xl mb-2">{guideName(guide)}</div>
        {guide.techniques && (
          <div className="flex flex-wrap gap-1 text-xs mb-2">
            {guide.techniques.slice(0, 3).map((tech: TechniquesType, idx: number) => (
              <span key={idx} className="bg-white/20 rounded-full px-2">
                {tech.title}
              </span>
            ))}
          </div>
        )}
  {}
        {}
        <div className="mt-3">
        {}
      </div>
      </div>
    </div>
  </button>
  );
};
export default GuideCardHorizontal;
