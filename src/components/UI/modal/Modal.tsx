import { cn } from '@/services/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { useGlobalStoreState } from '@/store/globalStore';
import { Transition } from '@headlessui/react';
import useModal, { ModalType } from '@/hooks/useModal';
import useBreakpoint from '@/hooks/useBreakpoint';
import { CaretLeft, X } from '@phosphor-icons/react';
import s from './modal.module.css';
export type ModalProps = React.PropsWithChildren<{
  name: ModalType;
  width: string;
  children: React.ReactNode | ((props: { close: (open: boolean) => void; open: boolean }) => JSX.Element);
  open?: boolean;
  close?: () => void;
  queriesToRemove?: string[];
  showClose?: boolean;
  preventClose?: boolean;
}>;
const Modal = React.forwardRef<HTMLDivElement, ModalProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ name, children, width, open: openDefinedOutside, close: closeDefinedOutside, queriesToRemove, showClose, preventClose, className, ...props }, ref) => {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const { closeModal, isModalOpen } = useModal();
    const { modal: modalQuery } = router.query;
    const { modal: modalState } = useGlobalStoreState();
    const { breakpoint } = useBreakpoint();
    const isOpen = openDefinedOutside ?? open;
    React.useEffect(() => {
      if (isModalOpen(name)) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }, [modalQuery, modalState]);
    const onOpen = () => {
      typeof closeDefinedOutside !== 'undefined' ? closeDefinedOutside() : closeModal(name, { queries: queriesToRemove });
    };
    return (
      <Dialog.Root open={isOpen} onOpenChange={!preventClose ? onOpen : () => {}}>
        <Dialog.DialogTitle>
      </Dialog.DialogTitle>
      <Dialog.Description>
      </Dialog.Description>
        <Dialog.Portal forceMount>
          <Transition.Root ref={ref} show={isOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay forceMount onClick={(e) => e.stopPropagation()} className={s['modal__overlay']}>
                <div className={s['modal__container']}>
                  <Transition.Child
                    as={Fragment}
                    enter={'ease-out duration-200'}
                    enterFrom={'opacity-0 translate-y-[25px] scale-95'}
                    enterTo={'translate-y-0 opacity-100 scale-100'}
                    leave={'ease-in duration-100'}
                    leaveFrom={'opacity-100 sm:scale-100'}
                    leaveTo={'opacity-0 scale-95'}
                  >
                    <Dialog.Content {...props} style={{ width }} className={cn([s['modal__content'], className])}>
                      {breakpoint === 'xs' && (
                        <Dialog.Close onClick={(e) => e.stopPropagation()} className={s['modal__close']} aria-label="Zavřít">
                          <CaretLeft size={26} />
                        </Dialog.Close>
                      )}
                      {typeof children === 'function' ? children({ close: onOpen, open }) : children}
                      {breakpoint !== 'xs' && showClose && (
                        <Dialog.Close asChild>
                          <button
                            className="text-gray-500 absolute right-4 top-4 rounded-full hover:text-white focus:text-white focus:outline-none"
                            aria-label="Close"
                          >
                            <X size={20} weight="bold" />
                          </button>
                        </Dialog.Close>
                      )}
                    </Dialog.Content>
                  </Transition.Child>
                </div>
              </Dialog.Overlay>
            </Transition.Child>
          </Transition.Root>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);
Modal.displayName = 'Modal';
export default Modal;
