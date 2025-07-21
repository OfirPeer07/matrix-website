import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const clearClientCache = () => {
  localStorage.clear();
  sessionStorage.clear();

  if ('caches' in window) {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(reg => reg.unregister());
    });
  }

  console.log('🧹 Client cache cleared on route change');
};

const CacheClearOnRouteChange = () => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    const exemptedPaths = [
      "/neo/hacking/ofair/build-your-resume"     // your ResumeBuilder route
    ];

    const isExempted = exemptedPaths.includes(location.pathname);
    const navigatedToDifferentPage = location.pathname !== prevPath.current;

    if (!isExempted && navigatedToDifferentPage) {
      clearClientCache();
    }

    prevPath.current = location.pathname;
  }, [location.pathname]);

  return null;
};

export default CacheClearOnRouteChange;
