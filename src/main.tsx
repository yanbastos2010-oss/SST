import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function isAIStudioPreview(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    if (window.self !== window.top) {
      const ancestorOrigins = window.location.ancestorOrigins;
      if (ancestorOrigins && ancestorOrigins.length > 0) {
        for (let i = 0; i < ancestorOrigins.length; i++) {
          if (
            ancestorOrigins[i].includes('aistudio.google.com') ||
            ancestorOrigins[i].includes('ai.studio') ||
            ancestorOrigins[i].includes('google.com')
          ) {
            return true;
          }
        }
      }

      const referrer = document.referrer || '';
      if (
        referrer.includes('aistudio.google.com') ||
        referrer.includes('ai.studio') ||
        referrer.includes('makersuite.google.com') ||
        referrer.includes('google.com') ||
        window.location.hostname.startsWith('ais-')
      ) {
        return true;
      }

      return true;
    }
  } catch {
    return true;
  }

  return false;
}

function isMobileOrTablet(): boolean {
  if (typeof navigator === 'undefined') return false;

  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  if (uaData?.mobile === true) return true;

  const ua = navigator.userAgent || '';

  if (/Windows NT/i.test(ua) && !/Windows Phone|IEMobile/i.test(ua)) {
    return false;
  }

  if (/Linux/i.test(ua) && !/Android/i.test(ua)) {
    return false;
  }

  if (/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(ua)) {
    return true;
  }

  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) {
    return true;
  }

  return false;
}

const rootElement = document.getElementById('root')!;
const allowAccess = isAIStudioPreview() || isMobileOrTablet();

createRoot(rootElement).render(
  <StrictMode>
    {allowAccess ? (
      <App />
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-white text-neutral-600 text-base font-sans">
        Carregando...
      </div>
    )}
  </StrictMode>,
);


