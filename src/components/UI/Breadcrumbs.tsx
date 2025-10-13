import { cn } from '@/services/utils';
import { CaretRight } from '@phosphor-icons/react';
import Link, { LinkProps } from 'next/link';
import React from 'react';
export type BreadcrumbsProps = {
  items: { title: string; url?: LinkProps['href'] }[];
};
const Breadcrumbs: React.FC<BreadcrumbsProps & Omit<React.HTMLAttributes<HTMLUListElement>, 'url'>> = ({ items, className, ...props }) => {
  return (
    <ul {...props} className={cn('flex items-center gap-3 overflow-auto text-xs [&>li]:shrink-0 [&_a:hover]:text-primary-500 [&_a]:underline', className)}>
      <li>
        <Link href="/">Spirio.cz</Link>
      </li>
      {items.map(({ title, url }, i) => (
        <React.Fragment key={title}>
          <span role="separator">
            <CaretRight size={10} weight="bold" />
          </span>
          <li key={i}>{url ? <Link href={url}>{title}</Link> : <span className={''}>{title}</span>}</li>
        </React.Fragment>
      ))}
    </ul>
  );
};
export default Breadcrumbs;
