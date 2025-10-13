import { toast } from '@/components/UI/Toast';
import { useRouter } from 'next/router';
import React from 'react';
const useGlobalMessage = () => {
  const router = useRouter();
  const calledOnce = React.useRef(false);
  React.useEffect(() => {
    if (calledOnce.current) {
      return;
    }
    if (router.query.message) {
      calledOnce.current = true;
      const messageType = router.query.messageType as 'success' | 'error';
      setTimeout(() => {
        toast[messageType || 'error'](router.query.message as string);
      }, 1000);
      router.replace(router.pathname, undefined, { shallow: true });
      return;
    }
  }, []);
};
export default useGlobalMessage;
