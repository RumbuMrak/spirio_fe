import React from 'react';
const useEffectOnce: (callback: () => void, deps?: any[]) => null = (callback, deps = []) => {
  const calledOnce = React.useRef(false);
  React.useEffect(() => {
    if (calledOnce.current) {
      return;
    }
    calledOnce.current = true;
    callback();
  }, deps);
  return null;
};
export default useEffectOnce;
