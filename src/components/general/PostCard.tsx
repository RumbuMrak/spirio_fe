import { PostsType } from '@/hooks/data/usePosts';
import Routes from '@/services/routes';
import { cn, getImageUrl, guideName } from '@/services/utils';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
const PostCard: (props: PostsType & { size?: 'lg' }) => JSX.Element = ({ size, ...guide }) => {
  const { cover, title, id, guideProfile, created_at, content } = guide;
  return (
    <div className={cn('flex', size === 'lg' ? 'items-center gap-7.5' : 'gap-5')}>
      <div
        className={cn(
          'relative hidden flex-shrink-0 overflow-hidden rounded-lg bg-gradient sm:block',
          size === 'lg' ? 'aspect-video w-[45%]' : 'aspect-square w-52',
        )}
      >
        {cover && <Image src={getImageUrl(cover)} alt={title} fill className="object-cover" />}
      </div>
      <div>
        <div className="mb-3 flex items-center gap-4 text-xs">
          <span className="text-xs text-white/40">{format(created_at, 'd. MMMM y', { locale: cs })}</span>
          <div className="flex items-center gap-2 font-600">
            {guideProfile.avatar && (
              <Image
                src={getImageUrl(guideProfile.avatar)}
                width={24}
                height={24}
                alt={guideName(guideProfile)}
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
            )}
            {guideName(guideProfile)}
          </div>
        </div>
        <h5 className="mb-1.5 text-xl font-600 lg:text-3xl">{title}</h5>
        <p dangerouslySetInnerHTML={{ __html: content.substring(0, 100) + '...' }}></p>
        <Link href={{ pathname: Routes['blog-detail'], query: { slug: id } }} className="mt-5 inline-block font-avenier font-800 text-gradient">
          Zobrazit Více...
        </Link>
      </div>
    </div>
  );
};
export default PostCard;
