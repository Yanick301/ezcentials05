'use client';

import { useSupabase, useUser } from '@/supabase';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TranslatedText } from '@/components/TranslatedText';
import { Loader2, ShoppingBag, Users, Package, TrendingUp, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/lib/supabase/database.types';

type OrderRow = Database['public']['Tables']['orders']['Row'];

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
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      €{Number(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{order.payment_status}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
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
    </div>
  );
}















