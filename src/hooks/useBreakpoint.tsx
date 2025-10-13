import React, { useContext, useEffect, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig.js';
import tailwindConfig from '../../tailwind.config';
const fullConfig = resolveConfig(tailwindConfig as any);
const screens: any = fullConfig?.theme?.screens;
const screensCopy = { ...screens };
Object.keys(screensCopy).forEach((breakpoint) => {
  screensCopy[breakpoint] = parseInt(screensCopy[breakpoint]);
});
type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ContextProps = {
  width: number;
  height: number;
  breakpoint: Breakpoints;
  breakpointValues: Record<Breakpoints, number>;
  isInBreakpoint: (options: { from?: Breakpoints | number; to?: Breakpoints | number } | Breakpoints[]) => boolean;
};
const BreakpointContext = React.createContext<Partial<ContextProps>>({});
export const BreakpointProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [breakpoint, setBreakpoint] = useState<Breakpoints | undefined>('xs');
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    if (!fullConfig?.theme?.screens) return;
    let currentBreakpoint = 'xs';
    screens &&
      Object.keys(screens).forEach((breakpoint: any) => {
        if (window.innerWidth > parseInt(screens[breakpoint])) {
          currentBreakpoint = breakpoint;
        }
      });
    setBreakpoint(currentBreakpoint as Breakpoints);
  };
  const isInBreakpoint = (options: { from?: Breakpoints | number; to?: Breakpoints | number } | Breakpoints[]) => {
    if (!breakpoint) return false;
    if (Array.isArray(options)) {
      return options.indexOf(breakpoint) > -1;
    } else {
      const from = options.from ? (typeof options.from === 'number' ? options.from : screensCopy[options.from]) : 0;
      const to = options.to ? (typeof options.to === 'number' ? options.to : screensCopy[options.to]) : Infinity;
      return width > from && width <= to;
    }
  };
  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);
  return (
    <BreakpointContext.Provider
      value={{
        width,
        height,
        breakpoint,
        breakpointValues: screensCopy,
        isInBreakpoint,
      }}
    >
      {children}
    </BreakpointContext.Provider>
  );
};
const useBreakpoint = () => {
  const { width, height, breakpoint, breakpointValues, isInBreakpoint } = useContext(BreakpointContext);
  return { width, height, breakpoint, breakpointValues, isInBreakpoint } as ContextProps;
};
export default useBreakpoint;
