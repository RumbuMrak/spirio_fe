import api from '@/services/api';
import { transformJSONAPIData } from '@/services/utils';
import useSWR from 'swr';
import { CallsType } from './useCalls';
const useCall = (id: string) => {
  const data = useSWR(
    ['call', id],
    id
      ? () => {
          return getCall(id);
        }
      : null,
    {
      revalidateOnMount: true,
      revalidateOnFocus: true,
    },
  );
  return data;
};
export default useCall;
export const getCall = (id: string) => {
  return api
    .get('/calls/show', {
      params: { id },
    })
    .then(async (res) => {
      const call = transformJSONAPIData<CallsType>(res.data).data;
      return call;
    });
};
