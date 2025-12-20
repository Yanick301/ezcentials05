'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
          <AlertTriangle className="mb-4 h-16 w-16 text-destructive" />
          <h1 className="mb-2 font-headline text-2xl font-bold">
            <TranslatedText fr="Oups ! Quelque chose s'est mal passé" en="Oops! Something went wrong">
              Ups! Etwas ist schiefgelaufen
            </TranslatedText>
          </h1>
          <p className="mb-6 text-muted-foreground max-w-md">
            <TranslatedText 
              fr="Nous rencontrons une erreur inattendue. Veuillez réessayer ou retourner à la page d'accueil."
              en="We're experiencing an unexpected error. Please try again or return to the home page."
            >
              Wir erleben einen unerwarteten Fehler. Bitte versuchen Sie es erneut oder kehren Sie zur Startseite zurück.
            </TranslatedText>
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mb-6 rounded-md bg-destructive/10 p-4 text-left text-sm text-destructive max-w-2xl">
              <strong>Error:</strong> {this.state.error.message}
              {this.state.error.stack && (
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              <TranslatedText fr="Réessayer" en="Try Again">
                Erneut versuchen
              </TranslatedText>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                <TranslatedText fr="Retour à l'accueil" en="Back to Home">
                  Zur Startseite
                </TranslatedText>
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}







































