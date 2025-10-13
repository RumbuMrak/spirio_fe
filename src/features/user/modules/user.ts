import api from '@/services/api';
import { deleteCookie } from 'cookies-next';
import { mutate } from 'swr';
import { serializeJsonToFormData, transformJSONAPIData } from '@/services/utils';
import { GuideProfileType, UserType } from '../types/user';
export const getUser = () => {
  return api.get('/me/show').then(async (res) => {
    if (res.status !== 200) return null;
    const user = transformJSONAPIData<UserType>(res.data).data;
    return user;
  });
};
export const clearUser = () => {
  deleteCookie('user-id', {
    path: '/',
  });
  localStorage.removeItem('auto-login');
  mutate(
    (key: any) => {
      if (key[0] === 'guides' || key[0] === 'posts' || key[0] === 'streams') return false;
      return true;
    },
    undefined,
    false,
  );
};
export const logout = () => {
  return api
    .post(`/auth/logout`, {})
    .then(() => {
      clearUser();
    })
    .catch();
};
export const updateGuideStatus = (status: GuideProfileType['call_status']) => {
  return api.post(
    '/me/update',
    serializeJsonToFormData({
      call_status: status,
    }),
  );
};
