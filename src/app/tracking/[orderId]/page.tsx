'use client';

import { useParams } from 'next/navigation';
import { useSupabase, useUser } from '@/supabase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TranslatedText } from '@/components/TranslatedText';
import { Loader2, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
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
  created_at: string;
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
    created_at: row.created_at,
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

  // Calculer la progression de livraison
  const calculateDeliveryProgress = () => {
    if (order.shipping_status === 'cancelled') {
      return { progress: 0, carPosition: 0 };
    }
    
    if (order.shipping_status === 'delivered') {
      return { progress: 100, carPosition: 100 };
    }
    
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    const daysSinceOrder = hoursSinceOrder / 24;
    
    // Durée estimée de livraison : 6 jours
    const estimatedDeliveryDays = 6;
    
    let progress = 0;
    let carPosition = 0;
    
    switch (order.shipping_status) {
      case 'preparing':
        // 0-25% : Préparation (0-1.5 jours)
        const preparingProgress = Math.min(1, daysSinceOrder / 1.5);
        progress = preparingProgress * 25;
        carPosition = progress * 0.3; // La voiture commence à bouger lentement
        break;
      case 'shipped':
        // 25-45% : Expédié (1.5-2.5 jours)
        const shippedDays = Math.max(0, daysSinceOrder - 1.5);
        const shippedProgress = Math.min(1, shippedDays / 1);
        progress = 25 + (shippedProgress * 20);
        carPosition = 7.5 + (shippedProgress * 12.5);
        break;
      case 'in_transit':
        // 45-95% : En transit (2.5-5.5 jours)
        const transitDays = Math.max(0, daysSinceOrder - 2.5);
        const transitProgress = Math.min(1, transitDays / 3);
        progress = 45 + (transitProgress * 50);
        carPosition = 20 + (transitProgress * 70);
        break;
    }
    
    // Si la commande est en cours depuis plus longtemps que prévu, on continue la progression
    if (daysSinceOrder > estimatedDeliveryDays && order.shipping_status !== 'delivered') {
      const extraDays = daysSinceOrder - estimatedDeliveryDays;
      const extraProgress = Math.min(5, extraDays * 2); // Max 5% supplémentaire
      progress = Math.min(95, progress + extraProgress);
      carPosition = Math.min(95, carPosition + extraProgress);
    }
    
    return { 
      progress: Math.min(100, Math.max(0, Math.round(progress))), 
      carPosition: Math.min(100, Math.max(0, carPosition)) 
    };
  };

  const { progress, carPosition } = calculateDeliveryProgress();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header avec animation d'entrée */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <Button asChild variant="ghost" className="mb-4 -ml-2 hover:bg-accent/50 transition-colors">
          <Link href="/account/orders" className="flex items-center gap-2">
            <span className="text-lg">←</span>
            <TranslatedText fr="Retour aux commandes" en="Back to orders">
              Zurück zu Bestellungen
            </TranslatedText>
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              <TranslatedText fr="Suivi de livraison" en="Delivery Tracking">
                Lieferverfolgung
              </TranslatedText>
            </h1>
            <p className="text-muted-foreground text-lg">
              <TranslatedText fr="Commande" en="Order">Bestellung</TranslatedText>{' '}
              <span className="font-mono font-semibold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
            </p>
          </div>
          <Badge 
            variant={getStatusVariant(order.shipping_status)} 
            className="hidden md:flex items-center gap-2 px-4 py-2 text-sm h-auto"
          >
            {getStatusIcon(order.shipping_status)}
            <TranslatedText
              fr={statusText.fr}
              en={statusText.en}
            >
              {statusText.de}
            </TranslatedText>
          </Badge>
        </div>
      </div>

      {/* Animation de suivi de livraison améliorée */}
      <Card className="mb-6 border-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <TranslatedText fr="Suivi en temps réel" en="Real-time tracking">
              Echtzeit-Verfolgung
            </TranslatedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Route avec design amélioré */}
            <div className="relative h-40 md:h-48 bg-gradient-to-br from-muted/80 via-muted/60 to-muted/80 rounded-xl overflow-hidden border border-border/50 shadow-inner">
              {/* Effet de profondeur */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
              
              {/* Ligne de route avec ombre */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-border/50 transform -translate-y-1/2 rounded-full shadow-sm">
                {/* Barre de progression avec gradient */}
                <div 
                  className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-[2000ms] ease-out rounded-full shadow-lg relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {/* Effet de brillance animé */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              
              {/* Points d'étapes améliorés */}
              {[
                { position: 0, label: { fr: 'Commande', en: 'Order', de: 'Bestellung' }, threshold: 0 },
                { position: 25, label: { fr: 'Expédié', en: 'Shipped', de: 'Versandt' }, threshold: 20 },
                { position: 66, label: { fr: 'En transit', en: 'In Transit', de: 'Unterwegs' }, threshold: 60 },
                { position: 100, label: { fr: 'Livré', en: 'Delivered', de: 'Geliefert' }, threshold: 100 },
              ].map((step, idx) => (
                <div 
                  key={idx}
                  className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500"
                  style={{ 
                    left: `${step.position}%`,
                    transform: `translate(-50%, -50%)`
                  }}
                >
                  {/* Point d'étape */}
                  <div className="relative">
                    <div 
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-500 ${
                        progress >= step.threshold 
                          ? 'bg-primary border-primary shadow-lg shadow-primary/50 scale-110' 
                          : 'bg-background border-muted-foreground/40 scale-100'
                      }`}
                    >
                      {progress >= step.threshold && (
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      )}
                    </div>
                    {/* Label */}
                    <div className={`absolute top-7 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center whitespace-nowrap transition-colors duration-500 ${
                      progress >= step.threshold ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}>
                      <TranslatedText fr={step.label.fr} en={step.label.en}>
                        {step.label.de}
                      </TranslatedText>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Voiture animée améliorée */}
              {order.shipping_status !== 'cancelled' && (
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-[2000ms] ease-out z-20"
                  style={{ left: `${carPosition}%` }}
                >
                  <div className="relative">
                    {/* Ombre de la voiture */}
                    <div 
                      className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/20 blur-sm rounded-full"
                      style={{ 
                        transform: `translate(-50%, 0) scale(${1 + Math.sin(Date.now() / 500) * 0.1})`
                      }}
                    />
                    {/* Voiture avec animation */}
                    <div className="relative transform transition-transform duration-300 hover:scale-110">
                      <Truck className="h-10 w-10 md:h-12 md:w-12 text-primary drop-shadow-2xl filter brightness-110" />
                      {/* Effet de mouvement */}
                      <div className="absolute inset-0 animate-pulse opacity-30">
                        <Truck className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                      </div>
                    </div>
                    {/* Badge de progression */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-primary-foreground/20 whitespace-nowrap backdrop-blur-sm">
                        {Math.round(progress)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Informations de progression améliorées */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                  <TranslatedText fr="Progression" en="Progress">Fortschritt</TranslatedText>
                </p>
                <p className="text-2xl font-bold text-foreground">{Math.round(progress)}%</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                  <TranslatedText fr="Statut" en="Status">Status</TranslatedText>
                </p>
                <p className="text-lg font-semibold text-foreground">
                  <TranslatedText
                    fr={statusText.fr}
                    en={statusText.en}
                  >
                    {statusText.de}
                  </TranslatedText>
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                  <TranslatedText fr="Commande" en="Order Date">Bestelldatum</TranslatedText>
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {format(new Date(order.created_at), 'PP', { locale })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              {getStatusIcon(order.shipping_status)}
            </div>
            <TranslatedText
              fr={statusText.fr}
              en={statusText.en}
            >
              {statusText.de}
            </TranslatedText>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {order.tracking_number && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                <TranslatedText fr="Numéro de suivi" en="Tracking Number">
                  Sendungsnummer
                </TranslatedText>
              </p>
              <p className="text-xl font-mono font-bold text-foreground tracking-wider">
                {order.tracking_number}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.shipped_at && (
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  <TranslatedText fr="Date d'expédition" en="Shipped Date">
                    Versanddatum
                  </TranslatedText>
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {format(new Date(order.shipped_at), 'PPpp', { locale })}
                </p>
              </div>
            )}

            {order.delivered_at && (
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  <TranslatedText fr="Date de livraison" en="Delivery Date">
                    Lieferdatum
                  </TranslatedText>
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {format(new Date(order.delivered_at), 'PPpp', { locale })}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                <TranslatedText fr="Adresse de livraison" en="Delivery Address">
                  Lieferadresse
                </TranslatedText>
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-semibold">{order.shipping_info.name}</span><br />
                {order.shipping_info.address}<br />
                {order.shipping_info.zip} {order.shipping_info.city}<br />
                <span className="font-medium">{order.shipping_info.country}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">
            <TranslatedText fr="Historique du statut" en="Status History">
              Statusverlauf
            </TranslatedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Ligne verticale de timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6 relative">
              {/* Étape: Préparation */}
              <div className="flex items-start gap-4 relative">
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                  order.shipping_status === 'preparing' 
                    ? 'bg-primary border-primary shadow-lg shadow-primary/50 scale-110' 
                    : 'bg-background border-muted-foreground'
                }`}>
                  <Package className={`h-5 w-5 transition-colors duration-500 ${
                    order.shipping_status === 'preparing' ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`} />
                  {order.shipping_status === 'preparing' && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold transition-colors duration-500 ${
                      order.shipping_status === 'preparing' ? 'text-primary' : 'text-foreground'
                    }`}>
                      <TranslatedText fr="En préparation" en="Preparing">
                        Wird vorbereitet
                      </TranslatedText>
                    </p>
                    {order.shipping_status === 'preparing' && (
                      <Badge variant="default" className="animate-in fade-in zoom-in duration-300">
                        <TranslatedText fr="Actuel" en="Current">Aktuell</TranslatedText>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <TranslatedText
                      fr="Votre commande est en cours de préparation"
                      en="Your order is being prepared"
                    >
                      Ihre Bestellung wird vorbereitet
                    </TranslatedText>
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {format(new Date(order.created_at), 'PP', { locale })}
                  </p>
                </div>
              </div>

              {/* Étape: Expédié */}
              {(order.shipping_status === 'shipped' || order.shipping_status === 'in_transit' || order.shipping_status === 'delivered') && (
                <div className="flex items-start gap-4 relative animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                    order.shipping_status === 'shipped' || order.shipping_status === 'in_transit'
                      ? 'bg-primary border-primary shadow-lg shadow-primary/50 scale-110' 
                      : 'bg-background border-primary/50'
                  }`}>
                    <Truck className={`h-5 w-5 transition-colors duration-500 ${
                      order.shipping_status === 'shipped' || order.shipping_status === 'in_transit'
                        ? 'text-primary-foreground' 
                        : 'text-primary'
                    }`} />
                    {(order.shipping_status === 'shipped' || order.shipping_status === 'in_transit') && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-semibold transition-colors duration-500 ${
                        order.shipping_status === 'shipped' || order.shipping_status === 'in_transit'
                          ? 'text-primary' 
                          : 'text-foreground'
                      }`}>
                        <TranslatedText fr="Expédié" en="Shipped">
                          Versandt
                        </TranslatedText>
                      </p>
                      {(order.shipping_status === 'shipped' || order.shipping_status === 'in_transit') && (
                        <Badge variant="default" className="animate-in fade-in zoom-in duration-300">
                          <TranslatedText fr="Actuel" en="Current">Aktuell</TranslatedText>
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {order.shipped_at ? (
                        format(new Date(order.shipped_at), 'PP', { locale })
                      ) : (
                        <TranslatedText fr="En transit" en="In transit">
                          Unterwegs
                        </TranslatedText>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Étape: Livré */}
              {order.shipping_status === 'delivered' && (
                <div className="flex items-start gap-4 relative animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-primary border-primary shadow-lg shadow-primary/50 scale-110">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-primary">
                        <TranslatedText fr="Livré" en="Delivered">
                          Geliefert
                        </TranslatedText>
                      </p>
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700 animate-in fade-in zoom-in duration-300">
                        <TranslatedText fr="Terminé" en="Completed">Abgeschlossen</TranslatedText>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {order.delivered_at ? (
                        format(new Date(order.delivered_at), 'PP', { locale })
                      ) : (
                        <TranslatedText fr="Livré avec succès" en="Delivered successfully">
                          Erfolgreich geliefert
                        </TranslatedText>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Étape: Annulé */}
              {order.shipping_status === 'cancelled' && (
                <div className="flex items-start gap-4 relative">
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 bg-destructive border-destructive shadow-lg">
                    <XCircle className="h-5 w-5 text-destructive-foreground" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-destructive mb-1">
                      <TranslatedText fr="Annulé" en="Cancelled">
                        Storniert
                      </TranslatedText>
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}















