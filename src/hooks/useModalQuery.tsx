import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const useModalQuery = ({ modal }: { modal: string }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setOpen(router.query.modal === modal || router.asPath.includes(`modal=${modal}`));
  }, [router.asPath]);
  const openModal = (queries?: Record<string, string>) => {
    router.push({ pathname: router.route, query: { ...router.query, modal, ...queries } }, undefined, { scroll: false });
  };
  const closeModal = (queriesToRemove?: string[]) => {
    const queries = { ...router.query };
    if (queriesToRemove) {
      queriesToRemove.forEach((query) => {
        queries[query] && delete queries[query];
      });
    }
    delete queries.modal;
    router.replace({ pathname: router.pathname, query: { ...queries } }, undefined, { scroll: false });
  };
  return {
    isOpen: open,
    open: openModal,
    close: closeModal,
  };
};
export default useModalQuery;
