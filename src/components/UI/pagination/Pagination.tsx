import { cn } from '@/services/utils';
import React from 'react';
import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import style from './pagination.module.css';
import { useRouter } from 'next/router';
import useBreakpoint from '@/hooks/useBreakpoint';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
const Pagination: (props: ReactPaginateProps & { containerId: string; queryName?: string }) => JSX.Element | null = ({
  containerId,
  queryName = 'page',
  ...props
}) => {
  const router = useRouter();
  const { isInBreakpoint } = useBreakpoint();
  const page = +(router.query[queryName] as string) || 1;
  if (!router.isReady || !props.pageCount || props.pageCount <= 1) return null;
  const scrollOnClick = () => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const y = window.scrollY + container.getBoundingClientRect().top - 100;
    setTimeout(() => {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 500);
  };
  return (
    <ReactPaginate
      {...props}
      breakLabel="..."
      className={cn([style.pagination, props.className])}
      pageRangeDisplayed={isInBreakpoint({ to: 'sm' }) ? 0 : 2}
      marginPagesDisplayed={1}
      renderOnZeroPageCount={null}
      previousLabel={<CaretLeft weight="bold" />}
      nextLabel={<CaretRight weight="bold" />}
      previousClassName={style.prev}
      nextClassName={style.next}
      activeClassName={style.selected}
      breakClassName={style.break}
      pageClassName={style.button}
      forcePage={page - 1}
      onPageChange={(e) => {
        router.push(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              [queryName]: e.selected + 1,
            },
          },
          undefined,
          { scroll: false, shallow: true },
        );
      }}
      onClick={(e) => {
        if ((e.isPrevious && e.selected === 0) || (e.isNext && e.selected === props.pageCount - 1) || e.isBreak) return;
        scrollOnClick();
        props.onClick && props.onClick(e);
      }}
    />
  );
};
export default Pagination;
