import style from './topbar.module.css';
import React from 'react';
import Logo from '../../UI/Logo';
import Link from 'next/link';
import { cn, getImageUrl } from '@/services/utils';
import useBreakpoint from '@/hooks/useBreakpoint';
import { useRouter } from 'next/router';
import Backdrop from '@/components/UI/backdrop/Backdrop';
import * as Icons from '@phosphor-icons/react';
import { RemoveScroll } from 'react-remove-scroll';
import useScrolled from '@/hooks/useScrolled';
import Button from '@/components/UI/button/Button';
import GradientBackground from '@/components/UI/shapes/GradientBackground';
import { route } from '@/services/routes';
import useModal from '@/hooks/useModal';
import TopbarUser from './TopbarUser';
import useUser from '@/features/user/hooks/useUser';
import { useGlobalStoreUpdate } from '@/store/globalStore';
import { Gift } from '@phosphor-icons/react';
const Topbar: (props: React.HTMLAttributes<HTMLElement>) => JSX.Element = ({ className, ...props }) => {
  const router = useRouter();
  const [openNav, setOpenNav] = React.useState(false);
  const { user } = useUser();
  const { openModal } = useModal();
  const { isInBreakpoint } = useBreakpoint();
  const scrolled = useScrolled(35);
  const updateStore = useGlobalStoreUpdate();
  const mobileView = isInBreakpoint({ to: 'lg' });
  React.useEffect(() => {
    if (router.isReady) {
      setOpenNav(false);
    }
  }, [router.asPath]);
  return (
    <>
      <button
        onClick={() => openModal('auth', { type: 'query', queries: { mode: 'register' } })}
        className={cn('block w-full overflow-hidden bg-gradient-to-tl from-primary-700 to-primary-500 py-2 text-white transition-all sm:py-5')}
      >
        <div className="font-semibold flex  items-center  justify-center gap-3 !px-4 text-sm sm:text-xl">
          {}
          <Gift size={45} weight="duotone" />
          <span>Založ si účet ještě dnes a získej dvojnásobek minut zdarma.</span>
        </div>
      </button>
      <div {...props} className={cn([style.topbar, RemoveScroll.classNames.zeroRight])} data-scrolled={scrolled}>
        <header className="container">
          <Link href="/" className={style.topbar__logo} passHref>
            <Logo color={router.pathname !== '/' ? 'primary' : undefined} />
          </Link>
          <nav className={style.topbar__nav} {...(mobileView ? { 'data-state': openNav ? 'open' : 'close' } : {})}>
            {mobileView && (
              <>
                <GradientBackground />
                <div className="flex shrink-0 items-center justify-between px-6 py-4">
                  <Link href="/" passHref>
                    <Logo className="h-6.5" color={router.pathname !== '/' ? 'primary' : undefined} onClick={() => setOpenNav(false)} />
                  </Link>
                  <button onClick={() => setOpenNav(false)} color="primary" className="h-10 w-10 !px-2.5">
                    <Icons.X className="h-7 w-7" />
                  </button>
                </div>
              </>
            )}
            <ul>
              {[
                { link: { pathname: route.howItWorks() }, title: 'Jak to funguje', active: router.pathname.startsWith(route.howItWorks()) },
                // { link: { pathname: route.discover(), hash: 'guides' }, title: 'Najít průvodce', active: router.pathname.startsWith(route.discover())   },
                // ...(!user || (user?.role === 'customer' || user?.role === 'host') ? [
                //   {
                //     link: { pathname: (user?.role === 'customer' || user?.role === 'host') ? route.subscriptions() : route.packagesOverview() },
                //     title: 'Zakoupit čas',
                //     active: router.pathname.startsWith(route.packagesOverview()),
                //   },
                // ]
                //   : []),
                { link: { pathname: route.discover(), hash: 'posts' }, title: 'Články', active: router.asPath.endsWith('#posts') },
                { link: { pathname: route.discover(), hash: 'horoscopes' }, title: 'Horoskopy', active: router.asPath.endsWith('#horoscopes') },
              ].map(({ link, title, active }) => (
                <li key={title}>
                  {}
                  <Link href={link} onClick={() => mobileView && setOpenNav(false)} data-active={active}>
                    {title}
                  </Link>
                </li>
              ))}
              <li>
                <button onClick={() => openModal('auth', { type: 'query', queries: { mode: 'register' } })}>Přihlášení</button>
              </li>
            </ul>
            <div className={style.topbar__actions}>
              {user ? (
                <>
                  <Button href={route.discover()} color="gradient" size={mobileView ? 'default' : 'sm'}>
                    Volej průvodci
                  </Button>
                  <TopbarUser isOpen={openNav} />
                  {(user?.role === 'customer' || user?.role === 'host') && (
                    <div className="relative flex w-full justify-center text-sm xl:mt-0 xl:block">
                      <div className="flex items-center gap-2 rounded bg-gradient-to-tr from-primary-550 to-primary-700 px-2 py-1">
                        {}
                        <span className="whitespace-nowrap">{Math.floor((user?.seconds_balance || 0) / 60)} min</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Button href={`${route.discover()}#guides`} color="gradient" size={mobileView ? 'default' : 'sm'}>
                    Najít průvodce
                  </Button>
                  {}
                </>
              )}
            </div>
          </nav>
          {mobileView && openNav && <Backdrop onClick={() => setOpenNav(false)} />}
          {mobileView && (
            <div className="flex flex-row">
              {}
              {!user ? (
                <Button href={`${route.discover()}#guides`} color="gradient" size={mobileView ? 'sm' : 'sm'}>
                  Najít průvodce
                </Button>
              ) : (
                <div className="flex ">
                  <TopbarUser isOpen={openNav} />
                </div>
              )}
              <button onClick={() => setOpenNav(true)} className="h-10 w-10 !px-2.5">
                <Icons.List className="h-6 w-6" />
              </button>
            </div>
          )}
          {isInBreakpoint({ to: 'lg' }) && (user?.role === 'customer' || user?.role === 'host') && router.asPath.includes(route.profile()) && (
            <button
              onClick={() => updateStore((store) => ({ ...store, userMenuOpen: !store.userMenuOpen }))}
              className="relative -ml-6 inline-flex h-10 w-10 overflow-hidden rounded-full bg-gradient-primary"
            >
              {user?.avatar ? (
                <img src={getImageUrl(user.avatar)} alt="Avatar" className="h-full w-full rounded-full object-cover" />
              ) : (
                <Icons.UserCircle size={28} className="m-auto" />
              )}
            </button>
          )}
        </header>
      </div>
    </>
  );
};
export default Topbar;
