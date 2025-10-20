import Image from 'next/image';
import React from 'react';
import { cn, getImageUrl, guideName } from '@/services/utils';
import { GuideProfileType } from '@/features/user/types/user';
import Button from '../UI/button/Button';
import { route } from '@/services/routes';
import Link from 'next/link';
import router from 'next/router';
import { Calendar, Chat, PhoneCall, VideoCamera } from '@phosphor-icons/react';
import useBreakpoint from '@/hooks/useBreakpoint';
import RatingBox from './RatingRank';

type GuideCardProps = GuideProfileType & { className?: string; hide_description?: boolean };

type GuideCardHeaderProps = { guide: GuideProfileType; guideSlug: string; isOnline: boolean };

type GuideCardBodyProps = { guide: GuideProfileType; guideSlug: string; hide_description?: boolean };

type GuideCardActionsProps = {
  guide: GuideProfileType;
  guideSlug: string;
  isChatEnabled: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isSmallScreen: boolean;
  isOnline: boolean;
};

const GuideCard: (props: GuideCardProps) => JSX.Element = (props) => {
  const { className, hide_description, ...guide } = props;
  const { id, slug } = guide;
  const guideSlug = slug || id.toString();
  const { isInBreakpoint } = useBreakpoint();
  const isSmallScreen = !isInBreakpoint({ from: 'sm' });
  const isOnline =
    guide.call_status === 'online' ||
    guide.call_status === 'chat-online' ||
    guide.call_status === 'audio-online' ||
    guide.call_status === 'chat-audio-online' ||
    guide.call_status === 'chat-video-online' ||
    guide.call_status === 'all-online';
  const status = guide.call_status;
  const isVideoEnabled = status === 'online' || status === 'chat-video-online' || status === 'all-online';
  const isAudioEnabled = status === 'online' || status === 'audio-online' || status === 'chat-audio-online' || status === 'all-online';
  const isChatEnabled = status === 'chat-online' || status === 'chat-audio-online' || status === 'chat-video-online' || status === 'all-online';

  return (
    <div
      role={!hide_description ? 'button' : undefined}
      tabIndex={!hide_description ? 0 : undefined}
      aria-label={!hide_description ? `Zobrazit detail průvodce ${guideName(guide)}` : undefined}
      onClick={() => {
        if (!hide_description) {
          router.push(route.discoverDetail(guideSlug));
        }
      }}
      onKeyDown={(e) => {
        if (!hide_description && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          router.push(route.discoverDetail(guideSlug));
        }
      }}
      className={cn(
        'border-accent/60 hover:border-accent group relative flex h-full w-full flex-shrink-0 cursor-pointer auto-rows-fr flex-col gap-3.5 overflow-hidden rounded-lg border-2 bg-card-background/80 p-0 text-card-foreground hover:bg-card-background/100 sm:p-0',
        isOnline && 'border-success-600 hover:border-success-600',
        className,
      )}
    >
      <GuideCardHeader guide={guide} guideSlug={guideSlug} isOnline={isOnline} />

      <div className="flex grow flex-col">
        <GuideCardBody guide={guide} guideSlug={guideSlug} hide_description={hide_description} />
        <GuideCardActions
          guide={guide}
          guideSlug={guideSlug}
          isOnline={isOnline}
          isChatEnabled={isChatEnabled}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          isSmallScreen={isSmallScreen}
        />
      </div>
    </div>
  );
};

