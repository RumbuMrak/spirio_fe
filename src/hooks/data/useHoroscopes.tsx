import api from '@/services/api';
import { transformJSONAPIData } from '@/services/utils';
import { PaginatedResponse } from '@types';
import useSWRInfinite from 'swr/infinite';
const useHoroscopes = (type?: HoroscopesType['type'], sign?: HoroscopesType['sign'], initialData?: any) => {
  const data = useSWRInfinite(
    (index) => {
      return { key: 'horoscopes', params: { page: (index + 1).toString(), type, sign } };
    },
    getHoroscopes,
    {
      dedupingInterval: 1000 * 60 * 60 * 24,
      revalidateFirstPage: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
      keepPreviousData: true,
      fallbackData: initialData,
    },
  );
  const canFetchMore = data.data && !data.isValidating ? data.data.length !== 0 && !!data.data[data.data.length - 1].meta.next : false;
  return {
    horoscopes: data.data?.flatMap((page) => page.data).filter(Boolean) ?? [],
    mutate: data.mutate,
    error: data.error,
    isLoading: data.isLoading,
    isValidating: data.isValidating,
    fetchMore: () => data.setSize(data.data?.[data.data.length - 1].meta.next ?? 1),
    canFetchMore,
  };
};
export default useHoroscopes;
export const getHoroscopes = (data: { params: { type: HoroscopesType['type']; sign: HoroscopesType['sign'] } }) => {
  return api
    .get('/horoscopes/index', {
      params: {
        take: 1000,
        'filter[type]': data.params.type,
        'filter[sign]': data.params.sign,
      },
    })
    .then(async (res) => {
      const horoscopes = transformJSONAPIData<HoroscopesType[], PaginatedResponse>(res.data);
      return horoscopes;
    });
};
export type HoroscopesType = {
  id: string;
  title: string;
  type: 'today' | 'tomorrow' | 'weekly' | 'monthly' | 'yearly';
  content: string;
  created_at: string;
  sign: 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';
  updated_at: string;
};
