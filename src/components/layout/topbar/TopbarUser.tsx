import { scaleOpacityAnimation } from '@/services/animations';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { route } from '@/services/routes';
import Toggler from '@/components/UI/Toggler';
import { useRouter } from 'next/router';
import Button from '@/components/UI/button/Button';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '@/services/utils';
import useBreakpoint from '@/hooks/useBreakpoint';
import { logout } from '@/features/user/modules/user';
import useUser from '@/features/user/hooks/useUser';
const TopbarUser = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const { isInBreakpoint } = useBreakpoint();
  const mobileView = isInBreakpoint({ to: 'md' });
  const menuItems =
    user?.role === 'guide'
      ? [
          { title: 'Profil průvodce', href: route.guideProfile() },
          { title: 'Změna hesla', href: route.changePassword() },
          { title: 'Rezervované hovory', href: route.guideCalendar() },
        ]
      : [
          { title: 'Profil uživatele', href: route.profile() },
          { title: 'Změna hesla', href: route.changePassword() },
          { title: 'Moje rezervace', href: route.calendar() },
        ];
  return (
    <div className="flex items-center gap-2">
      <Toggler>
        {({ open, setOpen }) => (
          <DropdownMenu.Root onOpenChange={setOpen} open={open}>
            <DropdownMenu.Trigger asChild>
              <Button size={mobileView  ? isOpen? 'default':'xs' : 'sm'}>
                {user?.email} <CaretDown size={18} weight="bold" className={cn('ml-1 text-primary-605 transition-transform', open && 'rotate-180')} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal forceMount>
              <Transition {...scaleOpacityAnimation} show={open} as={React.Fragment}>
                <DropdownMenu.Content
                  sideOffset={10}
                  align="end"
                  className="z-10 w-[var(--radix-popper-anchor-width)] divide-y divide-primary-605/20 overflow-hidden rounded bg-primary-700 px-3 md:w-[220px]"
                >
                  {menuItems.map(({ title, href }) => (
                    <DropdownMenu.Item key={title} asChild>
                      <Link href={href} className={'block select-none py-2.5 outline-none hover:text-primary data-[highlighted]:text-primary'}>
                        {title}
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={async () => {
                        router.replace(route.homepage());
                        await logout();
                        setUser(null);
                      }}
                      className={'block w-full select-none py-2.5 text-left outline-none hover:text-primary data-[highlighted]:text-primary'}
                    >
                      Odhlášení
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </Transition>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </Toggler>
    </div>
  );
};
export default TopbarUser;
