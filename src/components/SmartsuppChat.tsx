'use client';

import { useEffect } from 'react';

export function SmartsuppChat() {
  useEffect(() => {
    // Initialiser Smartsupp
    if (typeof window !== 'undefined') {
      (window as any)._smartsupp = (window as any)._smartsupp || {};
      (window as any)._smartsupp.key = '73deeb9e22e9bc7276f5316b34659d885fe1b613';
      
      // Charger le script Smartsupp
      if (!(window as any).smartsupp) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.async = true;
        script.src = 'https://www.smartsuppchat.com/loader.js?';
        
        const firstScript = document.getElementsByTagName('script')[0];
        if (firstScript && firstScript.parentNode) {
          firstScript.parentNode.insertBefore(script, firstScript);
        } else {
          document.head.appendChild(script);
        }
      }
    }
  }, []);

  return null;
}

