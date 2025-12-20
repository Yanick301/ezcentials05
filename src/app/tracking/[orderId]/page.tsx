'use client';

import { useParams } from 'next/navigation';
import { useSupabase, useUser } from '@/supabase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TranslatedText } from '@/components/TranslatedText';
import { Loader2, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr, de, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageContext';
import type { Database, Json } from '@/lib/supabase/database.types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type OrderRow = Database['public']['Tables']['orders']['Row'];

interface Order {
  id: string;
  shipping_status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping_info: {
    name: string;
    address: string;
    city: string;
    zip: string;
    country: string;
  };
}

function normalizeShippingInfo(value: Json): Order['shipping_info'] {
  const v = (value && typeof value === 'object' && !Array.isArray(value)) ? (value as any) : {};
  return {
    name: typeof v.name === 'string' ? v.name : '',
    address: typeof v.address === 'string' ? v.address : '',
    city: typeof v.city === 'string' ? v.city : '',
    zip: typeof v.zip === 'string' ? v.zip : '',
    country: typeof v.country === 'string' ? v.country : '',
  };
}

function normalizeOrder(row: OrderRow): Order {
  return {
    id: row.id,
    shipping_status: (row.shipping_status as Order['shipping_status']) || 'preparing',
    tracking_number: row.tracking_number,
    shipped_at: row.shipped_at,
    delivered_at: row.delivered_at,
    shipping_info: normalizeShippingInfo(row.shipping_info),
  };
}

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { supabase } = useSupabase();
  const { user } = useUser();
  const { language } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locale = language === 'fr' ? fr : language === 'en' ? enUS : de;

  useEffect(() => {
    if (!supabase || !orderId) return;

    const fetchOrder = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Order not found');
          setIsLoading(false);
          return;
        }

        // Vérifier que l'utilisateur est propriétaire de la commande
        if (user && data.user_id !== user.id) {
          setError('Unauthorized');
          setIsLoading(false);
          return;
        }

        setOrder(normalizeOrder(data));
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(normalizeOrder(payload.new as OrderRow));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, orderId, user]);

  const getStatusIcon = (status: Order['shipping_status']) => {
    switch (status) {
      case 'preparing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: Order['shipping_status']) => {
    switch (status) {
      case 'preparing':
        return {
          de: 'Wird vorbereitet',
          fr: 'En préparation',
          en: 'Preparing',
        };
      case 'shipped':
        return {
          de: 'Versandt',
          fr: 'Expédié',
          en: 'Shipped',
        };
      case 'in_transit':
        return {
          de: 'Unterwegs',
          fr: 'En transit',
          en: 'In Transit',
        };
      case 'delivered':
        return {
          de: 'Geliefert',
          fr: 'Livré',
          en: 'Delivered',
        };
      case 'cancelled':
        return {
          de: 'Storniert',
          fr: 'Annulé',
          en: 'Cancelled',
        };
    }
  };

  const getStatusVariant = (status: Order['shipping_status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'shipped':
      case 'in_transit':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          <TranslatedText fr="Commande introuvable" en="Order not found">
            Bestellung nicht gefunden
          </TranslatedText>
        </p>
        <Button asChild variant="outline">
          <Link href="/account/orders">
            <TranslatedText fr="Retour aux commandes" en="Back to orders">
              Zurück zu Bestellungen
            </TranslatedText>
          </Link>
        </Button>
      </div>
    );
  }

  const statusText = getStatusText(order.shipping_status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/account/orders">
            ← <TranslatedText fr="Retour aux commandes" en="Back to orders">
              Zurück zu Bestellungen
            </TranslatedText>
          </Link>
        </Button>
        <h1 className="font-headline text-3xl mb-2">
          <TranslatedText fr="Suivi de livraison" en="Delivery Tracking">
            Lieferverfolgung
          </TranslatedText>
        </h1>
        <p className="text-muted-foreground">
          <TranslatedText fr="Commande" en="Order">Bestellung</TranslatedText> #{order.id.slice(0, 8)}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(order.shipping_status)}
            <TranslatedText
              fr={statusText.fr}
              en={statusText.en}
            >
              {statusText.de}
            </TranslatedText>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.tracking_number && (
            <div>
              <p className="text-sm font-medium mb-1">
                <TranslatedText fr="Numéro de suivi" en="Tracking Number">
                  Sendungsnummer
                </TranslatedText>
              </p>
              <p className="text-lg font-mono">{order.tracking_number}</p>
            </div>
          )}

          {order.shipped_at && (
            <div>
              <p className="text-sm font-medium mb-1">
                <TranslatedText fr="Date d'expédition" en="Shipped Date">
                  Versanddatum
                </TranslatedText>
              </p>
              <p>{format(new Date(order.shipped_at), 'PPpp', { locale })}</p>
            </div>
          )}

          {order.delivered_at && (
            <div>
              <p className="text-sm font-medium mb-1">
                <TranslatedText fr="Date de livraison" en="Delivery Date">
                  Lieferdatum
                </TranslatedText>
              </p>
              <p>{format(new Date(order.delivered_at), 'PPpp', { locale })}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">
              <TranslatedText fr="Adresse de livraison" en="Delivery Address">
                Lieferadresse
              </TranslatedText>
            </p>
            <p className="text-sm">
              {order.shipping_info.name}<br />
              {order.shipping_info.address}<br />
              {order.shipping_info.zip} {order.shipping_info.city}<br />
              {order.shipping_info.country}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatedText fr="Historique du statut" en="Status History">
              Statusverlauf
            </TranslatedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className={`mt-1 ${order.shipping_status === 'preparing' ? 'text-primary' : 'text-muted-foreground'}`}>
                <Package className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  <TranslatedText fr="En préparation" en="Preparing">
                    Wird vorbereitet
                  </TranslatedText>
                </p>
                <p className="text-sm text-muted-foreground">
                  <TranslatedText
                    fr="Votre commande est en cours de préparation"
                    en="Your order is being prepared"
                  >
                    Ihre Bestellung wird vorbereitet
                  </TranslatedText>
                </p>
              </div>
              {order.shipping_status === 'preparing' && (
                <Badge variant="secondary">
                  <TranslatedText fr="Actuel" en="Current">Aktuell</TranslatedText>
                </Badge>
              )}
            </div>

            {(order.shipping_status === 'shipped' || order.shipping_status === 'in_transit' || order.shipping_status === 'delivered') && (
              <div className="flex items-start gap-4">
                <div className={`mt-1 ${order.shipping_status === 'shipped' || order.shipping_status === 'in_transit' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <Truck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    <TranslatedText fr="Expédié" en="Shipped">
                      Versandt
                    </TranslatedText>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipped_at
                      ? format(new Date(order.shipped_at), 'PP', { locale })
                      : <TranslatedText fr="En transit" en="In transit">
                          Unterwegs
                        </TranslatedText>}
                  </p>
                </div>
                {(order.shipping_status === 'shipped' || order.shipping_status === 'in_transit') && (
                  <Badge variant="secondary">
                    <TranslatedText fr="Actuel" en="Current">Aktuell</TranslatedText>
                  </Badge>
                )}
              </div>
            )}

            {order.shipping_status === 'delivered' && (
              <div className="flex items-start gap-4">
                <div className="mt-1 text-primary">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    <TranslatedText fr="Livré" en="Delivered">
                      Geliefert
                    </TranslatedText>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivered_at
                      ? format(new Date(order.delivered_at), 'PP', { locale })
                      : <TranslatedText fr="Livré avec succès" en="Delivered successfully">
                          Erfolgreich geliefert
                        </TranslatedText>}
                  </p>
                </div>
                <Badge>
                  <TranslatedText fr="Terminé" en="Completed">Abgeschlossen</TranslatedText>
                </Badge>
              </div>
            )}

            {order.shipping_status === 'cancelled' && (
              <div className="flex items-start gap-4">
                <div className="mt-1 text-destructive">
                  <XCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-destructive">
                    <TranslatedText fr="Annulé" en="Cancelled">
                      Storniert
                    </TranslatedText>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <TranslatedText
                      fr="Cette commande a été annulée"
                      en="This order has been cancelled"
                    >
                      Diese Bestellung wurde storniert
                    </TranslatedText>
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}















