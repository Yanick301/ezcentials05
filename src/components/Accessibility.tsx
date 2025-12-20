'use client';

import { useEffect } from 'react';

/**
 * Composant pour améliorer l'accessibilité du site
 * Gère la navigation au clavier, les focus visible, etc.
 */
export function AccessibilityEnhancer() {
  useEffect(() => {
    // Améliorer la navigation au clavier
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content avec 'M' (si pas déjà dans un input)
      if (e.key === 'm' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Améliorer les focus visible
    const style = document.createElement('style');
    style.textContent = `
      /* Améliorer la visibilité du focus pour l'accessibilité */
      *:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
        border-radius: 4px;
      }
      
      /* S'assurer que les liens sont accessibles au clavier */
      a:focus-visible,
      button:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 2px;
      }
      
      /* Améliorer le contraste pour les textes */
      .text-muted-foreground {
        color: hsl(var(--muted-foreground));
      }
    `;
    document.head.appendChild(style);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

/**
 * Hook pour gérer l'accessibilité des modales et dialogs
 */
export function useAccessibleDialog() {
  useEffect(() => {
    // Fermer les dialogs avec Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const dialogs = document.querySelectorAll('[role="dialog"]');
        const lastDialog = dialogs[dialogs.length - 1] as HTMLElement;
        if (lastDialog) {
          const closeButton = lastDialog.querySelector('[data-dialog-close]') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
}

/**
 * Composant pour ajouter des attributs ARIA manquants
 */
export function AriaEnhancer({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}















