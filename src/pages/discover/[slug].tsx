import { H2, H4 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import PageTitle from '@/components/layout/PageTitle';
import React, { useEffect, useState } from 'react';
import Routes from '@/services/routes';
import GuideStatusBadge from '@/components/general/GuideStatusBadge';
import { IconPauseButton, IconPlayButton } from '@/components/UI/Icons';
import Button from '@/components/UI/button/Button';
import BluredCircle from '@/components/UI/shapes/BluredCircle';
import Badge from '@/components/UI/Badge';
import Illustrations from '@/images/illustrations';
import GuideCard from '@/components/general/GuideCard';
import { addDays, addMinutes, format, setHours } from 'date-fns';
import useGuides from '@/hooks/data/useGuides';
import { GetServerSideProps } from 'next';
import { GuideProfileType, UserType } from '@/features/user/types/user';
import useCalendarSlots, { CalendarSlotsType } from '@/hooks/data/useCalendarSlots';
import useUser from '@/features/user/hooks/useUser';
import { toast } from '@/components/UI/Toast';
import Modal from '@/components/UI/modal/Modal';
import useModal from '@/hooks/useModal';
import api from '@/services/api';
import { cn, createAudioCallLink, createCallLink, createChatLink, guideName, serializeJsonToFormData, transformJSONAPIData, getImageUrl } from '@/services/utils';
import { KeyedMutator } from 'swr';
import router, { useRouter } from 'next/router';
import useGuide, { getGuide } from '@/hooks/data/useGuide';
import useBookings from '@/hooks/data/useBookings';
import { cs } from 'date-fns/locale'; // Import Czech locale
import { Calendar, Chat, VideoCamera, PhoneCall, FilmSlate, ShareNetwork } from '@phosphor-icons/react';
import Subscriptions from '../user/subscriptions';
import { Input } from '@headlessui/react';
import RatingBox from '@/components/general/RatingRank';
import GuidePaidVideos from '@/features/paid-videos/components/GuidePaidVideos';
// Video component (moved above usage to avoid TS ordering issues)
const GuideVideo: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => JSX.Element | null = ({ ...props }) => {
  const [play, setPlay] = React.useState(false);
  const video = React.useRef<HTMLVideoElement>(null);
  const [volume, setVolume] = useState(0);

  React.useEffect(() => {
    if (video.current) {
      if (play) {
        video.current.play();
      } else {
        video.current.pause();
      }
    }
  }, [play]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (video.current) {
      if (newVolume > 0) video.current.muted = false;
      video.current.volume = newVolume;
    }
  };

  const toggleFullScreen = () => {
    if (video.current) {
      video.current.muted = false;
      if (video.current.requestFullscreen) {
        video.current.requestFullscreen();
      }
    }
  };

  if (!props.src) return null;

  return (
    <div className="relative flex aspect-video justify-center overflow-hidden bg-gradient sm:rounded-xl group">
      <video
        ref={video}
        {...props}
        className="h-full"
        muted
        autoPlay
        loop
        controls={false}
        playsInline
        onClick={() => {
          if (play) setPlay(false);
        }}
        onDoubleClick={toggleFullScreen}
      />
      {!play ? (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="absolute left-1/2 top-1/2 w-24 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 sm:w-32"
        >
          <IconPlayButton className="w-24" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setPlay(false)}
          className="hidden group-hover:block absolute left-1/2 top-1/2 w-24 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 sm:w-32"
        >
          <IconPauseButton className="w-24" />
        </button>
      )}

      <div className='absolute bottom-4 left-4 items-center gap-x-4 hidden group-hover:flex'>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="cursor-pointer gap-x-4w-32 hidden group-hover:block"
        />
        <button
          type="button"
          onClick={toggleFullScreen}
          className="cursor-pointer text-white bg-black bg-opacity-50 p-2 rounded-lg hidden group-hover:block"
        >
          ⛶ Celá obrazovka
        </button>
      </div>
    </div>
  );
};


