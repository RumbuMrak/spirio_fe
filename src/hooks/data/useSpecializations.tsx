import api from '@/services/api';
import { transformJSONAPIData } from '@/services/utils';
import { PaginatedResponse } from '@types';
import useSWRInfinite from 'swr/infinite';
const useSpecializations = () => {
  const data = useSWRInfinite(
    (index) => {
      return { key: 'specializations', params: { page: (index + 1).toString() } };
    },
    getSpecializations,
    { dedupingInterval: 1000 * 60 * 60 * 24, revalidateFirstPage: true, revalidateIfStale: true, revalidateOnMount: true, keepPreviousData: true },
  );
  const canFetchMore = data.data && !data.isValidating ? data.data.length !== 0 && !!data.data[data.data.length - 1].meta.next : false;
  return {
    specializations: data.data?.flatMap((page) => page.data).filter(Boolean) ?? [],
    mutate: data.mutate,
    error: data.error,
    isLoading: data.isLoading,
    isValidating: data.isValidating,
    fetchMore: () => data.setSize(data.data?.[data.data.length - 1].meta.next ?? 1),
    canFetchMore,
  };
};
export default useSpecializations;
const getSpecializations = () =>
  api
    .get('/specializations/index', {
      params: {
        sort: ['title'],
        take: 1000,
      },
    })
    .then(async (res) => {
      const specializations = transformJSONAPIData<SpecializationsType[], PaginatedResponse>(res.data);
      return specializations;
    });
export type SpecializationsType = {
  id: string;
  title: string;
  icon: string;
};
