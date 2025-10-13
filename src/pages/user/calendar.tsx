import { IconPhoneButton } from '@/components/UI/Icons';
import Layout from '@/components/layout/Layout';
import UserProfileLayout from '@/components/layout/UserProfileLayout';
import useUser from '@/features/user/hooks/useUser';
import useBookings, { BookingType } from '@/hooks/data/useBookings';
import { route } from '@/services/routes';
import { cn, createCallLink, guideName } from '@/services/utils';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import Link from 'next/link';
import React, { useState } from 'react';
import Button from '@/components/UI/button/Button';

const Calendar = () => {
  const { data } = useBookings();
  const currentDate = new Date();
  const groupedByDate = data?.reduce((acc: Record<string, Array<BookingType>>, current) => {
    const date = format(current.happening_at, 'y-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(current);
    return acc;
  }, {});
  let visibleGroup: Array<Array<BookingType>> = [];
  let expandableGroup: Array<Array<BookingType>> = [];
  if (groupedByDate) {
    const sortedDates = Object.keys(groupedByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime() // Sort ASCENDING (oldest to newest) for dates
    );
    sortedDates.forEach((date) => {
      const group = groupedByDate[date];
      const sortedGroup = group.sort((a, b) => 
        new Date(a.happening_at).getTime() - new Date(b.happening_at).getTime()
      );
      const futureBookings = sortedGroup.filter(b => new Date(b.happening_at) > currentDate);
      const pastBookings = sortedGroup.filter(b => new Date(b.happening_at) <= currentDate);
      if (futureBookings.length > 0) visibleGroup.push(futureBookings);
      if (pastBookings.length > 0) expandableGroup.push(pastBookings);
    });
  }
  const [isExpandableVisible, setExpandableVisible] = useState(false);
  return (
    <div className="container flex flex-col gap-9 xl:max-w-5xl">
      {}
      {visibleGroup?.map((group, index) => (
        <div key={index}>
          <div className="mb-4.5 font-500">
            {format(group[0].happening_at, 'EEEE, d.M.y', { locale: cs })}
          </div>
          <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((item) => (
              <CalendarItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      ))}
      {}
      <div>
        <Button
          className="mb-4 text-white max-w-md bg-primary-500"
          onClick={() => setExpandableVisible(!isExpandableVisible)}
        >
          {isExpandableVisible ? 'Skryj Historické Rezervace' : 'Ukaž Historické Rezervace'}
        </Button>
        {isExpandableVisible && expandableGroup?.map((group, index) => (
          <div key={index}>
            <div className="mb-4.5 font-500">
              {format(group[0].happening_at, 'EEEE, d.M.y', { locale: cs })}
            </div>
            <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((item) => (
                <CalendarItem key={item.id} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Calendar;
Calendar.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout hideFooter>
      <UserProfileLayout>{page}</UserProfileLayout>
    </Layout>
  );
};
const CalendarItem: (props: BookingType & React.HTMLAttributes<HTMLDivElement>) => JSX.Element = ({
  id,
  className,
  guide_profile,
  happening_at,
  happening_until,
  ...props
}) => {
  const { user } = useUser();
  return (
    <div {...props} className={cn('flex items-center justify-between gap-4 rounded bg-primary-750 p-2 pl-3', className)}>
      <div>
        <div className="text-sm font-800">{guideName(guide_profile)}</div>
        <span className="text-xs font-500 text-[#907FA4]">
          {format(happening_at, 'HH:mm')} - {format(happening_until, 'HH:mm')}
        </span>
      </div>
      {user && (
        <Link href={route.call(createCallLink(user.id, guide_profile.id))} className="transition-transform hover:scale-105">
          <IconPhoneButton className="w-10" />
        </Link>
      )}
    </div>
  );
};
export async function getServerSideProps() {
  return { props: {} };
}