const AccessOptionsModal = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { closeModal, getModalState } = useModal();
  const [email, setEmail] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { logInUser } = useUser();

  const state = getModalState('access-options') as { uuid: string; happening_at: string; title: string };
  const handleExpandrect = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (valid) {
      setExpanded(true);
      handleRegister();
    } else {
      setExpanded(false);
      toast.error('Zadejte platný e-mail.');
    }
  }

  const closeDialog = () => {
    setExpanded(false);
    setEmail('');
    closeModal('access-options');
  };

  // const handleRedirect = () => {
  //   setLoading(true);
  //   closeModal('access-options');
  //   router.push({
  //     pathname: Routes['livestream-viewer'],
  //     query: { id: state.uuid },
  //   });
  // };

  const handleRegister = () => {
    setLoading(true);
    api
      .post(
        '/auth/register',
        serializeJsonToFormData({
          email,
          role: 'host',
          locale: 'cs',
          referral_code: null,
        })
      )
      .then((res) => {
        const user = transformJSONAPIData<UserType>(res.data).data;
        logInUser(user);
      })
      .catch(() => {
        toast.error('Něco se nezdařilo');
      })
      .finally(() => setLoading(false));
  };

  if (!state) return null;


  return (
    <Modal name="access-options" width="460px" showClose={false} >
      <h2 className="mb-4 text-center text-3xl font-bold">Získej přístup</h2>
      <p className="mx-auto mb-4 max-w-sm text-center text-lg">
        Pro pokračování zadejte svůj e-mail.
      </p>

      <Input
        disabled={expanded}
        type="email"
        placeholder="např. jan.novak@email.cz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-md shadow-sm text-center text-black"
      />
      <Button disabled={expanded} color='gradient' className="w-full mb-4" onClick={handleExpandrect}>Pokračovat</Button>

      {expanded && (
        <>
          <p className="mx-auto mb-6 max-w-sm text-center text-lg">
            Pro zahájení hovoru si prosím vyber předplatné nebo se zaregistruj.
          </p>


          <Subscriptions fromModal={true} loading={loading}
            setLoading={setLoading} />
          <div className="flex items-center justify-center gap-2 my-6">
            <hr className="flex-grow border-t" />
            <span className="text-gray-400 text-sm">NEBO</span>
            <hr className="flex-grow border-t" />
          </div>
          <div className="flex items-center justify-between gap-4 [&>button]:flex-1">
            <Button onClick={closeDialog} color="transparent-white">
              Zavřít
            </Button>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow"
            >
              {loading ? 'Načítání...' : 'Registrovat se'}
            </Button>
          </div>
        </>)}
    </Modal>
  );
};

