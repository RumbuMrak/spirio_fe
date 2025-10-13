import Illustrations from '@/images/illustrations';
import { cn } from '@/services/utils';
import React, { PropsWithChildren } from 'react';
import { H1 } from '../UI/typography/Typography';
import Breadcrumbs, { BreadcrumbsProps } from '../UI/Breadcrumbs';
import useBreakpoint from '@/hooks/useBreakpoint';
const PageTitle: (props: { breadcrumbs?: BreadcrumbsProps['items'] } & PropsWithChildren & React.HTMLAttributes<HTMLDivElement>) => JSX.Element = ({
  children,
  breadcrumbs,
  className,
  ...props
}) => {
  const { isInBreakpoint } = useBreakpoint();
  return (
    <div {...props} className={cn('container relative', className)}>
      <Illustrations.IllustrationLogo className="absolute left-1/2 -z-1 w-[574px] max-w-[80%] -translate-x-1/2 -translate-y-4 lg:-translate-y-12" />
      {isInBreakpoint({ from: 'md' }) && breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <H1 className="mx-auto pt-12 text-center lg:pt-21 lg:!text-[70px]">{children}</H1>
    </div>
  );
};
export default PageTitle;
