import React from 'react';
import useUser from '../user/hooks/useUser';
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase';
import api from '@/services/api';
import { serializeJsonToFormData } from '@/services/utils';
const useRequestFCMPermistion = () => {
  const { user } = useUser();
  async function requestFCMPermission() {
    if (!('Notification' in window) || ['FB_IAB', 'FB4A', 'FBAN', 'FBAV'].find((agent) => navigator.userAgent.includes(agent)) !== undefined) {
      console.log('This browser does not support notifications.');
      return;
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted' && user) {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        api.post('/fcm_tokens/store', serializeJsonToFormData({ token, locale: 'cs' }));
      } else if (permission === 'denied') {
        console.log('Denied for the notification');
      }
    }
  }
  React.useEffect(() => {
    requestFCMPermission();
  }, [JSON.stringify(user)]);
  return;
};
export default useRequestFCMPermistion;
