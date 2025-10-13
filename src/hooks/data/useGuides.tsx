import { GuideProfileType } from '@/features/user/types/user';
import api from '@/services/api';
import { transformJSONAPIData } from '@/services/utils';
import { PaginatedResponse } from '@types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
const take = 20;
const useGuides = (params?: GuidesParamsType, initialData?: { data: GuideProfileType[] } & PaginatedResponse) => {
  const router = useRouter();
  const page = router.query.page ? Number(router.query.page) : 1;
  const paramsWithDefaults: GuidesParamsType = {
    mode: 1, 
    ...params,
  };
  const data = useSWR(
    ['guides', page, JSON.stringify(paramsWithDefaults)],
    () => {
      return getGuides(page, paramsWithDefaults);
    },
    {
      refreshInterval: 1000 * 30,
      fallbackData: initialData,
    },
  );
  return { ...data, data: data.data?.data, guidesCount: data.data?.meta.count ?? 0, guidesPages: Math.ceil(data.data?.meta.count ?? 0) / take };
};
export default useGuides;
export const getGuides = (page?: number, params?: GuidesParamsType) => {
  return api
    .get('/guide_profiles/index', {
      params: { page, take, ...params },
    })
    .then(async (res) => {
      const guides = transformJSONAPIData<GuideProfileType[], PaginatedResponse>(res.data);
      return guides;
    });
};
type GuidesParamsType = {
  page?: number;
  take?: number;
  mode?: 0 | 1 | 2; 
  'filter[search]'?: string;
  'filter[specialization_id]'?: string[];
  'filter[call_status]'?: string[];
  'filter[not_id]'?: string[];
};
