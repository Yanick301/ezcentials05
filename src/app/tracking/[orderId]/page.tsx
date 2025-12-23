'use client';

import { useParams } from 'next/navigation';
import { useSupabase, useUser } from '@/supabase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TranslatedText } from '@/components/TranslatedText';
import { 
  Loader2, Package, Truck, CheckCircle, Clock, XCircle, MapPin, 
  Share2, Download, Mail, Calendar, ArrowLeft, Copy, Check
} from 'lucide-react';
import { format, addDays, differenceInDays, differenceInHours } from 'date-fns';
import { fr, de, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageContext';
import type { Database, Json } from '@/lib/supabase/database.types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import type { OrderItem } from '@/lib/types';

type OrderRow = Database['public']['Tables']['orders']['Row'];

interface Order {
  id: string;
  shipping_status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  items?: OrderItem[];
  total_amount?: number;
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
    items: (row.items as any) || [],
    total_amount: row.total_amount || 0,
    shipping_info: normalizeShippingInfo(row.shipping_info),
  };
}

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { supabase } = useSupabase();
  const { user } = useUser();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const calculateDeliveryProgress = () => {
    if (!order) return { progress: 0, carPosition: 0, estimatedDelivery: null };
    
    if (order.shipping_status === 'cancelled') {
      return { progress: 0, carPosition: 0, estimatedDelivery: null };
    }
    
    if (order.shipping_status === 'delivered') {
      return { progress: 100, carPosition: 100, estimatedDelivery: order.delivered_at };
    }
    
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const daysSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    const estimatedDeliveryDays = 6;
    const estimatedDelivery = addDays(orderDate, estimatedDeliveryDays);
    
    let progress = 0;
    let carPosition = 0;
    
    switch (order.shipping_status) {
      case 'preparing':
        const preparingProgress = Math.min(1, daysSinceOrder / 1.5);
        progress = preparingProgress * 25;
        carPosition = progress * 0.3;
        break;
      case 'shipped':
        const shippedDays = Math.max(0, daysSinceOrder - 1.5);
        const shippedProgress = Math.min(1, shippedDays / 1);
        progress = 25 + (shippedProgress * 20);
        carPosition = 7.5 + (shippedProgress * 12.5);
        break;
      case 'in_transit':
        const transitDays = Math.max(0, daysSinceOrder - 2.5);
        const transitProgress = Math.min(1, transitDays / 3);
        progress = 45 + (transitProgress * 50);
        carPosition = 20 + (transitProgress * 70);
        break;
    }
    
    if (daysSinceOrder > estimatedDeliveryDays && order.shipping_status !== 'delivered') {
      const extraDays = daysSinceOrder - estimatedDeliveryDays;
      const extraProgress = Math.min(5, extraDays * 2);
      progress = Math.min(95, progress + extraProgress);
      carPosition = Math.min(95, carPosition + extraProgress);
    }
    
    return { 
      progress: Math.min(100, Math.max(0, Math.round(progress))), 
      carPosition: Math.min(100, Math.max(0, carPosition)),
      estimatedDelivery: estimatedDelivery.toISOString()
    };
  };

  const { progress, carPosition, estimatedDelivery } = calculateDeliveryProgress();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Suivi de commande EZCENTIALS',
          text: `Suivez votre commande #${orderId.slice(0, 8)}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: <TranslatedText fr="Lien copié" en="Link copied">Link kopiert</TranslatedText>,
        description: <TranslatedText fr="Le lien a été copié dans le presse-papiers" en="Link copied to clipboard">Link in Zwischenablage kopiert</TranslatedText>,
      });
    }
  };

  const handleCopyTracking = () => {
    if (order?.tracking_number) {
      navigator.clipboard.writeText(order.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: <TranslatedText fr="Numéro copié" en="Number copied">Nummer kopiert</TranslatedText>,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">
            <TranslatedText fr="Chargement du suivi..." en="Loading tracking...">
              Verfolgung wird geladen...
            </TranslatedText>
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-destructive">
          <CardContent className="pt-6 text-center space-y-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <p className="text-lg font-medium">
              <TranslatedText fr="Commande introuvable" en="Order not found">
                Bestellung nicht gefunden
              </TranslatedText>
            </p>
            <p className="text-muted-foreground">
              <TranslatedText fr="Nous n'avons pas pu trouver cette commande." en="We couldn't find this order.">
                Wir konnten diese Bestellung nicht finden.
              </TranslatedText>
            </p>
            <Button asChild variant="outline">
              <Link href="/account/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <TranslatedText fr="Retour aux commandes" en="Back to orders">
                  Zurück zu Bestellungen
                </TranslatedText>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusText = getStatusText(order.shipping_status);
  const orderDate = new Date(order.created_at);
  const daysRemaining = estimatedDelivery ? differenceInDays(new Date(estimatedDelivery), new Date()) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-6 -ml-4">
            <Link href="/account/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <TranslatedText fr="Retour aux commandes" en="Back to orders">
                Zurück zu Bestellungen
              </TranslatedText>
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-headline text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                <TranslatedText fr="Suivi de livraison" en="Delivery Tracking">
                  Lieferverfolgung
                </TranslatedText>
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground">
                <p className="text-sm">
                  <TranslatedText fr="Commande" en="Order">Bestellung</TranslatedText> <span className="font-mono font-semibold text-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                </p>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-sm">
                  {format(orderDate, 'PP', { locale })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                <TranslatedText fr="Partager" en="Share">Teilen</TranslatedText>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`mailto:support@ezcentials.com?subject=Commande ${order.id.slice(0, 8)}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  <TranslatedText fr="Support" en="Support">Support</TranslatedText>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Animation de suivi améliorée */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <TranslatedText fr="Suivi en temps réel" en="Real-time tracking">
                      Echtzeit-Verfolgung
                    </TranslatedText>
                  </CardTitle>
                  <Badge variant={order.shipping_status === 'delivered' ? 'default' : 'secondary'} className="text-sm">
                    {Math.round(progress)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Route améliorée avec gradient */}
                  <div className="relative h-40 bg-gradient-to-br from-muted/50 via-muted/30 to-muted/50 rounded-xl overflow-hidden border border-border/50">
                    {/* Ligne de route avec ombre */}
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-border/50 transform -translate-y-1/2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${progress}%` }}
                      />
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
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20"
                        style={{ left: `${step.position}%` }}
                      >
                        <div className={`w-6 h-6 rounded-full border-3 transition-all duration-500 ${
                          progress >= step.threshold 
                            ? 'bg-primary border-primary shadow-lg shadow-primary/50 scale-110' 
                            : 'bg-background border-muted-foreground/30'
                        }`} />
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center whitespace-nowrap">
                          <TranslatedText fr={step.label.fr} en={step.label.en}>
                            {step.label.de}
                          </TranslatedText>
                        </div>
                      </div>
                    ))}
                    
                    {/* Voiture animée améliorée */}
                    {order.shipping_status !== 'cancelled' && (
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-out z-30"
                        style={{ left: `${carPosition}%` }}
                      >
                        <div className="relative">
                          <div className="relative animate-bounce-subtle">
                            <Truck className="h-10 w-10 text-primary drop-shadow-2xl filter brightness-110" />
                            <div className="absolute inset-0 animate-pulse opacity-30">
                              <Truck className="h-10 w-10 text-primary" />
                            </div>
                          </div>
                          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-primary/20 whitespace-nowrap">
                              {Math.round(progress)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Informations de progression améliorées */}
                  <div className="mt-8 grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        <TranslatedText fr="Progression" en="Progress">Fortschritt</TranslatedText>
                      </p>
                      <p className="text-3xl font-bold text-foreground">{Math.round(progress)}%</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        <TranslatedText fr="Statut actuel" en="Current Status">Aktueller Status</TranslatedText>
                      </p>
                      <Badge variant={order.shipping_status === 'delivered' ? 'default' : 'secondary'} className="text-base px-3 py-1">
                        <TranslatedText fr={statusText.fr} en={statusText.en}>
                          {statusText.de}
                        </TranslatedText>
                      </Badge>
                    </div>
                  </div>

                  {/* Estimation de livraison */}
                  {estimatedDelivery && order.shipping_status !== 'delivered' && (
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          <TranslatedText fr="Livraison estimée" en="Estimated delivery">Geschätzte Lieferung</TranslatedText>:
                        </span>
                        <span className="font-semibold text-primary">
                          {format(new Date(estimatedDelivery), 'EEEE d MMMM', { locale })}
                        </span>
                        {daysRemaining !== null && daysRemaining > 0 && (
                          <span className="text-muted-foreground ml-auto">
                            ({daysRemaining} <TranslatedText fr="jour(s)" en="day(s)">Tag(e)</TranslatedText>)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline verticale améliorée */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <TranslatedText fr="Historique du statut" en="Status History">
                    Statusverlauf
                  </TranslatedText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Ligne verticale */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                  
                  <div className="space-y-6">
                    {/* Étape 1: Préparation */}
                    <div className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                        order.shipping_status === 'preparing' 
                          ? 'bg-primary border-primary shadow-lg shadow-primary/30' 
                          : 'bg-background border-muted-foreground'
                      }`}>
                        <Package className={`h-6 w-6 ${
                          order.shipping_status === 'preparing' ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${
                            order.shipping_status === 'preparing' ? 'text-primary' : 'text-foreground'
                          }`}>
                            <TranslatedText fr="En préparation" en="Preparing">
                              Wird vorbereitet
                            </TranslatedText>
                          </p>
                          {order.shipping_status === 'preparing' && (
                            <Badge variant="secondary" className="animate-pulse">
                              <TranslatedText fr="En cours" en="In Progress">Läuft</TranslatedText>
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <TranslatedText fr="Votre commande est en cours de préparation dans notre entrepôt" en="Your order is being prepared in our warehouse">
                            Ihre Bestellung wird in unserem Lager vorbereitet
                          </TranslatedText>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(orderDate, 'PPp', { locale })}
                        </p>
                      </div>
                    </div>

                    {/* Étape 2: Expédié */}
                    {(order.shipping_status === 'shipped' || order.shipping_status === 'in_transit' || order.shipping_status === 'delivered') && (
                      <div className="relative flex items-start gap-4">
                        <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                          (order.shipping_status === 'shipped' || order.shipping_status === 'in_transit') 
                            ? 'bg-primary border-primary shadow-lg shadow-primary/30' 
                            : 'bg-background border-primary/50'
                        }`}>
                          <Truck className={`h-6 w-6 ${
                            (order.shipping_status === 'shipped' || order.shipping_status === 'in_transit') 
                              ? 'text-primary-foreground' 
                              : 'text-primary'
                          }`} />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-semibold ${
                              (order.shipping_status === 'shipped' || order.shipping_status === 'in_transit') 
                                ? 'text-primary' 
                                : 'text-foreground'
                            }`}>
                              <TranslatedText fr="Expédié" en="Shipped">
                                Versandt
                              </TranslatedText>
                            </p>
                            {(order.shipping_status === 'shipped' || order.shipping_status === 'in_transit') && (
                              <Badge variant="secondary" className="animate-pulse">
                                <TranslatedText fr="En cours" en="In Progress">Läuft</TranslatedText>
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.shipped_at ? (
                              <TranslatedText fr="Votre commande a été expédiée" en="Your order has been shipped">
                                Ihre Bestellung wurde versandt
                              </TranslatedText>
                            ) : (
                              <TranslatedText fr="En attente d'expédition" en="Awaiting shipment">
                                Warten auf Versand
                              </TranslatedText>
                            )}
                          </p>
                          {order.shipped_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(order.shipped_at), 'PPp', { locale })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Étape 3: Livré */}
                    {order.shipping_status === 'delivered' && (
                      <div className="relative flex items-start gap-4">
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-primary border-primary shadow-lg shadow-primary/30">
                          <CheckCircle className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-primary">
                              <TranslatedText fr="Livré" en="Delivered">
                                Geliefert
                              </TranslatedText>
                            </p>
                            <Badge className="bg-primary">
                              <TranslatedText fr="Terminé" en="Completed">Abgeschlossen</TranslatedText>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            <TranslatedText fr="Votre commande a été livrée avec succès" en="Your order has been delivered successfully">
                              Ihre Bestellung wurde erfolgreich geliefert
                            </TranslatedText>
                          </p>
                          {order.delivered_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(order.delivered_at), 'PPp', { locale })}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations de commande */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">
                  <TranslatedText fr="Informations" en="Information">Informationen</TranslatedText>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.tracking_number && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-muted-foreground">
                      <TranslatedText fr="Numéro de suivi" en="Tracking Number">
                        Sendungsnummer
                      </TranslatedText>
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-mono font-semibold flex-1">{order.tracking_number}</p>
                      <Button variant="ghost" size="icon" onClick={handleCopyTracking}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    <TranslatedText fr="Adresse de livraison" en="Delivery Address">
                      Lieferadresse
                    </TranslatedText>
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.shipping_info.name}</p>
                    <p className="text-muted-foreground">{order.shipping_info.address}</p>
                    <p className="text-muted-foreground">
                      {order.shipping_info.zip} {order.shipping_info.city}
                    </p>
                    <p className="text-muted-foreground">{order.shipping_info.country}</p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                    <Link href={`https://maps.google.com/?q=${encodeURIComponent(`${order.shipping_info.address}, ${order.shipping_info.city}, ${order.shipping_info.country}`)}`} target="_blank">
                      <MapPin className="h-4 w-4 mr-2" />
                      <TranslatedText fr="Voir sur la carte" en="View on map">Auf Karte anzeigen</TranslatedText>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Articles de la commande */}
            {order.items && order.items.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <TranslatedText fr="Articles" en="Items">Artikel</TranslatedText>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          <Image
                            src={`/images/products/${item.image}`}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">
                            <TranslatedText fr={item.name_fr} en={item.name_en}>
                              {item.name}
                            </TranslatedText>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.quantity}x • €{item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.total_amount && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          <TranslatedText fr="Total" en="Total">Gesamt</TranslatedText>
                        </span>
                        <span className="font-bold text-lg">€{order.total_amount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