export default function DiscoverDetail({ data: initialData, slug }: { data: GuideProfileType; slug: string }) {
  const { data } = useGuide(slug, initialData);
  const { user } = useUser();
  // const { openModal } = useModal();

  const { data: calendarSlots, mutate: mutateSlots } = useCalendarSlots({
    guide_profile_id: data?.id ?? '',
    date_from: format(new Date(), 'y-MM-dd'),
    date_to: format(addDays(new Date(), 7), 'y-MM-dd'),
  });

  const { data: guides } = useGuides({ 'filter[specialization_id]': data?.specializations.map((item) => item.id), 'filter[not_id]': [data?.id ?? ''] });
  // const hoursRange = Array.from({ length: 24 }, (_, i) => i); // Hours from 6:00 to 17:00
  const daysRange = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const [selectedDate, setSelectedDate] = useState(daysRange[0]); // Default to the first available date

  // Show only days that have at least one calendar slot
  const availableDays = React.useMemo(() => {
    if (!calendarSlots || calendarSlots.length === 0) return [] as Date[];
    const slotDays = new Set(
      calendarSlots.map((s) => format(new Date(s.datetime), 'yyyy-MM-dd'))
    );
    return daysRange.filter((d) => slotDays.has(format(d, 'yyyy-MM-dd')));
  }, [calendarSlots, daysRange]);

  // Keep the selected date aligned with availability
  useEffect(() => {
    if (availableDays.length === 0) return;
    const isSelectedAvailable = availableDays.some(
      (d) => format(d, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
    if (!isSelectedAvailable) setSelectedDate(availableDays[0]);
  }, [availableDays]);

  // Get all hours that have slots
  const getHoursWithSlots = (date: Date) => {
    if (!calendarSlots) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    const hoursSet = new Set<number>();
    calendarSlots.forEach((slot) => {
      const slotDate = format(new Date(slot.datetime), 'yyyy-MM-dd');
      if (slotDate === dateStr) {
        const hour = new Date(slot.datetime).getHours();
        hoursSet.add(hour);
      }
    });
    return Array.from(hoursSet).sort((a, b) => a - b);
  };

  const handleProtectedAction = (callback: () => void, action?: 'video' | 'audio' | 'chat') => {
    if (!user) {
      try {
        localStorage.setItem('post-login-intent', JSON.stringify({ type: 'guide-action', slug, action, ts: Date.now() }));
      } catch { }
      router.push({ pathname: Routes.wizard, query: { slug } });
      //  callback();
      // openModal('access-options', {
      //   type: 'state',
      //   queries: {
      //   }
      // });
    } else {
      callback();
    }
  };

  const handleShareGuide = async () => {
    try {
      const url = `${window.location.origin}/discover/${slug}`;
      await navigator.clipboard.writeText(url);
      toast.success('Odkaz na průvodce byl zkopírován do schránky!');
    } catch (error) {
      toast.error('Nepodařilo se zkopírovat odkaz');
    }
  };


  if (!data) return null;

  return (
    <>
      <section className="pb-12 sm:pb-24">
        <PageTitle breadcrumbs={[{ title: 'Dostupní průvodci', url: Routes.discover }, { title: 'Detail průvodce' }]}>
          {/* <div className="flex flex-col-reverse items-center justify-center gap-x-4 gap-y-1 lg:flex-row lg:items-start">
            {data?.avatar && (
              <img
                src={getImageUrl(data.avatar)}
                alt={guideName(data)}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-primary-500"
              />
            )}
            <RatingBox rating={data.rating??4.6} />
            {guideName(data)} <GuideStatusBadge state={data.call_status} />
          </div> */}

        </PageTitle>

        <div className="container relative mt-10 !px-0 sm:px-6 xl:max-w-7xl">
          {/* Top layout: square portrait + action buttons */}
          <div className="grid items-start lg:grid-cols-2 ">
            <div className="flex justify-center lg:justify-end sm:mr-6 ">
              {data.avatar ? (
                <img
                  src={getImageUrl(data.avatar)}
                  alt={guideName(data)}
                  className="w-full max-w-sm lg:max-w-md aspect-square rounded-xl object-cover shadow-2xl"
                />
              ) : (
                <div className="w-full max-w-sm lg:max-w-md aspect-square rounded-xl bg-primary-725" />
              )}
            </div>

            <div className="flex flex-col items-center lg:items-start">

              <div className="mb-4 w-full text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                  <H2 className="m-0 mt-2 sm:mt-0">{guideName(data)} <RatingBox rating={data.rating ?? 4.6} /></H2>
                  <GuideStatusBadge state={data.call_status} />


                </div>
                <div className="mt-2 flex justify-center lg:justify-start">

                </div>
              </div>

              {/* {user ? (user?.role === 'customer' && (  */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                {[
                  'online',
                  'chat-online',
                  'audio-online',
                  'chat-audio-online',
                  'chat-video-online',
                  'all-online',
                ].includes(data.call_status) &&
                  (() => {
                    const status = data.call_status;

                    const isVideoEnabled =
                      status === 'online' ||
                      status === 'chat-video-online' ||
                      status === 'all-online';

                    const isAudioEnabled =
                      status === 'online' ||
                      status === 'audio-online' ||
                      status === 'chat-audio-online' ||
                      status === 'all-online';

                    const isChatEnabled =
                      status === 'chat-online' ||
                      status === 'chat-audio-online' ||
                      status === 'chat-video-online' ||
                      status === 'all-online';

                    return (
                      <>

                        <Button
                          onClick={() =>
                            isVideoEnabled &&
                            handleProtectedAction(() => router.push({ pathname: Routes.call, query: { id: createCallLink(user!.id, data.id), token: 0 } }), 'video')
                            // router.push({
                            //   pathname: Routes.call,

                            //   query: { id: createCallLink(user!.id, data.id), token: 0 },
                            // })
                          }
                          disabled={!isVideoEnabled}
                          className={cn(
                            'w-full !rounded-md sm:max-w-[165px] min-h-[140px] mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white',
                            {
                              'opacity-50 cursor-not-allowed': !isVideoEnabled,
                            }
                          )}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <VideoCamera size={45} weight="bold" className='text-[#B6DC36]' />
                            <span className="text-lg font-semibold">Video hovor</span>
                            <span className="text-sm font-100">Spoj se zde</span>
                          </div>
                        </Button>

                        <Button
                          onClick={() =>
                            isAudioEnabled &&
                            handleProtectedAction(() => router.push({ pathname: Routes.call, query: { id: createAudioCallLink(user!.id, data.id), token: 1 } }), 'audio')
                            // router.push({
                            //   pathname: Routes.call,
                            //   query: { id: createAudioCallLink(user!.id, data.id), token: 1 },
                            // })
                          }
                          disabled={!isAudioEnabled}
                          className={cn(
                            'w-full !rounded-md sm:max-w-[165px] min-h-[140px]  mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white',
                            {
                              'opacity-50 cursor-not-allowed': !isAudioEnabled,
                            }
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <PhoneCall size={45} weight="bold" className='text-[#0E7490]' />
                            <span className="text-lg font-semibold">Audio hovor</span>
                            <span className="text-sm font-100">Zavolej zde</span>
                          </div>
                        </Button>

                        {/* Chat Button */}
                        <Button
                          onClick={() =>
                            isChatEnabled &&
                            handleProtectedAction(() => router.push({ pathname: Routes.chat, query: { id: createChatLink(user!.id, data.id), token: 0 } }), 'chat')
                            // router.push({
                            //   pathname: Routes.chat,
                            //   query: { id: createChatLink(user!.id, data.id) },
                            // })
                          }
                          disabled={!isChatEnabled}
                          className={cn(
                            'w-full !rounded-md sm:max-w-[165px] min-h-[140px]  mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white',
                            {
                              'opacity-50 cursor-not-allowed': !isChatEnabled,
                            }
                          )}
                        >
                          <div className="flex flex-col items-center">
                            <Chat size={45} weight="bold" className='text-[#B77906]' />
                            <span className="text-lg font-semibold">Chat</span>
                            <span className="text-sm font-100">Napiš zde</span>
                          </div>
                        </Button>

                      </>
                    );
                  })()}

                <Button
                  onClick={() => router.push({ hash: 'reservation' })}
                  className="w-full !rounded-md sm:max-w-[165px] min-h-[140px]  !font-100 mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white  !hover:text-white"
                >
                  <div className="flex flex-col items-center">
                    <Calendar size={45} />
                    <span className="text-lg font-semibold">Rezervuj termín</span>
                  </div>
                </Button>
                {data.paid_videos_enabled && (
                  <Button
                    onClick={() => router.push({ hash: 'paid-videos' })}
                    className="w-full !rounded-md sm:max-w-[165px] min-h-[140px] !font-100 mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white  !hover:text-white"
                  >
                    <div className="flex flex-col items-center">
                      <FilmSlate size={45} weight="bold" className='text-[#9333EA]' />
                      <span className="text-lg font-semibold">Placená videa</span>
                    </div>
                  </Button>
                )}

                <Button
                  onClick={handleShareGuide}
                  className="w-full !rounded-md sm:max-w-[165px] min-h-[140px] !font-100 mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white !hover:text-white"
                >
                  <div className="flex flex-col items-center">
                    <ShareNetwork size={45} weight="bold" className='text-[#10B981]' />
                    <span className="text-lg font-semibold">Sdílet profil</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

        </div>

        <AccessOptionsModal />

      </section>
      <section id="reservation" className="scroll-m-20 pb-10 sm:pb-24">
        <div className="container xl:max-w-7xl">
          <h4 className="mb-6">Rezervuj si termín</h4>

          <div className="hidden sm:block overflow-x-auto">
            {(!availableDays || availableDays.length === 0) && (
              <div className="text-center text-gray-500 py-6">Bohužel nejsou dostupné žádné volné termíny v následujících dnech.</div>
            )}

            <div className="max-w-lg mx-auto flex overflow-x-auto gap-2 pb-3">
              {daysRange.map((date) => {
                const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                const isAvailable = availableDays.some((d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

                return (
                  <button
                    key={date.toString()}
                    disabled={!isAvailable}
                    aria-disabled={!isAvailable}
                    className={`w-[80px] h-[60px] flex flex-col items-center justify-center rounded-md transition-all ${isAvailable
                        ? isSelected
                          ? 'bg-primary-500 font-bold'
                          : 'bg-primary-700 text-gray-200 hover:bg-primary-650'
                        : 'bg-primary-800/60 text-gray-400 opacity-50 cursor-not-allowed'
                      }`}
                    onClick={() => isAvailable && setSelectedDate(date)}
                  >
                    <span className="text-sm uppercase">{format(date, 'EEE', { locale: cs })}</span>
                    <span className="text-lg font-semibold">{format(date, 'd', { locale: cs })}</span>
                  </button>
                );
              })}
            </div>

            {availableDays && availableDays.length > 0 && (
              <div className="mt-4 p-4 rounded-lg shadow">
                <h5 className="text-lg font-semibold mb-4">
                  {format(selectedDate, 'd. M. EEEE', { locale: cs })}
                </h5>

                {calendarSlots?.some((s) => format(new Date(s.datetime), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {getHoursWithSlots(selectedDate).map((hour) => {
                      const slots = calendarSlots?.filter(
                        (s) => format(new Date(s.datetime), 'yyyy-MM-dd HH') === format(setHours(selectedDate, hour), 'yyyy-MM-dd HH')
                      ) || [];
                      const sortedSlots = slots?.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime));

                      return sortedSlots.map((slot) => (
                        <ReservationButton key={slot.datetime} {...slot} id={data.id}>
                          {format(slot.datetime, 'HH:mm')} - {format(addMinutes(slot.datetime, 15), 'HH:mm')}
                        </ReservationButton>
                      ));
                    })}
                  </div>
                ) : (
                  (calendarSlots !== undefined && calendarSlots.length > 0) && (
                    <div className="text-center text-gray-500 py-6">Bohužel nejsou dostupné žádné volné termíny pro tento den.</div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="sm:hidden">
            {(!availableDays || availableDays.length === 0) ? (
              <div className="text-center text-gray-500 py-6">Bohužel nejsou dostupné žádné volné termíny v následujících dnech.</div>
            ) : (
              <div className="flex overflow-x-auto gap-2 pb-3">
                {daysRange.map((date) => {
                  const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                  const isAvailable = availableDays.some((d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

                  return (
                    <button
                      key={date.toString()}
                      disabled={!isAvailable}
                      aria-disabled={!isAvailable}
                      className={`px-4 py-2 rounded-md transition-all ${isAvailable
                          ? isSelected
                            ? 'bg-primary-500 font-bold'
                            : 'bg-primary-700 text-gray-200 hover:bg-primary-650'
                          : 'bg-primary-800/60 text-gray-400 opacity-50 cursor-not-allowed'
                        }`}
                      onClick={() => isAvailable && setSelectedDate(date)}
                    >
                      {format(date, 'EEE d', { locale: cs }).toUpperCase()}
                    </button>
                  );
                })}
              </div>
            )}

            {availableDays && availableDays.length > 0 && (
              <div className="mt-4 p-4 rounded-lg shadow">
                <h5 className="text-lg font-semibold mb-4">
                  {format(selectedDate, 'd. M. EEEE', { locale: cs })}
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  {getHoursWithSlots(selectedDate).map((hour) => {
                    const slots = calendarSlots?.filter(
                      (s) => format(new Date(s.datetime), 'yyyy-MM-dd HH') === format(setHours(selectedDate, hour), 'yyyy-MM-dd HH')
                    ) || [];
                    const sortedSlots = slots?.sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime));

                    return sortedSlots.map((slot) => (
                      <ReservationButton key={slot.datetime} {...slot} id={data.id}>
                        {format(slot.datetime, 'HH:mm')} - {format(addMinutes(slot.datetime, 15), 'HH:mm')}
                      </ReservationButton>
                    ));
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="pb-10 sm:pb-24">
        <div className="container grid justify-between gap-10 lg:grid-cols-2 xl:max-w-7xl">
          <div className="relative">
            <BluredCircle style={{ width: '660px', height: '587px' }} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <H4 className="mb-3">O průvodci</H4>
            <p className="whitespace-pre-wrap sm:text-xl">{data.description}</p>
          </div>

          <div className="flex flex-col gap-12 lg:ml-28 xl:max-w-md">
            <div>
              <H4 className="mb-4">Zaměření</H4>
              <div className="flex flex-wrap items-center gap-2.5">
                {data.specializations.map((item) => (
                  <Badge key={item.id} color="transparent-white" size="lg">
                    {item.title}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <H4 className="mb-4">Techniky výkladu</H4>
              <div className="flex flex-wrap items-center gap-2.5">
                {data.techniques.map((item) => (
                  <Badge key={item.id} color="transparent-white" size="lg">
                    {item.title}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-10 mx-auto w-full max-w-md">
              <GuideVideo src={data.video?.original} />
            </div>
          </div>
        </div>

      </section>


      {data.paid_videos_enabled && (
        <section id="paid-videos" className="pb-10 sm:pb-24">
          <div className="container xl:max-w-7xl">
            <GuidePaidVideos guideProfileId={data.id} />
          </div>
        </section>
      )}

      {guides?.length ? (
        <section>
          <div className="container pb-24 xl:max-w-7xl">
            <div className="mb-5 flex flex-col items-center text-center sm:mb-10">
              <div className="relative -z-1 w-full pt-18 md:pt-32">
                <Illustrations.IllustrationLogo className="absolute left-1/2 top-0 w-[374px] max-w-[80%] -translate-x-1/2" />
              </div>
              <H2>Podobní průvodci</H2>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{guides.map((guide) => <GuideCard key={guide.id} {...guide} />)}</div>

            <div className="mt-7.5 text-center sm:mt-15">
              <Button href={Routes.discover} color="transparent-white">
                Zobrazit všechny
              </Button>
            </div>
          </div>
        </section>
      ) : null}
      <ReservationModal onSuccess={mutateSlots} />
    </>
  );
}


export function DiscoverDetailShort({ data: initialData, slug }: { data: GuideProfileType; slug: string }) {
  const { data } = useGuide(slug, initialData);
  const { user } = useUser();
  // const { openModal } = useModal();

  const { data: calendarSlots, mutate: mutateSlots } = useCalendarSlots({
    guide_profile_id: data?.id ?? '',
    date_from: format(new Date(), 'y-MM-dd'),
    date_to: format(addDays(new Date(), 7), 'y-MM-dd'),
  });

  const { data: guides } = useGuides({ 'filter[specialization_id]': data?.specializations.map((item) => item.id), 'filter[not_id]': [data?.id ?? ''] });
  // const hoursRange = Array.from({ length: 24 }, (_, i) => i); // Hours from 6:00 to 17:00
  // const daysRange = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  // const [selectedDate, setSelectedDate] = useState(daysRange[0]); // Default to the first available date

  const handleProtectedAction = (callback: () => void) => {
    if (!user) {
      // router.push({  pathname: Routes.wizard  });
      router.push({
        pathname: Routes.wizard,
        query: { slug: slug },
      });
      //  callback();
      // openModal('access-options', {
      //   type: 'state',
      //   queries: {
      //   }
      // });
    } else {
      callback();
    }
  };


  if (!data) return null;

  return (
    <>
      <section className="pb-12 sm:pb-24">
        <PageTitle >
          <div className="flex flex-col-reverse items-center justify-center gap-x-4 gap-y-1 lg:flex-row lg:items-start">
            {data?.avatar && (
              <img
                src={getImageUrl(data.avatar)}
                alt={guideName(data)}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-primary-500"
              />
            )}
            <RatingBox rating={data.rating ?? 4.6} />
            {guideName(data)} <GuideStatusBadge state={data.call_status} />
          </div>

        </PageTitle>

        <div className="container relative mt-10 !px-0 sm:px-6 xl:max-w-7xl">
          {/* <GuideVideo src={data.video?.original} /> */}
          <div className="mt-8 flex flex-wrap justify-center text-center gap-4">
            Spoj se teď přes video, audio nebo chat s průvodcem:
          </div>
          {/* {user ? (user?.role === 'customer' && (  */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
            {[
              'online',
              'chat-online',
              'audio-online',
              'chat-audio-online',
              'chat-video-online',
              'all-online',
            ].includes(data.call_status) &&
              (() => {
                const status = data.call_status;

                const isVideoEnabled =
                  status === 'online' ||
                  status === 'chat-video-online' ||
                  status === 'all-online';

                const isAudioEnabled =
                  status === 'online' ||
                  status === 'audio-online' ||
                  status === 'chat-audio-online' ||
                  status === 'all-online';

                const isChatEnabled =
                  status === 'chat-online' ||
                  status === 'chat-audio-online' ||
                  status === 'chat-video-online' ||
                  status === 'all-online';

                return (
                  <>

                    {/* Video Button */}
                    <Button
                      onClick={() =>
                        isVideoEnabled &&
                        handleProtectedAction(() => router.push({ pathname: Routes.call, query: { id: createCallLink(user!.id, data.id), token: 0 } }))
                        // router.push({
                        //   pathname: Routes.call,

                        //   query: { id: createCallLink(user!.id, data.id), token: 0 },
                        // })
                      }
                      disabled={!isVideoEnabled}
                      className={cn(
                        'w-full !rounded-md sm:max-w-[175px] min-h-[150px] mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white',
                        {
                          'opacity-50 cursor-not-allowed': !isVideoEnabled,
                        }
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <VideoCamera size={45} weight="bold" className='text-[#B6DC36]' />
                        <span className="text-lg font-semibold">Video hovor</span>
                        <span className="text-sm font-100">Začni teď</span>
                      </div>
                    </Button>

                    {/* Audio Button */}
                    <Button
                      onClick={() =>
                        isAudioEnabled &&
                        handleProtectedAction(() => router.push({ pathname: Routes.call, query: { id: createAudioCallLink(user!.id, data.id), token: 1 } }))
                        // router.push({
                        //   pathname: Routes.call,
                        //   query: { id: createAudioCallLink(user!.id, data.id), token: 1 },
                        // })
                      }
                      disabled={!isAudioEnabled}
                      className={cn(
                        'w-full !rounded-md sm:max-w-[175px] min-h-[150px] mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white',
                        {
                          'opacity-50 cursor-not-allowed': !isAudioEnabled,
                        }
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <PhoneCall size={45} weight="bold" className='text-[#0E7490]' />
                        <span className="text-lg font-semibold">Audio hovor</span>
                        <span className="text-sm font-100">Začni teď</span>
                      </div>
                    </Button>

                    {/* Chat Button */}
                    <Button
                      onClick={() =>
                        isChatEnabled &&
                        handleProtectedAction(() => router.push({ pathname: Routes.chat, query: { id: createChatLink(user!.id, data.id), token: 0 } }))
                        // router.push({
                        //   pathname: Routes.chat,
                        //   query: { id: createChatLink(user!.id, data.id) },
                        // })
                      }
                      disabled={!isChatEnabled}
                      className={cn(
                        'w-full !rounded-md sm:max-w-[175px] min-h-[150px] mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white',
                        {
                          'opacity-50 cursor-not-allowed': !isChatEnabled,
                        }
                      )}
                    >
                      <div className="flex flex-col items-center">
                        <Chat size={45} weight="bold" className='text-[#B77906]' />
                        <span className="text-lg font-semibold">Chat</span>
                        <span className="text-sm font-100">Začni teď</span>
                      </div>
                    </Button>
                    <Button
                      onClick={() => router.push({ hash: 'paid-videos' })}
                      className="w-full !rounded-md sm:max-w-[175px] min-h-[150px] !font-100 mx-6 sm:mx-0 flex items-center justify-center px-6 py-6 shadow-lg gap-4 text-white  !hover:text-white"
                    >
                      <div className="flex flex-col items-center">
                        <FilmSlate size={45} weight="bold" className='text-[#9333EA]' />
                        <span className="text-lg font-semibold">Placená videa</span>
                      </div>
                    </Button>
                  </>
                );
              })()}

          </div>

        </div>

        {/* <AccessOptionsModal /> */}

      </section>




      {guides?.length && (
        <section>
          <div className="container pb-24 xl:max-w-7xl">
            {/* <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{guides?.map((guide) => <GuideCard key={guide.id} {...guide} />)}</div> */}

            <div className="mt-7.5 text-center sm:mt-15">
              <Button href={Routes.discover} color="transparent-white">
                Zobrazit všechny průvodce
              </Button>
            </div>
          </div>
        </section>
      )}
      <span className='text-md flex flex-wrap  justify-center text-center text-white/60 whitespace-pre-wrap'> Nevíš si rady? </span> <span className='text-white flex flex-wrap  ml-1 justify-center text-center'> Volej <a href="tel:+420608047033" className=' ml-1'>+420 608 047 033 </a><span className='text-white/60 ml-1'> nebo napiš na </span><a href="mailto:podpora@spirio.cz" className=' ml-1'> podpora@spirio.cz</a></span>


      <ReservationModal onSuccess={mutateSlots} />
    </>
  );
}

DiscoverDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const slug = query.slug as string;

  const data = await getGuide(slug).catch(() => null);

  return {
    props: { slug, data },
  };
};

const ReservationButton: React.FC<{ children: React.ReactNode; id: string } & CalendarSlotsType> = ({ children, datetime, timezone, id }) => {
  const router = useRouter();
  const { data } = useBookings();
  const { user } = useUser();
  const { openModal } = useModal();

  const SECONDS_PER_SLOT = 900; // 15 minutes in seconds

  const handleReservation = () => {
    // If not logged in, show auth modal instead of redirecting
    if (!user) {
      openModal('auth', { type: 'state', queries: {} });
      return;
    }

    // Logged-in but unsupported role
    if (user.role !== 'customer' && user.role !== 'host') {
      toast.error('Pro rezervaci se musíte přihlásit jako uživatel.');
      router.push(Routes['registration']);
      return;
    }

    // Define the cutoff date
    const now = new Date();
    // cutoffDate.setHours(0, 0, 0, 0); // Start of the day

    // Filter bookings created after the cutoff date
    const recentBookingsCount = (data ?? []).filter(
      (booking) => new Date(booking.happening_at) >= now
    );

    const totalReservations = recentBookingsCount?.length + 1;

    // Get the number of slots being booked
    // const bookingCount = bookingsCount ?? 1;
    var totalRequiredSeconds = SECONDS_PER_SLOT * totalReservations;
    // toast.info(
    //   `Kredity ${totalRequiredSeconds} bk ${data?.length} user bal ${user?.seconds_balance} sekund.`
    // );
    if (totalRequiredSeconds === 0) totalRequiredSeconds = SECONDS_PER_SLOT;

    if (user?.seconds_balance < totalRequiredSeconds) {
      toast.error(
        `Nemáte dostatek času pro další rezervaci. Pro každou rezervaci potřebujete ${SECONDS_PER_SLOT / 60} minut.`
      );
      return router.push(Routes['subscriptions']);
    }

    openModal('register-date', { type: 'state', queries: { id, datetime, timezone } });
  };


  return (
    <button type="button" onClick={handleReservation} className="rounded bg-primary-700 px-2.5 py-3 text-sm font-500 transition-colors hover:bg-primary-500">
      {children}
    </button>
  );
};

const ReservationModal: (props: { onSuccess: KeyedMutator<CalendarSlotsType[]> }) => JSX.Element | null = ({ onSuccess }) => {
  const [loading, setLoading] = React.useState(false);
  const { closeModal, getModalState } = useModal();
  const { mutate: mutateCal } = useBookings();

  const state = getModalState('register-date') as { id: string; datetime: string; timezone: string };

  if (!state) return null;

  const onClick = async () => {
    setLoading(true);
    api
      .post('/bookings/store', serializeJsonToFormData({ happening_at: state.datetime, guide_profile_id: state.id, timezone: state.timezone }))
      .then(async () => {
        await onSuccess();
        toast.success('Termín byl úspěšně zarezervován');
        mutateCal();
        setLoading(false);
        closeModal('register-date');
      })
      .catch(() => {
        toast.error('Něco se nepovedlo, zkuste to prosím znovu');
      });
  };

  return (
    <Modal name="register-date" width="440px" showClose={true}>
      <h3 className="mb-4 text-center text-3xl font-800">Rezervace termínu</h3>
      <p className="mx-auto mb-8 max-w-sm text-center text-lg">
        Chcete si rezervovat termín <br />
        {format(state.datetime, 'dd.MM.y')} od {format(state.datetime, 'HH:mm')}?
      </p>
      <div className="mt-auto flex items-center justify-between gap-4 [&>button]:flex-1">
        <Button onClick={() => closeModal('register-date')} color="transparent-white">
          Zrušit
        </Button>
        <Button onClick={onClick} color="gradient" loading={loading}>
          Rezervovat
        </Button>
      </div>
    </Modal>
  );
};


// export const ProfileVideo = (props: { src: string }) => {
//   const [play, setPlay] = React.useState(false);
//   const videoRef = React.useRef<HTMLVideoElement>(null);

//   React.useEffect(() => {
//     if (videoRef.current) {
//       if (play) {
//         videoRef.current.play();
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   }, [play]);

//   return (
//     <div className="absolute left-0 top-0 inline-flex h-full w-full items-center justify-center">
//       <video
//         ref={videoRef}
//         src={props.src}
//         className="absolute left-0 top-0 h-full w-full object-cover"
//         muted
//         playsInline
//         onClick={() => {
//           if (play) {
//             setPlay(false);
//           }
//         }}
//       />
//       {!play && (
//         <button type="button" onClick={() => setPlay(true)} className="relative z-1 transition-transform hover:scale-105">
//           <IconPlayButton className="w-24" />
//         </button>
//       )}
//     </div>
//   );
// };


// duplicate GuideVideo removed (defined earlier)
