import React from 'react';
interface useIntersectionObserverType {
  root?: any;
  target: React.MutableRefObject<null>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}
export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}: useIntersectionObserverType) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && onIntersect()), {
      root: root && root.current,
      rootMargin,
      threshold,
    });
    const el = target && target.current;
    if (!el) {
      return;
    }
    observer.observe(el);
    return () => {
      observer.unobserve(el!);
    };
  }, [target.current, enabled]);
}
