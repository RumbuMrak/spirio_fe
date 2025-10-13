import useModal from '@/hooks/useModal';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import Link from 'next/link';
import { addMinutes, differenceInMilliseconds, format } from 'date-fns';
import Button from './button/Button';
import Modal from './modal/Modal';
import router, { useRouter } from 'next/router';
import Routes from '@/services/routes';
import { StreamType } from '@/features/calls/types/calls';
import { cn, getImageUrl, guideName } from '@/services/utils';
import {  H3, H4 } from './typography/Typography';
import { UserType } from '@/features/user/types/user';
import style from './../layout/topbar/topbar.module.css';
import Logo from './Logo';
const StreamLinkModal = (): JSX.Element | null => {
    const [loading, setLoading] = useState(false);
    const { closeModal, getModalState } = useModal();
    const state = getModalState('stream-details') as { uuid: string; happening_at: string; title: string };
    if (!state) return null;
    const handleRedirect = () => {
        setLoading(true);
        closeModal('stream-details');
        router.push({
            pathname: Routes['livestream-viewer'],
            query: { id: state.uuid },
        });
    };
    return (
        <>
            <Modal name="stream-details" width="440px" showClose={false}>
                <h2 className="mb-4 text-center text-3xl font-400">Detail eVysílání</h2>
                <p className="mx-auto mb-8 max-w-sm text-center text-lg">
                    <span className="mb-4 text-center text-3xl font-800">{state.title}</span> {}
                    <br />
                     <span className="mb-6 text-primary-500">dne {format(state.happening_at, 'dd.MM.y')} ve {format(state.happening_at, 'HH:mm')} - {format(addMinutes(state.happening_at, 50), 'HH:mm')}</span> 
                </p>
                <ul className="mx-auto mb-8 max-w-sm list-disc pl-4 text-lg">
                    <li>eVysílání je dostupné ve vysoké kvalitě.</li>
                    <li>Textový chat bude aktivní během celého streamu.</li>
                    <li>eVysílání je ZDARMA</li>
                    <li>eVysílání je dostupné jen pro registrované uživatele <Link onClick={() => closeModal('stream-details')} href={Routes.registration} className="text-primary-500">
                        [Registrovat se nyní]
                    </Link></li>
                </ul>
                <div className="mt-auto flex items-center justify-between gap-4 [&>button]:flex-1">
                    <Button onClick={() => closeModal('stream-details')} color="transparent-white">
                        Zavřít
                    </Button>
                    <Button onClick={handleRedirect} color="gradient" loading={loading}>
                        Přejít na eVysílání
                    </Button>
                </div>
            </Modal>
            {}
        </>
    );
};
export interface StreamCardProps extends React.HTMLAttributes<HTMLSpanElement> {
    streams?: StreamType[];
    user?: UserType | null;
}
const StreamCard = React.forwardRef<HTMLSpanElement, StreamCardProps & PropsWithChildren>(
    ({ streams, user, className, children, ...props }, ref) => {
        const [timeRemaining, setTimeRemaining] = useState<number>(0);
        const { openModal } = useModal();
        const router = useRouter();
        useEffect(() => {
            if (streams && streams.length > 0) {
                const interval = setInterval(() => {
                    const streamTime = new Date(streams[0].happening_at);
                    const remaining = differenceInMilliseconds(streamTime, new Date());
                    setTimeRemaining(remaining <= 0 ? 0 : remaining);
                }, 1000);
                return () => clearInterval(interval);
            }
        }, [streams]);
        if (!streams) return null;
        const getFormattedTime = (milliseconds: number): string => {
            if (milliseconds <= 0) return '00:00:00';
            const totalSeconds = Math.floor(milliseconds / 1000);
            const days = Math.floor(totalSeconds / (24 * 3600)); // 24 hours * 3600 seconds per hour
            const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600); // 3600 seconds per hour
            const minutes = Math.floor((totalSeconds % 3600) / 60); // 60 seconds per minute
            const seconds = totalSeconds % 60;
            return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        };
        const { days, hours, minutes, seconds } = getFormattedTime(timeRemaining).split(":").reduce((acc, time, i) => {
            if (i === 0) acc.days = time;
            if (i === 1) acc.hours = time;
            if (i === 2) acc.minutes = time;
            if (i === 3) acc.seconds = time;
            return acc;
        }, { days: '00', hours: '00', minutes: '00', seconds: '00' });
        const onClick = async () => {
            if (streams && streams.length > 0) {
                openModal('stream-details', {
                    type: 'state',
                    queries: {
                        uuid: streams[0].uuid,
                        title: streams[0].title,
                        happening_at: streams[0].happening_at
                    }
                })
            };
        };
        return (
            <div className="md:container !sm:px-1 max-w-xl grow mt-5 text-center">
                 <H4 className="px-1 sm:px-0 mb-3 md:px-3 !text-1xl sm:!text-1xl xl:!text-[40px] ">
                    <span className={cn(style.topbar__logo, 'justify-center')}><Logo color={router.pathname !== '/' ? 'primary' : undefined} /> </span>
                     <span className='text-gradient text-center'>Živé Vysílání</span>
                </H4>
                <div className=" relative bg-primary-700 text-white rounded-lg shadow-lg overflow-hidden">
                    <div className="sm:container pl-2 sm:px-8 py-4 flex items-center gap-2 z-10">
                    {streams[0].guideProfile.avatar && (
                        <img
                            src={getImageUrl(streams[0].guideProfile.avatar)}
                            className="hidden sm:block relative left-[-15px] h-full w-40 object-cover object-center rounded"
                            alt={guideName(streams[0].guideProfile)}
                        />
                    )}
                        <div className="flex flex-col sm:pr-2">
                            <H3 className='z-1 pr'>
                                <StreamLinkModal />
                                <Link href={{}} onClick={onClick} className="hover:underline sm:break-words sm:text-wrap sm:whitespace-pre-wrap">
                                    {streams[0].title}
                                </Link>
                            </H3>
                            <div className="text-lg text-left text-primary-600 font-500 lg:text-3xl">
                                <p>{format(new Date(streams[0].happening_at), 'd.M.y - HH:mm')}</p>
                            </div>
                            <p className="flex gap-2 mt-2 lg:text-2xl">
                                <Link href={{ pathname: Routes['discover-detail'], query: { slug: streams[0].guideProfile.id } }} className="flex items-center gap-2">
                                    s {guideName(streams[0].guideProfile)}
                                </Link>
                            </p>
                            <div className="mt-4 text-xl font-bold z-1">
                                <div className="flex gap-4">
                                    {days !== '00' && (
                                        <>
                                            <div className="flex items-center justify-center bg-primary-800 text-white text-lg font-semibold rounded py-2 px-4 w-20">
                                                {days}
                                            </div>
                                            <span className='py-2'>d</span>
                                        </>
                                    )}
                                    <div className="flex items-center justify-center bg-primary-800 text-white text-lg font-semibold rounded py-2 px-4 w-20">
                                        {hours}
                                    </div>
                                    <span className='py-2'>h</span>
                                    <div className="flex items-center justify-center bg-primary-800 text-white text-lg font-semibold rounded py-2 px-4 w-20">
                                        {minutes}
                                    </div>
                                    <span className='py-2'>m</span>
                                    <div className="sm:block hidden items-center justify-center bg-primary-800 text-white text-lg font-semibold rounded py-2 px-4 w-20">
                                        {seconds}
                                    </div>
                                    <span className='py-2  hidden sm:block'>s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-no-repeat"
                        style={{ backgroundImage: "url('assets/Zodiac.png')" }}
                    />
                </div>
            </div>
        );
    });
StreamCard.displayName = 'StreamCard';
export default StreamCard;