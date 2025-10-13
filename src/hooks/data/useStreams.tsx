import { getStreamsWeb } from '@/features/calls/api/calls';
import { StreamType } from '@/features/calls/types/calls';
import { PaginatedResponse } from '@types';
import { useRouter } from 'next/router';
import useSWR from 'swr';
const take = 100;
const useStreams = (initialData?: { data: StreamType[] } & PaginatedResponse) => {
  const router = useRouter();
  const page = router.query.page ? Number(router.query.page) : 1;
  const data = useSWR(
    ['streams', page],
    router.isReady
      ? () => {
          return getStreamsWeb(page, take);
        }
      : null,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
      fallbackData: initialData,
    },
  );
  return { ...data, data: data.data?.data, streamsCount: data.data?.meta.count ?? 0, streamsPages: Math.ceil(data.data?.meta.count ?? 0) / take };
};
export default useStreams;
