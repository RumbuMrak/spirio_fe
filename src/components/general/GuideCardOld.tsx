import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import GuideStatusBadge from './GuideStatusBadge';
import Routes from '@/services/routes';
import { IconPhoneButton } from '../UI/Icons';
import { cn, createCallLink, getImageUrl, guideName } from '@/services/utils';
import { GuideProfileType } from '@/features/user/types/user';
import useUser from '@/features/user/hooks/useUser';
const GuideCardOld: (props: GuideProfileType & { hidePhoneButton?: boolean; className?: string }) => JSX.Element = (props) => {
  const { hidePhoneButton, className, ...guide } = props;
  const { id, avatar, call_status } = guide;
  const { user } = useUser();
  return (
    <Link
      href={{ pathname: Routes['discover-detail'], query: { slug: id } }}
      className={cn('relative flex aspect-[0.73] flex-shrink-0 flex-col overflow-hidden rounded-lg bg-gradient', className)}
    >
      {avatar && <Image src={getImageUrl(avatar)} fill className="absolute left-0 top-0 h-full w-full object-cover object-center" alt={guideName(guide)} />}
      <span className="absolute bottom-0 left-0 h-3/5 w-full bg-gradient-to-t from-primary-900/80 to-primary-900/0" />
      <GuideStatusBadge state={call_status} className="absolute right-2.5 top-2.5" />
      <div className="relative mt-auto flex items-end justify-between gap-2 px-5 py-6">
        <div className="text-lg font-700">{guideName(guide)}</div>
        {!hidePhoneButton && (user?.role === 'customer' || user?.role === 'host') && (
          <Link href={{ pathname: Routes.call, query: { id: createCallLink(user.id, id) } }} className="transition-transform hover:scale-105">
            <IconPhoneButton className="w-10 shrink-0 transition-transform hover:scale-105 md:w-15" />
          </Link>
        )}
      </div>
    </Link>
  );
};
export default GuideCardOld;