const GuideCardHeader: React.FC<GuideCardHeaderProps> = ({ guide, guideSlug, isOnline }) => {
  const { avatar } = guide;
  return (
    <div className="relative flex w-full justify-center border-b border-white/10">
      <div className="relative aspect-square min-h-[96px] w-full rounded-t-md ">
        <Image
          src={avatar ? getImageUrl(avatar) : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='}
          fill
          className="object-cover object-center lg:opacity-90 lg:saturate-[90%] lg:group-hover:opacity-100 lg:group-hover:saturate-[100%]"
          alt={guideName(guide)}
        />
        <div className="absolute -bottom-3.5 left-1/2 z-20 -translate-x-1/2">
          <Link
            href={route.discoverDetail(guideSlug)}
            className={cn(
              'flex w-fit items-center gap-2 rounded-full border border-white/10 px-5 py-1.5 leading-none',
              isOnline && 'bg-success-100 text-success-700',
              guide.call_status === 'busy' && 'bg-warning-100 text-warning-600',
              guide.call_status === 'offline' && 'hidden',
            )}
          >
            <div
              className={cn('size-2.5 rounded-full', isOnline && 'pulsing-status-online -ml-1 bg-success-600', guide.call_status === 'busy' && 'hidden')}
            ></div>

            <div className="text-sm font-600 uppercase tracking-wider">
              {isOnline ? 'Online' : guide.call_status === 'busy' ? 'Obsazeno' : 'Rezervuj termín'}
            </div>
          </Link>
        </div>
        <div className="absolute right-2 top-2">
          <RatingBox rating={guide.rating ?? 4.6} />
        </div>
      </div>
    </div>
  );
};

const GuideCardBody: React.FC<GuideCardBodyProps> = ({ guide, guideSlug, hide_description }) => {
  return (
    <div className="flex grow flex-col px-4 pb-4">
      <div className="mt-3 text-center text-lg font-600 [text-shadow:2px_2px_4px_rgba(0,0,0,0.6)]  sm:text-xl">{guideName(guide)}</div>
      {guide.techniques && (
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-center">
          {guide.techniques
            .filter((tech) => tech.title.length <= 18)
            .slice(0, 3)
            .map((tech, idx) => (
              <span key={idx} className=" rounded-full bg-white/20 px-2 py-1 text-xs leading-none">
                {tech.title}
              </span>
            ))}
        </div>
      )}
    </div>
  );
};

const GuideCardActions: React.FC<GuideCardActionsProps> = ({ guideSlug, isChatEnabled, isAudioEnabled, isVideoEnabled, isSmallScreen, guide, isOnline }) => {
  const isBusy = guide.call_status === 'busy';
  const isOffline = guide.call_status === 'offline';
  const iconSize = isSmallScreen ? 14 : 16;

  const connectionTypes = [
    {
      icon: <Chat size={iconSize} weight="fill" className="fill-card-foreground/50" />,
      name: 'Chat',
      enabled: isChatEnabled,
    },
    {
      icon: <PhoneCall size={iconSize} weight="fill" className="fill-card-foreground/50" />,
      name: 'Audio',
      enabled: isAudioEnabled,
    },
    {
      icon: <VideoCamera weight="fill" size={iconSize} className="fill-card-foreground/50" />,
      name: 'Video',
      enabled: isVideoEnabled,
    },
  ].filter((type) => type.enabled);

  return (
    <div className="border-white/10 px-4 pb-6 pt-4">
      {isOnline ? (
        <div className="flex flex-col items-center gap-3">
          {connectionTypes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 sm:gap-x-4">
              {connectionTypes.map(({ icon, name }, idx) => (
                <div key={idx} className="flex items-center gap-1 whitespace-nowrap">
                  {icon}
                  <span className="text-[10px] font-500 leading-none text-card-foreground/70 sm:text-xs">{name}</span>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              router.push(route.discoverDetail(guideSlug));
            }}
            className="h-10 w-full sm:h-12"
            size={isSmallScreen ? 'sm' : 'default'}
            color="gradient"
          >
            <PhoneCall size={isSmallScreen ? 16 : 20} weight="fill" className="mr-1.5 flex-shrink-0 sm:mr-2" />
            <span className="text-[11px] leading-tight sm:text-sm">Zavolat</span>
          </Button>
        </div>
      ) : isBusy || isOffline ? (
        <Button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            router.push(route.discoverDetail(guideSlug));
          }}
          className="h-10 w-full text-card-foreground/70 hover:text-card-foreground sm:h-12"
          size={isSmallScreen ? 'sm' : 'default'}
          color="transparent"
        >
          <Calendar size={isSmallScreen ? 16 : 20} weight="fill" className="mr-1.5 flex-shrink-0 sm:mr-2" />
          <span className="text-[11px] leading-tight sm:text-sm">Rezervovat termín</span>
        </Button>
      ) : null}
    </div>
  );
};

export default GuideCard;
