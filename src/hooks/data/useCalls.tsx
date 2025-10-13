import { UserType } from '@/features/user/types/user';
import api from '@/services/api';
import { transformJSONAPIData } from '@/services/utils';
import { PaginatedResponse } from '@types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
const take = 100;
const useCalls = () => {
  const router = useRouter();
  const page = router.query.page ? Number(router.query.page) : 1;
  const data = useSWR(
    ['calls', page],
    router.isReady
      ? () => {
          return getCalls(page);
        }
      : null,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    },
  );
  return { ...data, data: data.data?.data, callsCount: data.data?.meta.count ?? 0, callsPages: Math.ceil(data.data?.meta.count ?? 0) / take };
};
export default useCalls;
export const getCalls = (page?: number) => {
  return api
    .get('/calls/index', {
      params: { page, take, sort: ['-created_at'], 'filter[has_ended]': 0 },
    })
    .then(async (res) => {
      const calls = transformJSONAPIData<CallsType[], PaginatedResponse>(res.data);
      return calls;
    });
};
export type CallsType = {
  id: string;
  created_at: string;
  getstream_call_id: string;
  getstream_chat_id: string | null;
  guide_profile_id: number;
  user_id: number;
  user: UserType;
  has_ended: boolean;
};
