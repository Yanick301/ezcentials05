
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TranslatedText } from '@/components/TranslatedText';
import { sendCustomerRejectionEmail } from '@/app/actions/emailActions';
import { cn } from '@/lib/utils';


function CustomerRejectClientPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const encodedUserEmail = searchParams.get('userEmail');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [message, setMessage] = useState('');


  useEffect(() => {
    if (typeof window === 'undefined' || !orderId || !encodedUserEmail) {
      setStatus('invalid');
      setMessage('Lien de rejet invalide : informations manquantes.');
      return;
    }

    let decodedEmail = '';
    try {
        decodedEmail = Buffer.from(encodedUserEmail, 'base64').toString('utf-8');
    } catch (e) {
        console.error("Failed to decode email", e);
        setStatus('invalid');
        setMessage('Lien de rejet invalide : e-mail mal formé.');
        return;
    }

    const processRejection = async () => {
      try {
        const result = await sendCustomerRejectionEmail({ userEmail: decodedEmail, orderId });
        
        if (result.success) {
          try {
            const statusUpdates = JSON.parse(localStorage.getItem('orderStatusUpdates') || '{}');
            statusUpdates[orderId] = 'rejected';
            localStorage.setItem('orderStatusUpdates', JSON.stringify(statusUpdates));
            setStatus('success');
            setMessage(`La commande #${orderId} a été marquée comme "rejetée". Le client en sera notifié par e-mail.`);
          } catch (e) {
            console.warn('Could not update order status in local storage.', e);
            setStatus('error');
            setMessage('L\'e-mail a été envoyé, mais le statut local n\'a pas pu être mis à jour.');
          }
        } else {
          setStatus('error');
          setMessage(result.error || 'Échec de l\'envoi de l\'e-mail de rejet.');
        }
      } catch (e: any) {
        console.error('Error processing rejection:', e);
        setStatus('error');
        setMessage(e.message || 'Une erreur est survenue lors du traitement.');
      }
    };
    
    processRejection();
  }, [orderId, encodedUserEmail]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === 'success' && <XCircle className="h-6 w-6" />}
            {(status === 'error' || status === 'invalid') && <AlertTriangle className="h-6 w-6" />}
          </div>
          <CardTitle>
            <TranslatedText fr="Rejet de Commande" en="Order Rejection">Bestellablehnung</TranslatedText>
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
                    status === 'success' && 'text-destructive',
                    (status === 'error' || status === 'invalid') && 'text-destructive'
                )}>
                  {status === 'success' && `Commande #${orderId} rejetée.`}
                  {status === 'error' && 'Erreur de Rejet'}
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

export default function CustomerRejectPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <CustomerRejectClientPage />
        </Suspense>
    );
}
