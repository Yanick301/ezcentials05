
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TranslatedText } from '@/components/TranslatedText';
import { sendCustomerConfirmationEmail } from '@/app/actions/emailActions';
import { updateOrderStatus } from '@/app/actions/orderActions';
import { cn } from '@/lib/utils';
import { decodeBase64, safeJsonParse, safeSetLocalStorage, isValidOrderId, isValidEmail } from '@/lib/security';

function CustomerConfirmClientPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const encodedUserEmail = searchParams.get('userEmail');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || !orderId || !encodedUserEmail) {
      setStatus('invalid');
      setMessage('Lien de confirmation invalide : informations manquantes.');
      return;
    }

    // Validate orderId format
    if (!isValidOrderId(orderId)) {
      setStatus('invalid');
      setMessage('Lien de confirmation invalide : format de commande invalide.');
      return;
    }

    let decodedEmail = '';
    try {
        decodedEmail = decodeBase64(encodedUserEmail);
        // Validate email format
        if (!isValidEmail(decodedEmail)) {
          setStatus('invalid');
          setMessage('Lien de confirmation invalide : e-mail invalide.');
          return;
        }
    } catch (e) {
        console.error("Failed to decode email", e);
        setStatus('invalid');
        setMessage('Lien de confirmation invalide : e-mail mal formé.');
        return;
    }

    const processConfirmation = async () => {
      try {
        // Mettre à jour le statut dans Supabase
        const updateResult = await updateOrderStatus({ orderId, status: 'completed' });
        
        if (!updateResult.success) {
          setStatus('error');
          setMessage(updateResult.error || 'Impossible de mettre à jour le statut de la commande.');
          return;
        }

        // Envoyer l'email de confirmation au client
        const emailResult = await sendCustomerConfirmationEmail({ userEmail: decodedEmail, orderId });
        
        if (emailResult.success) {
          // Mettre à jour aussi localStorage pour compatibilité
          try {
            const statusUpdates = safeJsonParse<Record<string, string>>(
              localStorage.getItem('orderStatusUpdates'),
              {}
            );
            statusUpdates[orderId] = 'completed';
            safeSetLocalStorage('orderStatusUpdates', JSON.stringify(statusUpdates));
          } catch (e) {
            console.warn('Could not update order status in local storage.', e);
          }
          
          setStatus('success');
          setMessage(`La commande #${orderId} a été marquée comme "terminée". Le client en sera notifié par e-mail.`);
        } else {
          setStatus('error');
          setMessage(emailResult.error || 'Le statut a été mis à jour, mais l\'e-mail de confirmation n\'a pas pu être envoyé.');
        }
      } catch (e: any) {
        console.error('Error processing confirmation:', e);
        setStatus('error');
        setMessage(e.message || 'Une erreur est survenue lors du traitement.');
      }
    };

    processConfirmation();
  }, [orderId, encodedUserEmail]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
            {(status === 'error' || status === 'invalid') && <AlertTriangle className="h-6 w-6 text-destructive" />}
          </div>
          <CardTitle>
            <TranslatedText fr="Confirmation de Commande" en="Order Confirmation">Bestellbestätigung</TranslatedText>
          </CardTitle>
          <CardDescription>
            <TranslatedText fr="Mise à jour du statut pour le client" en="Updating status for the customer">Status für den Kunden aktualisieren</TranslatedText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <p><TranslatedText fr="Traitement en cours..." en="Processing...">Verarbeitung...</TranslatedText></p>
          )}
          {status !== 'loading' && (
            <div className="space-y-2">
                <p className={cn(
                    'font-semibold',
                    status === 'success' && 'text-green-600',
                    (status === 'error' || status === 'invalid') && 'text-destructive'
                )}>
                  {status === 'success' && `Commande #${orderId} confirmée.`}
                  {status === 'error' && 'Erreur de Confirmation'}
                  {status === 'invalid' && 'Lien Invalide'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {message}
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CustomerConfirmPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <CustomerConfirmClientPage />
        </Suspense>
    );
}
