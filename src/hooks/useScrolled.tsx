import { useState, useEffect } from 'react';
const useScrolled = (position?: number) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScrolledClass = () => {
      setScrolled(window.scrollY > (position || 100) && !scrolled);
    };
    window.addEventListener('scroll', handleScrolledClass);
    return () => {
      window.removeEventListener('scroll', handleScrolledClass);
    };
  }, []);
  return scrolled;
};
export default useScrolled;
