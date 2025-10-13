import { useGlobalStore } from '@/store/globalStore';
import { UserType } from '../types/user';
import { getUser } from '../modules/user';
import { getCookie, setCookie } from 'cookies-next';
const useUser = () => {
  const [{ user }, setState] = useGlobalStore();
  const setUser = (user: UserType | null) => setState((state) => ({ ...state, user }));
  const revalidateUser = async () => {
    const updateProfile = await getUser();
    if (!updateProfile) {
      return setUser(null);
    }
    localStorage.setItem('auto-login', '1');
    const existingCookie = getCookie('user-id');
    if (!existingCookie) {
      setCookie('user-id', updateProfile.id, {
        path: '/',
        maxAge: 10 * 365 * 24 * 60 * 60,
      });
    }
    setUser(updateProfile);
    return updateProfile;
  };
  const logInUser = (user: UserType, cookieMaxAge?: number) => {
    localStorage.setItem('auto-login', '1');
    setCookie('user-id', user.id, {
      path: '/',
      maxAge: cookieMaxAge ?? (10 * 365 * 24 * 60 * 60), // Default to 10 years if not specified
    });
    setUser(user);
  };
  return {
    user,
    revalidateUser,
    setUser,
    logInUser,
  };
};
export default useUser;
