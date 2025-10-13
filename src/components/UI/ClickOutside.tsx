import React, { useRef, useEffect } from 'react';
function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>, eventTrigger: any) {
  function handleClickOutside(event: MouseEvent) {
    if (ref.current && !ref.current.contains(event.target as any)) {
      eventTrigger();
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
}
function useEscapeClick(eventTrigger: any, isOn: boolean) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOn) {
        eventTrigger();
      }
    }
    isOn && window.addEventListener('keydown', closeOnEscape, false);
    return () => {
      isOn && window.removeEventListener('keydown', closeOnEscape, false);
    };
  }, [eventTrigger]);
}
const ClickOutside: React.FC<{
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  closeOnEscape?: boolean;
  className?: string;
  [key: string]: any;
}> = ({ onClick, closeOnEscape = false, children, className, ...props }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, onClick);
  useEscapeClick(onClick, closeOnEscape);
  return (
    <div ref={wrapperRef} className={className} {...props}>
      {children}
    </div>
  );
};
export default ClickOutside;
