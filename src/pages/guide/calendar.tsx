import Layout from '@/components/layout/Layout';
import GuideProfileLayout from '@/components/layout/GuideProfileLayout';
import { cn, serializeJsonToFormData } from '@/services/utils';
import React from 'react';
import useBookings, { BookingType } from '@/hooks/data/useBookings';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import useCalls, { CallsType } from '@/hooks/data/useCalls';
import { IconPhoneButton } from '@/components/UI/Icons';
import Routes from '@/services/routes';
import Link from 'next/link';
import Button from '@/components/UI/button/Button';
import { Trash } from '@phosphor-icons/react';
import api from '@/services/api';
const Calendar = () => {
  const { data } = useBookings();
  const { data: calls, mutate: mutateCalls } = useCalls();
  const groupedByDate = data?.reduce((acc: Record<string, Array<BookingType>>, current) => {
    const date = format(current.happening_at, 'y-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(current);
    return acc;
  }, {});
  let result: Array<Array<BookingType>> = [];
  if (groupedByDate) {
    const sortedDates = Object.keys(groupedByDate).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    result = sortedDates.map((date) => groupedByDate[date]);
  }
  return (
    <div className="container flex flex-col gap-9 py-12 xl:max-w-5xl">
      {calls && (
        <div>
          <div className="mb-4.5 text-xl font-700">
            Live <span className="text-error-700">&#x2022;</span>
          </div>
          <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {calls.map((item) => (
              <CalendarLiveItem key={item.id} onDelete={mutateCalls} {...item} />
            ))}
          </div>
        </div>
      )}
      {result?.map((group, index) => (
        <div key={index}>
          <div className="mb-4.5 font-500">{format(group[0].happening_at, 'EEEE, d.M.y', { locale: cs })}</div>
          <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((item) => (
              <CalendarItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Calendar;
Calendar.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <GuideProfileLayout>{page}</GuideProfileLayout>
    </Layout>
  );
};
const CalendarItem: (props: BookingType & React.HTMLAttributes<HTMLDivElement>) => JSX.Element = ({
  id,
  className,
  user,
  happening_at,
  happening_until,
  ...props
}) => {
  return (
    <div {...props} className={cn('flex items-center justify-between gap-4 rounded bg-primary-750 p-2 pl-3', className)}>
      <div>
        <div className="text-sm font-800">{user?.nickname || user?.email}</div>
        <span className="text-xs font-500 text-[#907FA4]">
          {format(happening_at, 'HH:mm')} - {format(happening_until, 'HH:mm')}
        </span>
      </div>
    </div>
  );
};
const CalendarLiveItem: (props: CallsType & React.HTMLAttributes<HTMLDivElement> & { onDelete: () => void }) => JSX.Element = ({
  getstream_call_id,
  className,
  user,
  onDelete,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <div {...props} className={cn('flex items-center gap-2.5 rounded bg-primary-750 p-2 pl-3', className)}>
      <div className="mr-auto">
        <div className="text-sm font-800">{user?.nickname || user?.email}</div>
      </div>
      <Link href={{ pathname: Routes.call, query: { id: getstream_call_id, callId: props.id } }} className="transition-transform hover:scale-105">
        <IconPhoneButton className="w-10" />
      </Link>
      <Button
        onClick={async () => {
          setLoading(true);
          try {
            await api.post('/calls/destroy', serializeJsonToFormData({ id: props.id }));
            onDelete();
          } catch (error) {
            setLoading(false);
          }
        }}
        className="!p-3"
        loading={loading}
      >
        <Trash />
      </Button>
    </div>
  );
};
export async function getServerSideProps() {
  return { props: {} };
}
