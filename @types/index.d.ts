import { Icon } from '@phosphor-icons/react';
import { QueryClient } from 'react-query';

declare module '*.svg' {
  const content: any;
  export default content;
}

declare global {
  interface Window {
    queryClient: QueryClient;
  }
}

interface PaginatedResponse {
  meta: {
    next: null | number;
    prev: null | number;
    count: number;
  };
}

type IconType = Icon | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);

type ImageType = {
  id: string;
  original?: string;
  conversions?: {
    svg: string | null;
    urls: {
      width: number;
      url: string;
    }[];
  }[];
};

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
  }[Keys];
