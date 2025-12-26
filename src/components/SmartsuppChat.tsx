'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    _smartsupp?: {
      key?: string;
    };
    smartsupp?: any;
  }
}

export function SmartsuppChat() {
  useEffect(() => {
    // Vérifier que nous sommes côté client
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Fonction pour initialiser Smartsupp
    const initSmartsupp = () => {
      // Vérifier si Smartsupp est déjà initialisé
      if (window.smartsupp) {
        return;
      }

      // Initialiser Smartsupp exactement comme dans le script fourni
      window._smartsupp = window._smartsupp || {};
      window._smartsupp.key = '73deeb9e22e9bc7276f5316b34659d885fe1b613';

      // Créer la fonction smartsupp et charger le script
      // Ceci suit exactement le format du script officiel Smartsupp
      (function(d: Document) {
        var s = d.getElementsByTagName('script')[0];
        var c = d.createElement('script');
        var o: any = function() {
          (o as any)._.push(arguments);
        };
        (o as any)._ = [];
        
        window.smartsupp = o;
        
        c.type = 'text/javascript';
        c.charset = 'utf-8';
        c.async = true;
        c.src = 'https://www.smartsuppchat.com/loader.js?';
        
        if (s && s.parentNode) {
          s.parentNode.insertBefore(c, s);
        } else {
          d.head.appendChild(c);
        }
      })(document);
    };

    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSmartsupp);
    } else {
      // Le DOM est déjà chargé, initialiser immédiatement
      initSmartsupp();
    }
  }, []);

  return null;
}


