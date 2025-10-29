import Button from '@/components/UI/button/Button';
import { H1, H2 } from '@/components/UI/typography/Typography';
import Layout from '@/components/layout/Layout';
import { IconCards, IconHoroscope, IconLogoFilled, IconNumerology, IconPeopleCircle, IconStreams } from '@/components/UI/Icons';
import BluredCircle from '@/components/UI/shapes/BluredCircle';
import { route } from '@/services/routes';
import useUser from '@/features/user/hooks/useUser';
import useStreams from '@/hooks/data/useStreams';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HowItWorksModule from '@/components/general/HowItWorksModule';
import GuidesLandingSlider from '@/components/general/GuidesLandingSlider';
import Link from 'next/link';
import { differenceInMinutes } from 'date-fns';
import Topbar from '@/components/layout/topbar/Topbar';
import Image from 'next/image';
export default function Home() {
  const { user } = useUser();
  const { data: streams } = useStreams();
  const [showStreamButton, setShowStreamButton] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!showStreamButton && streams?.length && streams[0].guideProfile.id === user?.guide_profile?.id) {
      const interval = setInterval(() => {
        const streamStartTime = new Date(streams[0].happening_at);
        const currentTime = new Date();
        const timeDiff = differenceInMinutes(streamStartTime, currentTime);
        setShowStreamButton(timeDiff <= 15);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [streams, showStreamButton]);
  const handleRedirect = () => {
    if (!streams?.length) return;
    router.push({
      pathname: route.livestreamHost(streams[0].uuid),
    });
  };
  return (
    <>
      {}
      {showStreamButton && (
        <div className="fixed bottom-16 left-1/2  z-10 flex -translate-x-1/2 overflow-hidden">
          <div className="items-center gap-1">
            <p className="font-bold  text-lg text-white">
              <Button className={'flex h-40 w-60 flex-col items-center !rounded-md text-sm'} onClick={handleRedirect}>
                <IconStreams className="relative h-20 w-15 animate-bounce text-white  " />
                <span>
                  Začít<span className="text-gradient"> eVysílání</span>{' '}
                </span>
                {}
              </Button>
            </p>
          </div>
        </div>
      )}
      <section id="hero" className="bg-mesh-gradient min-h-[90vh]">
        {/* topbar */}
        <Topbar />

        <div className="relative mt-8 px-4 pb-4 md:mt-8 md:flex md:items-center md:px-24 md:pb-16">
          {/* hero content */}
          <div className="grow">
            <section className="mx-auto max-w-6xl">
              <H1 className="mb-6 text-center !text-4xl md:text-left xl:!text-[75px]">
                <div className="[text-shadow:1px_1px_2px_rgba(24,8,42,0.7)]">Získej svůj</div>
                <div className="[text-shadow:1px_1px_2px_rgba(24,8,42,0.7)]">jedinečný výklad</div>
              </H1>
              <p
                className="mx-auto mb-8 max-w-xl text-lg leading-relaxed
[text-shadow:1px_1px_2px_rgba(24,8,42,0.7)] md:mx-0"
              >
                {}
                Na Spirio se spojíš s průvodci v tarotu, astrologii, energoterapii a dalších naukách. Najdi svého průvodce pro chvíle, kdy potřebuješ zastavit a
                nadechnout se.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
                {}
                <Button
                  href={`${route.discover()}#guides`}
                  color="gradient"
                  size="lg"
                  className="font-semibold h-14 min-w-[220px] text-lg shadow-lg !outline !outline-white/30"
                >
                  Najdi svého průvodce
                </Button>
              </div>
            </section>
          </div>
          {/* hero image */}
          <div className="my-16 h-full md:absolute md:right-0 md:top-0 md:-z-10 md:my-0 md:w-[55%]">
            <Image src="/assets/hero-faded.png" alt="Homepage" width={1200} height={1200} className="h-full w-full object-contain" />
          </div>
        </div>
      </section>
      <section className="relative py-16">
        <BluredCircle style={{ width: '926px', height: '604px' }} className="-bottom-1/2 right-0" />
        <div className="container">
          <div className="mb-12 text-center">
            <H2 className="mb-4">Techniky a služby našich průvodců</H2>
            <p className="mx-auto max-w-2xl text-lg text-white/70">Vyber si z široké nabídky duchovních technik a najdi tu pravou cestu pro sebe</p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
            {(() => {
              const items = [
                { icon: IconCards, text: 'Výklad karet', k: 'vyklad-karet', description: 'Tarot a jiné karty' },
                { icon: IconHoroscope, text: 'Astrologie', k: 'astrologie', description: 'Horoskopy a mapy' },
                { icon: IconNumerology, text: 'Numerologie', k: 'numerologie', description: 'Síla čísel' },
                { icon: IconLogoFilled, text: 'Spirituální koučing', k: 'spiritualni-koucink', description: 'Osobní rozvoj' },
                { icon: IconPeopleCircle, text: 'Vedená meditace', k: 'meditace-dech', description: 'Klid a harmonie' },
              ];
              return items.map(({ icon: Icon, text, k, description }) => (
                <Link
                  key={k}
                  href={{
                    pathname: route.techniqueOverview(k),
                    hash: k,
                  }}
                  className="group flex flex-col items-center rounded-lg border border-transparent bg-white/5 p-6 text-center transition-all duration-300 hover:scale-105 hover:border-white/20 hover:bg-white/10"
                >
                  <div className="relative mb-4 flex h-20 w-20 items-center justify-center">
                    <IconLogoFilled className="h-20 w-20 text-primary-650 transition-colors duration-300 group-hover:text-primary-500" />
                    <Icon className="absolute h-10 w-10 text-white" />
                  </div>
                  <span className="font-semibold mb-2 text-lg leading-tight transition-colors group-hover:text-gradient">{text}</span>
                  <span className="text-sm text-white/60 transition-colors group-hover:text-white/80">{description}</span>
                </Link>
              ));
            })()}
          </div>
          <div className="mt-12 text-center">
            <Button href="/techniky" color="transparent-white" size="lg" className="min-w-[250px] !rounded-lg">
              Zobrazit všechny techniky
            </Button>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <H2 className="mb-4">Naši průvodci</H2>
            <p className="mx-auto max-w-2xl text-lg text-white/70">
              Poznej zkušené průvodce, kteří ti pomohou najít odpovědi na životní otázky. Každý má svou jedinečnou cestu a specializaci.
            </p>
          </div>
          <div className="-mx-4">
            <GuidesLandingSlider title="" text="" />
          </div>
          <div className="mt-12 text-center">
            <Button href={`${route.discover()}#guides`} color="transparent-white" size="lg" className="min-w-[280px] !rounded-lg">
              Prohlédnout všechny průvodce
            </Button>
          </div>
        </div>
      </section>
      {}
      <section className="border-t border-white/10 bg-white/5 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <H2 className="mb-4">Proč si vybrat Spirio?</H2>
            <p className="mx-auto max-w-2xl text-lg text-white/70">Stovky lidí už našly s námi svou cestu ke spokojenosti a klidu</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div className="p-6">
              <div className="font-bold mb-3 text-4xl text-gradient">1500+</div>
              <div className="text-lg text-white/70">Spokojených klientů</div>
            </div>
            <div className="p-6">
              <div className="font-bold mb-3 text-4xl text-gradient">25+</div>
              <div className="text-lg text-white/70">Zkušených průvodců</div>
            </div>
            <div className="p-6">
              <div className="font-bold mb-3 text-4xl text-gradient">24/7</div>
              <div className="text-lg text-white/70">Dostupnost</div>
            </div>
            <div className="p-6">
              <div className="font-bold mb-3 text-4xl text-gradient">4.8★</div>
              <div className="text-lg text-white/70">Průměrné hodnocení</div>
            </div>
          </div>
        </div>
      </section>
      {}
      {}
      {}
      {}
      {}
      <section className="mb-16 md:mb-24">
        <div className="container py-16">
          <div className="mb-12 text-center">
            <H2 className="mb-4">Jak to funguje?</H2>
            <div className="mx-auto max-w-3xl">
              <div className="mb-6 text-xl font-700 text-gradient">Založ si účet zdarma a získej dvojnásobek minut na první konzultaci</div>
              <p className="mb-4 text-lg text-white/70">Jednoduché kroky k tvé první konzultaci s průvodcem</p>
              <div className="mt-6 rounded-lg bg-white/10 p-4">
                <p className="text-sm text-white/80">
                  💡 <strong>Tip:</strong> První nákup = bonus 2x tolik minut zdarma
                </p>
              </div>
            </div>
          </div>
          <HowItWorksModule />
          <div className="mt-12 text-center">
            <Button
              href={route.registration()}
              color="gradient"
              size="lg"
              className="font-semibold h-16 min-w-[300px] !rounded-lg text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Začít s bonus minutami zdarma
            </Button>
            <p className="mt-3 text-sm text-white/60">✓ Žádné závazky • ✓ Zrušitelné kdykoliv • ✓ Bezpečné platby</p>
          </div>
        </div>
      </section>
    </>
  );
}
Home.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout hideTopbar>{page}</Layout>;
};
export async function getServerSideProps() {
  return {};
}
