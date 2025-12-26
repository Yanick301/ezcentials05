'use client';

import { useSupabase, useUser } from '@/supabase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TranslatedText } from '@/components/TranslatedText';
import { Loader2, ShoppingBag, Users, Package, TrendingUp, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
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
import { updateOrderStatus } from '@/app/actions/orderActions';
import { sendCustomerConfirmationEmail, sendCustomerRejectionEmail } from '@/app/actions/emailActions';
import type { Database, Json } from '@/lib/supabase/database.types';

type OrderRow = Database['public']['Tables']['orders']['Row'];

interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
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

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: OrderRow[];
}

export default function AdminDashboardPage() {
  const { supabase } = useSupabase();
  const { user, profile } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'reject' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user && profile) {
      if (!profile.isAdmin) {
        toast({
          variant: 'destructive',
          title: <TranslatedText fr="Accès refusé" en="Access Denied">Zugriff verweigert</TranslatedText>,
          description: <TranslatedText fr="Vous devez être administrateur pour accéder à cette page." en="You must be an administrator to access this page.">Sie müssen Administrator sein, um auf diese Seite zuzugreifen.</TranslatedText>,
        });
        router.push('/');
        return;
      }
    }
  }, [user, profile, router, toast]);

  useEffect(() => {
    if (!supabase || !user || !profile?.isAdmin) return;

    const fetchStats = async () => {
      try {
        // Récupérer les statistiques
        const [ordersResult, usersResult, productsResult] = await Promise.all([
          supabase.from('orders').select('*'),
          supabase.from('user_profiles').select('id'),
          supabase.from('products').select('id'),
        ]);

        if (ordersResult.error) throw ordersResult.error;
        if (usersResult.error) throw usersResult.error;
        if (productsResult.error) throw productsResult.error;

        const orders = ordersResult.data || [];
        const totalRevenue = orders
          .filter((o: OrderRow) => o.payment_status === 'completed')
          .reduce((sum: number, o: OrderRow) => sum + Number(o.total_amount), 0);

        const pendingOrders = orders.filter((o: OrderRow) => o.payment_status === 'pending' || o.payment_status === 'processing').length;
        const completedOrders = orders.filter((o: OrderRow) => o.payment_status === 'completed').length;

        const recentOrders = orders
          .sort((a: OrderRow, b: OrderRow) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 5);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalUsers: usersResult.data?.length || 0,
          totalProducts: productsResult.data?.length || 0,
          pendingOrders,
          completedOrders,
          recentOrders,
        });
      } catch (error: any) {
        console.error('Error fetching stats:', error);
        toast({
          variant: 'destructive',
          title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
          description: error.message || <TranslatedText fr="Impossible de charger les statistiques." en="Could not load statistics.">Statistiken konnten nicht geladen werden.</TranslatedText>,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [supabase, user, profile, toast]);

  // Confirmer une commande
  const handleConfirmOrder = async (order: OrderRow) => {
    setIsProcessing(true);
    try {
      // Mettre à jour le statut dans Supabase
      const updateResult = await updateOrderStatus({ 
        orderId: order.id, 
        status: 'completed' 
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Impossible de mettre à jour le statut de la commande.');
      }

      // Récupérer l'email du client depuis les informations de livraison
      const shippingInfo = normalizeShippingInfo(order.shipping_info);
      const userEmail = shippingInfo.email;

      // Envoyer l'email de confirmation au client
      if (userEmail) {
        const emailResult = await sendCustomerConfirmationEmail({ 
          userEmail, 
          orderId: order.id 
        });

        if (!emailResult.success) {
          console.warn('Email de confirmation non envoyé:', emailResult.error);
        }
      }

      toast({
        title: <TranslatedText fr="Commande confirmée" en="Order Confirmed">Bestellung bestätigt</TranslatedText>,
        description: <TranslatedText fr="Le statut de la commande a été mis à jour et le client a été notifié." en="The order status has been updated and the customer has been notified.">Der Bestellstatus wurde aktualisiert und der Kunde wurde benachrichtigt.</TranslatedText>,
      });

      setSelectedOrder(null);
      setActionType(null);
      
      // Rafraîchir les statistiques
      if (supabase && user && profile?.isAdmin) {
        const [ordersResult] = await Promise.all([
          supabase.from('orders').select('*'),
        ]);
        if (!ordersResult.error) {
          const orders = ordersResult.data || [];
          const totalRevenue = orders
            .filter((o: OrderRow) => o.payment_status === 'completed')
            .reduce((sum: number, o: OrderRow) => sum + Number(o.total_amount), 0);
          const pendingOrders = orders.filter((o: OrderRow) => o.payment_status === 'pending' || o.payment_status === 'processing').length;
          const completedOrders = orders.filter((o: OrderRow) => o.payment_status === 'completed').length;
          const recentOrders = orders
            .sort((a: OrderRow, b: OrderRow) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 5);
          setStats(prev => prev ? {
            ...prev,
            totalRevenue,
            pendingOrders,
            completedOrders,
            recentOrders,
          } : null);
        }
      }
    } catch (error: any) {
      console.error('Error confirming order:', error);
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
        description: error.message || <TranslatedText fr="Impossible de confirmer la commande." en="Could not confirm the order.">Die Bestellung konnte nicht bestätigt werden.</TranslatedText>,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Rejeter une commande
  const handleRejectOrder = async (order: OrderRow) => {
    setIsProcessing(true);
    try {
      // Mettre à jour le statut dans Supabase
      const updateResult = await updateOrderStatus({ 
        orderId: order.id, 
        status: 'rejected' 
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Impossible de mettre à jour le statut de la commande.');
      }

      // Récupérer l'email du client depuis les informations de livraison
      const shippingInfo = normalizeShippingInfo(order.shipping_info);
      const userEmail = shippingInfo.email;

      // Envoyer l'email de rejet au client
      if (userEmail) {
        const emailResult = await sendCustomerRejectionEmail({ 
          userEmail, 
          orderId: order.id 
        });

        if (!emailResult.success) {
          console.warn('Email de rejet non envoyé:', emailResult.error);
        }
      }

      toast({
        title: <TranslatedText fr="Commande rejetée" en="Order Rejected">Bestellung abgelehnt</TranslatedText>,
        description: <TranslatedText fr="Le statut de la commande a été mis à jour et le client a été notifié." en="The order status has been updated and the customer has been notified.">Der Bestellstatus wurde aktualisiert und der Kunde wurde benachrichtigt.</TranslatedText>,
      });

      setSelectedOrder(null);
      setActionType(null);
      
      // Rafraîchir les statistiques
      if (supabase && user && profile?.isAdmin) {
        const [ordersResult] = await Promise.all([
          supabase.from('orders').select('*'),
        ]);
        if (!ordersResult.error) {
          const orders = ordersResult.data || [];
          const pendingOrders = orders.filter((o: OrderRow) => o.payment_status === 'pending' || o.payment_status === 'processing').length;
          const completedOrders = orders.filter((o: OrderRow) => o.payment_status === 'completed').length;
          const recentOrders = orders
            .sort((a: OrderRow, b: OrderRow) => 
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
            .slice(0, 5);
          setStats(prev => prev ? {
            ...prev,
            pendingOrders,
            completedOrders,
            recentOrders,
          } : null);
        }
      }
    } catch (error: any) {
      console.error('Error rejecting order:', error);
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>,
        description: error.message || <TranslatedText fr="Impossible de rejeter la commande." en="Could not reject the order.">Die Bestellung konnte nicht abgelehnt werden.</TranslatedText>,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-3xl mb-8">
        <TranslatedText fr="Tableau de bord" en="Dashboard">
          Dashboard
        </TranslatedText>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <TranslatedText fr="Commandes totales" en="Total Orders">
                Gesamtbestellungen
              </TranslatedText>
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              <TranslatedText fr="Toutes les commandes" en="All orders">
                Alle Bestellungen
              </TranslatedText>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <TranslatedText fr="Revenus totaux" en="Total Revenue">
                Gesamteinnahmen
              </TranslatedText>
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TranslatedText fr="Commandes complétées" en="Completed orders">
                Abgeschlossene Bestellungen
              </TranslatedText>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <TranslatedText fr="Utilisateurs" en="Users">
                Benutzer
              </TranslatedText>
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TranslatedText fr="Comptes enregistrés" en="Registered accounts">
                Registrierte Konten
              </TranslatedText>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              <TranslatedText fr="Produits" en="Products">
                Produkte
              </TranslatedText>
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <TranslatedText fr="Produits en catalogue" en="Catalogue products">
                Katalogprodukte
              </TranslatedText>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>
              <TranslatedText fr="Commandes en attente" en="Pending Orders">
                Ausstehende Bestellungen
              </TranslatedText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingOrders}</div>
            <p className="text-sm text-muted-foreground mt-2">
              <TranslatedText fr="Nécessitent une attention" en="Require attention">
                Benötigen Aufmerksamkeit
              </TranslatedText>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <TranslatedText fr="Commandes complétées" en="Completed Orders">
                Abgeschlossene Bestellungen
              </TranslatedText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completedOrders}</div>
            <p className="text-sm text-muted-foreground mt-2">
              <TranslatedText fr="Commandes finalisées" en="Finalized orders">
                Finalisierte Bestellungen
              </TranslatedText>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <TranslatedText fr="Commandes récentes" en="Recent Orders">
              Letzte Bestellungen
            </TranslatedText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => {
                const shippingInfo = normalizeShippingInfo(order.shipping_info);
                const canAction = order.payment_status === 'pending' || order.payment_status === 'processing';
                return (
                  <div key={order.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          €{Number(order.total_amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {shippingInfo.name} ({shippingInfo.email})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium capitalize">{order.payment_status}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {canAction && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          onClick={() => {
                            setSelectedOrder(order);
                            setActionType('confirm');
                          }}
                          size="sm"
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
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          disabled={isProcessing}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          <TranslatedText fr="Rejeter" en="Reject">Ablehnen</TranslatedText>
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              <TranslatedText fr="Aucune commande récente" en="No recent orders">
                Keine letzten Bestellungen
              </TranslatedText>
            </p>
          )}
        </CardContent>
      </Card>

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
                  fr="Êtes-vous sûr de vouloir confirmer cette commande ? Le client sera notifié par email."
                  en="Are you sure you want to confirm this order? The customer will be notified by email."
                >
                  Möchten Sie diese Bestellung wirklich bestätigen? Der Kunde wird per E-Mail benachrichtigt.
                </TranslatedText>
              ) : (
                <TranslatedText
                  fr="Êtes-vous sûr de vouloir rejeter cette commande ? Le client sera notifié par email."
                  en="Are you sure you want to reject this order? The customer will be notified by email."
                >
                  Möchten Sie diese Bestellung wirklich ablehnen? Der Kunde wird per E-Mail benachrichtigt.
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















