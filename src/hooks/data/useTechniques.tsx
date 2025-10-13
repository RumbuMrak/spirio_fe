import api from '@/services/api';
import { transformJSONAPIData } from '@/services/utils';
import { PaginatedResponse } from '@types';
import useSWRInfinite from 'swr/infinite';
const useTechniques = () => {
  const data = useSWRInfinite(
    (index) => {
      return { key: 'techniques', params: { page: (index + 1).toString() } };
    },
    getTechniques,
    { dedupingInterval: 1000 * 60 * 60 * 24, revalidateFirstPage: true, revalidateIfStale: true, revalidateOnMount: true, keepPreviousData: true },
  );
  const canFetchMore = data.data && !data.isValidating ? data.data.length !== 0 && !!data.data[data.data.length - 1].meta.next : false;
  return {
    techniques: data.data?.flatMap((page) => page.data).filter(Boolean) ?? [],
    mutate: data.mutate,
    error: data.error,
    isLoading: data.isLoading,
    isValidating: data.isValidating,
    fetchMore: () => data.setSize(data.data?.[data.data.length - 1].meta.next ?? 1),
    canFetchMore,
  };
};
export default useTechniques;
const getTechniques = () =>
  api
    .get('/techniques/index', {
      params: {
        sort: ['title'],
        take: 1000,
      },
    })
    .then(async (res) => {
      const techniques = transformJSONAPIData<TechniquesType[], PaginatedResponse>(res.data);
      return techniques;
    });
export type TechniquesType = {
  id: string;
  title: string;
};
