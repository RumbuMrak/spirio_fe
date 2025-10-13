import api from '@/services/api';
import useSWR from 'swr';
const useCalendarSlots = (params: CalendarSlotsParamsType) => {
  const data = useSWR(
    ['calendar-slots', JSON.stringify(params)],
    () => {
      return getCalendarSlots(params);
    },
    {
      dedupingInterval: 1000 * 60 * 60 * 24,
    },
  );
  return data;
};
export default useCalendarSlots;
export const getCalendarSlots = (params: CalendarSlotsParamsType) => {
  return api
    .get('/calendar/slots', {
      params: {
        timezone: 'Europe/Prague',
        ...params,
      },
    })
    .then(async (res) => {
      return res.data as CalendarSlotsType[];
    });
};
export type CalendarSlotsType = {
  datetime: string;
  timezone: string;
};
type CalendarSlotsParamsType = {
  guide_profile_id: string;
  date_from: string;
  date_to: string;
};
