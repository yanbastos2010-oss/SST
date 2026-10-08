import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const DESKTOP_REDIRECT_URL = 'https://bretes.vercel.app/';

function isAIStudioPreview(): boolean {
  if (typeof window === 'undefined') return false;

  if (import.meta.env.DEV) return true;

  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }

  const hostname = window.location.hostname || '';
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('ais-dev-') ||
    hostname.startsWith('ais-pre-') ||
    hostname.includes('aistudio.google.com') ||
    hostname.includes('ai.studio')
  ) {
    return true;
  }

  const referrer = document.referrer || '';
  if (
    referrer.includes('aistudio.google.com') ||
    referrer.includes('ai.studio') ||
    referrer.includes('makersuite.google.com')
  ) {
    return true;
  }

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

  return false;
}

function isMobileOrTablet(): boolean {
  if (typeof navigator === 'undefined') return false;

  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData;
  if (uaData?.mobile === true) return true;

  const ua = navigator.userAgent || '';

  if (/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(ua)) {
    return true;
  }

  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) {
    return true;
  }

  return false;
}

function handleDesktopRedirect(): boolean {
  if (typeof window === 'undefined') return false;
  if (isAIStudioPreview() || isMobileOrTablet()) return false;

  try {
    const targetHost = new URL(DESKTOP_REDIRECT_URL).hostname;
    if (window.location.hostname === targetHost) return false;
  } catch {
    // ignore
  }

  const currentSearch = window.location.search || '';
  let targetUrl = DESKTOP_REDIRECT_URL;

  if (currentSearch) {
    const cleanSearch = currentSearch.startsWith('?') ? currentSearch.slice(1) : currentSearch;
    targetUrl += (targetUrl.includes('?') ? '&' : '?') + cleanSearch;
  }

  if (window.location.href !== targetUrl) {
    window.location.replace(targetUrl);
  }

  return true;
}

const redirected = handleDesktopRedirect();

if (!redirected) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}




