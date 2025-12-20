'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabase, useUser } from '@/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TranslatedText } from '@/components/TranslatedText';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Ban,
  Loader2,
  ShoppingBag,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr, de, enUS } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Database, Json } from '@/lib/supabase/database.types';
import type { OrderItem } from '@/lib/types';

type OrderRow = Database['public']['Tables']['orders']['Row'];

type ShippingInfo = {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};

interface Order extends Omit<OrderRow, 'shipping_info' | 'items'> {
  shipping_info: ShippingInfo;
  items: OrderItem[];
}

function normalizeShippingInfo(value: Json): ShippingInfo {
  const v = (value && typeof value === 'object' && !Array.isArray(value)) ? (value as any) : {};
  return {
    name: typeof v.name === 'string' ? v.name : '',
    email: typeof v.email === 'string' ? v.email : '',
    address: typeof v.address === 'string' ? v.address : '',
    city: typeof v.city === 'string' ? v.city : '',
    zip: typeof v.zip === 'string' ? v.zip : '',
    country: typeof v.country === 'string' ? v.country : '',
  };
}

function normalizeItems(value: Json): OrderItem[] {
  if (!Array.isArray(value)) return [];
  return value as any as OrderItem[];
}

function normalizeOrder(row: OrderRow): Order {
  return {
    ...row,
    shipping_info: normalizeShippingInfo(row.shipping_info),
    items: normalizeItems(row.items),
  };
}

