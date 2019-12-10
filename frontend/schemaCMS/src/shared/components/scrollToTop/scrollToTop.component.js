import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop({ element = window }) {
  const { pathname } = useLocation();

  useEffect(() => {
    element.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
