import React, { useEffect, useState } from 'react';
import Button from '@/components/UI/button/Button';
import { formatNumber } from '@/services/utils';
import { usePaidVideos, purchasePaidVideo, checkPaidVideoAccess } from '../api';
import useUser from '@/features/user/hooks/useUser';
import Routes from '@/services/routes';
import { useRouter } from 'next/router';
import useModal from '@/hooks/useModal';
import VideoPlayerModal from './VideoPlayerModal';
export default function GuidePaidVideos({ guideProfileId }: { guideProfileId: number | string }) {
  const { videos } = usePaidVideos(guideProfileId);
  const { user } = useUser();
  const router = useRouter();
  const { openModal } = useModal();
  const [ownedVideos, setOwnedVideos] = useState<Set<number>>(new Set());
  const [checkingAccess, setCheckingAccess] = useState(false);
  useEffect(() => {
    if (!user || !videos.length) return;
    const checkAllAccess = async () => {
      setCheckingAccess(true);
      const owned = new Set<number>();
      await Promise.all(
        videos.map(async (v) => {
          try {
            const result = await checkPaidVideoAccess(v.id);
            if (result.data.has_access) {
              owned.add(v.id);
            }
          } catch (error) {
            console.error(`Failed to check access for video ${v.id}`, error);
          }
        })
      );
      setOwnedVideos(owned);
      setCheckingAccess(false);
    };
    checkAllAccess();
  }, [user, videos]);
  const onBuy = async (id: number) => {
    if (!user) {
      window.location.href = '/prihlaseni';
      return;
    }
    const res = await purchasePaidVideo(id);
    const checkoutUrl = (res as any)?.checkout_url || (res as any)?.data?.checkout_url || (res as any)?.data?.stripe_checkout_url || (res as any)?.data?.url;
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };
  const onPlay = (video: { id: number; title: string }) => {
    openModal('video-player', {
      type: 'state',
      queries: {
        videoId: String(video.id),
        videoTitle: video.title,
      },
    });
  };
  if (!videos.length) {
    return (
      <div className="text-center text-gray-400 py-12">
        <p className="text-lg">Průvodce zatím nemá žádná placená videa.</p>
      </div>
    );
  }
  return (
    <>
      <VideoPlayerModal videoId={0} videoTitle="" />
      <div>
        <h3 className="text-3xl font-bold mb-6">Placená videa</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => {
            const isOwned = ownedVideos.has(v.id);
            return (
              <div key={v.id} className="rounded-lg bg-white/5 border border-white/10 p-4 flex flex-col hover:bg-white/10 transition-all">
                {v.thumbnail_url ? (
                  <img src={v.thumbnail_url} alt={v.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-purple-900 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white/50 text-lg">Bez náhledu</span>
                  </div>
                )}
                <div className="font-bold text-xl mb-2">{v.title}</div>
                {v.description && <div className="text-sm text-white/70 line-clamp-3 mb-4 flex-grow">{v.description}</div>}
                <div className="mt-auto flex items-center justify-between">
                  {isOwned ? (
                    <div className="text-green-500 font-semibold text-sm">✓ Zakoupeno</div>
                  ) : (
                    <div className="text-[#ddcd54] font-bold text-lg">{formatNumber(v.price_cents / 100, { currency: 'czk' })}</div>
                  )}
                  {isOwned ? (
                    <Button onClick={() => onPlay({ id: v.id, title: v.title })} color="gradient" size="sm">
                      Přehrát
                    </Button>
                  ) : (
                    <Button onClick={() => onBuy(v.id)} color="gradient" size="sm" disabled={checkingAccess}>
                      {checkingAccess ? 'Načítání...' : 'Koupit'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