export default function AdminOrdersPage() {
  const { supabase } = useSupabase();
  const { user, profile } = useUser();
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (user && profile) {
      if (!profile.isAdmin) {
        toast({
          variant: 'destructive',
          title: <TranslatedText fr="Accès refusé" en="Access Denied">Zugriff verweigert</TranslatedText>,
          description: <TranslatedText fr="Vous devez être administrateur pour accéder à cette page." en="You must be an administrator to access this page.">Sie müssen Administrator sein, um auf diese Seite zuzugreifen.</TranslatedText>,
        });
        router.push('/account');
      }
    }
  }, [user, profile, router, toast]);

  // Charger les commandes
  const fetchOrders = useCallback(async () => {
    if (!supabase) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          variant: 'destructive',
          title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
          description: error.message,
        });
        return;
      }

      const rows = (data || []) as unknown as OrderRow[];
      setOrders(rows.map(normalizeOrder));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    if (user && profile?.isAdmin) {
      fetchOrders();

      // S'abonner aux changements en temps réel
      const channel = supabase
        ?.channel('orders_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
          },
          () => {
            fetchOrders();
          }
        )
        .subscribe();

      return () => {
        supabase?.removeChannel(channel);
      };
    }
  }, [user, profile, fetchOrders, supabase]);

  // Confirmer une commande
  const handleConfirmOrder = async (order: Order) => {
    if (!supabase) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'completed' } as Database['public']['Tables']['orders']['Update'])
        .eq('id', order.id);

      if (error) {
        throw error;
      }

      toast({
        title: <TranslatedText fr="Commande confirmée" en="Order Confirmed">Bestellung bestätigt</TranslatedText>,
        description: <TranslatedText fr="Le statut de la commande a été mis à jour." en="The order status has been updated.">Der Bestellstatus wurde aktualisiert.</TranslatedText>,
      });

      setSelectedOrder(null);
      setActionType(null);
      fetchOrders();
    } catch (error: any) {
      console.error('Error confirming order:', error);
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Rejeter une commande
  const handleRejectOrder = async (order: Order) => {
    if (!supabase) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'rejected' } as Database['public']['Tables']['orders']['Update'])
        .eq('id', order.id);

      if (error) {
        throw error;
      }

      toast({
        title: <TranslatedText fr="Commande rejetée" en="Order Rejected">Bestellung abgelehnt</TranslatedText>,
        description: <TranslatedText fr="Le statut de la commande a été mis à jour." en="The order status has been updated.">Der Bestellstatus wurde aktualisiert.</TranslatedText>,
      });

      setSelectedOrder(null);
      setActionType(null);
      fetchOrders();
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'processing':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: {
        fr: 'En attente',
        en: 'Pending',
        de: 'Ausstehend',
      },
      processing: {
        fr: 'En traitement',
        en: 'Processing',
        de: 'In Bearbeitung',
      },
      completed: {
        fr: 'Terminé',
        en: 'Completed',
        de: 'Abgeschlossen',
      },
      rejected: {
        fr: 'Rejeté',
        en: 'Rejected',
        de: 'Abgelehnt',
      },
    };

    const statusTexts = texts[status as keyof typeof texts] || texts.pending;
    return language === 'fr' ? statusTexts.fr : language === 'en' ? statusTexts.en : statusTexts.de;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="mr-2 h-4 w-4" />;
      case 'processing':
        return <Clock className="mr-2 h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="mr-2 h-4 w-4" />;
      case 'rejected':
        return <Ban className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!user || !profile?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline text-3xl">
          <TranslatedText fr="Gestion des commandes" en="Order Management">
            Bestellverwaltung
          </TranslatedText>
        </h1>
        <Badge variant="outline" className="text-sm">
          {orders.length}{' '}
          <TranslatedText fr="commandes" en="orders">Bestellungen</TranslatedText>
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">
              <TranslatedText fr="Aucune commande" en="No orders">Keine Bestellungen</TranslatedText>
            </h3>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <TranslatedText
                        fr={`Commande du ${format(new Date(order.order_date), 'PPP', { locale: fr })}`}
                        en={`Order of ${format(new Date(order.order_date), 'PPP', { locale: enUS })}`}
                      >
                        Bestellung vom {format(new Date(order.order_date), 'PPP', { locale: de })}
                      </TranslatedText>
                    </CardTitle>
                    <CardDescription>
                      <TranslatedText fr="ID" en="ID">ID</TranslatedText>: {order.id}
                      <br />
                      <TranslatedText fr="Client" en="Customer">Kunde</TranslatedText>: {order.shipping_info.name} ({order.shipping_info.email})
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusVariant(order.payment_status)} className="flex items-center">
                    {getStatusIcon(order.payment_status)}
                    {getStatusText(order.payment_status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Articles */}
                  <div className="rounded-md border p-4">
                    <h4 className="mb-2 font-semibold">
                      <TranslatedText fr="Articles" en="Items">Artikel</TranslatedText>
                    </h4>
                    <ul className="divide-y">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between py-2 text-sm">
                          <span>
                            {item.quantity} x{' '}
                            <TranslatedText fr={item.name_fr} en={item.name_en}>
                              {item.name}
                            </TranslatedText>
                          </span>
                          <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>
                          <TranslatedText fr="Total" en="Total">Gesamt</TranslatedText>
                        </span>
                        <span className="font-semibold">€{order.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Adresse de livraison */}
                  <div className="rounded-md border p-4">
                    <h4 className="mb-2 font-semibold">
                      <TranslatedText fr="Adresse de livraison" en="Shipping Address">Lieferadresse</TranslatedText>
                    </h4>
                    <p className="text-sm">
                      {order.shipping_info.name}
                      <br />
                      {order.shipping_info.address}
                      <br />
                      {order.shipping_info.zip} {order.shipping_info.city}
                      <br />
                      {order.shipping_info.country}
                    </p>
                  </div>

                  {/* Actions */}
                  {order.payment_status === 'pending' || order.payment_status === 'processing' ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setActionType('confirm');
                        }}
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <TranslatedText fr="Confirmer" en="Confirm">Bestätigen</TranslatedText>
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setActionType('reject');
                        }}
                        variant="destructive"
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        <TranslatedText fr="Rejeter" en="Reject">Ablehnen</TranslatedText>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de confirmation */}
      <AlertDialog open={!!selectedOrder && !!actionType} onOpenChange={(open) => {
        if (!open) {
          setSelectedOrder(null);
          setActionType(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'confirm' ? (
                <TranslatedText fr="Confirmer la commande" en="Confirm Order">Bestellung bestätigen</TranslatedText>
              ) : (
                <TranslatedText fr="Rejeter la commande" en="Reject Order">Bestellung ablehnen</TranslatedText>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'confirm' ? (
                <TranslatedText
                  fr="Êtes-vous sûr de vouloir confirmer cette commande ? Le client sera notifié."
                  en="Are you sure you want to confirm this order? The customer will be notified."
                >
                  Möchten Sie diese Bestellung wirklich bestätigen? Der Kunde wird benachrichtigt.
                </TranslatedText>
              ) : (
                <TranslatedText
                  fr="Êtes-vous sûr de vouloir rejeter cette commande ? Le client sera notifié."
                  en="Are you sure you want to reject this order? The customer will be notified."
                >
                  Möchten Sie diese Bestellung wirklich ablehnen? Der Kunde wird benachrichtigt.
                </TranslatedText>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              <TranslatedText fr="Annuler" en="Cancel">Abbrechen</TranslatedText>
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedOrder) {
                  if (actionType === 'confirm') {
                    handleConfirmOrder(selectedOrder);
                  } else if (actionType === 'reject') {
                    handleRejectOrder(selectedOrder);
                  }
                }
              }}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {actionType === 'confirm' ? (
                <TranslatedText fr="Confirmer" en="Confirm">Bestätigen</TranslatedText>
              ) : (
                <TranslatedText fr="Rejeter" en="Reject">Ablehnen</TranslatedText>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}






