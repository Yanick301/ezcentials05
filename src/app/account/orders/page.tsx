
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TranslatedText } from '@/components/TranslatedText';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ShoppingBag,
  CheckCircle,
  Loader2,
  AlertCircle,
  Ban,
  Upload,
  Clock,
} from 'lucide-react';
import { useUser } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr, de, enUS } from 'date-fns/locale';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import type { OrderItem } from '@/lib/types';
import UploadReceiptForm from '@/components/orders/UploadReceiptForm';
import { OrderStatusSyncer } from '@/components/OrderStatusSyncer';

interface LocalOrder {
    id: string;
    userId: string;
    shippingInfo: any;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    taxes: number;
    totalAmount: number;
    orderDate: string;
    paymentStatus: 'pending' | 'processing' | 'completed' | 'rejected';
    receiptImageUrl: string | null;
}

const getSafeDate = (order: any): Date => {
  if (!order || !order.orderDate) {
    return new Date();
  }
  try {
    const parsedDate = new Date(order.orderDate);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  } catch (e) {}
  return new Date();
};

export default function OrdersPage() {
  const { user, isUserLoading } = useUser();
  const { language } = useLanguage();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  
  const fetchOrders = useCallback(() => {
    if (typeof window === 'undefined') return;
    setIsOrdersLoading(true);
    if (user) {
        try {
            const localOrdersData = localStorage.getItem('localOrders');
            if (!localOrdersData) {
                setOrders([]);
            } else {
                const allOrders: LocalOrder[] = JSON.parse(localOrdersData);
                const userOrders = allOrders
                    .filter(order => order.userId === user.uid)
                    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
                setOrders(userOrders);
            }
        } catch (error) {
            console.error("Failed to sync orders from local storage", error);
            setOrders([]);
        }
    } else {
        setOrders([]);
    }
    setIsOrdersLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isUserLoading) {
      fetchOrders();
    }
  }, [user, isUserLoading, fetchOrders]);

  // Callback for OrderStatusSyncer to update state
  const handleStatusUpdate = useCallback((orderId: string, newStatus: 'completed' | 'rejected') => {
    setOrders(prevOrders => {
      const orderToUpdate = prevOrders.find(o => o.id === orderId);
      if (orderToUpdate && orderToUpdate.paymentStatus !== newStatus) {
        // Create a new array with the updated order
        return prevOrders.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o);
      }
      // If no update was needed, return the previous state to avoid re-render
      return prevOrders;
    });
  }, []);

  const isLoading = isUserLoading || isOrdersLoading;

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

  const getStatusTextDE = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Aktion erforderlich';
      case 'processing':
        return 'In Bearbeitung';
      case 'completed':
        return 'Abgeschlossen';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  const getStatusTextFR = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Action requise';
      case 'processing':
        return 'En traitement';
      case 'completed':
        return 'Terminé';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getStatusTextEN = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Action Required';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
       case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
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
  
  const handleReceiptUploaded = useCallback(() => {
    // Re-fetch orders to update the status on the page
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <OrderStatusSyncer onStatusUpdate={handleStatusUpdate} />
      <h1 className="mb-6 font-headline text-3xl">
        <TranslatedText fr="Historique des commandes" en="Order History">
          Bestellverlauf
        </TranslatedText>
      </h1>
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    <TranslatedText
                      fr={`Commande du ${format(getSafeDate(order), 'PPP', { locale: fr })}`}
                      en={`Order of ${format(getSafeDate(order), 'PPP', { locale: enUS })}`}
                    >
                      Bestellung vom {format(getSafeDate(order), 'PPP', { locale: de })}
                    </TranslatedText>
                  </CardTitle>
                  <CardDescription>
                    <TranslatedText fr="ID de commande" en="Order ID">
                      Bestell-ID
                    </TranslatedText>
                    : {order.id}
                  </CardDescription>
                </div>
                <Badge
                  variant={getStatusVariant(order.paymentStatus)}
                  className="flex items-center"
                >
                  {getStatusIcon(order.paymentStatus)}
                  <TranslatedText
                    fr={getStatusTextFR(order.paymentStatus)}
                    en={getStatusTextEN(order.paymentStatus)}
                  >
                    {getStatusTextDE(order.paymentStatus)}
                  </TranslatedText>
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4">
                  <ul className="divide-y">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between py-3 text-sm"
                      >
                        <span className="flex-grow pr-4">
                          {item.quantity} x{' '}
                          <TranslatedText fr={item.name_fr} en={item.name_en}>
                            {item.name}
                          </TranslatedText>
                        </span>
                        <span className="font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <p className="text-muted-foreground">
                        <TranslatedText fr="Sous-total" en="Subtotal">
                          Zwischensumme
                        </TranslatedText>
                      </p>
                      <p>€{order.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-muted-foreground">
                        <TranslatedText fr="Livraison" en="Shipping">
                          Versand
                        </TranslatedText>
                      </p>
                      <p>€{order.shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p className="text-muted-foreground">
                        <TranslatedText fr="Taxes" en="Taxes">
                          Steuern
                        </TranslatedText>
                      </p>
                      <p>€{order.taxes.toFixed(2)}</p>
                    </div>
                    <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
                      <p>
                        <TranslatedText fr="Total" en="Total">
                          Gesamt
                        </TranslatedText>
                      </p>
                      <p>€{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {order.paymentStatus === 'pending' && (
                  <div className="mt-6 rounded-md bg-destructive/10 p-6">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="upload-receipt" className="border-b-0">
                           <AccordionTrigger className="w-full justify-center font-semibold text-destructive hover:no-underline">
                              <div className="flex items-center">
                                <Upload className="mr-2 h-4 w-4" />
                                <TranslatedText
                                  fr="Finaliser le paiement"
                                  en="Finalize Payment"
                                >
                                  Zahlung abschließen
                                </TranslatedText>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                               <p className="mb-4 text-center text-sm text-destructive/80">
                                <TranslatedText
                                    fr="Pour finaliser votre commande, veuillez nous envoyer votre preuve de paiement."
                                    en="To finalize your order, please send us your proof of payment."
                                >
                                    Um Ihre Bestellung abzuschließen, senden Sie uns bitte Ihren Zahlungsnachweis.
                                </TranslatedText>
                                </p>
                                <UploadReceiptForm order={order} onReceiptUploaded={handleReceiptUploaded} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                  </div>
                )}

                {order.paymentStatus === 'processing' && (
                  <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-blue-200 bg-blue-50/50 p-4 text-center">
                    <div className="flex items-center text-blue-800">
                      <Clock className="mr-2 h-5 w-5" />
                      <p className="font-semibold">
                        <TranslatedText fr="Vérification du paiement" en="Payment Verification">
                          Zahlungsüberprüfung
                        </TranslatedText>
                      </p>
                    </div>
                    <p className="text-sm text-blue-700">
                        <TranslatedText 
                            fr="Vous recevrez un e-mail de confirmation de commande dans les 10 prochaines minutes."
                            en="You will receive an order confirmation email within the next 10 minutes."
                        >
                            Sie erhalten in den nächsten 10 Minuten eine E-Mail zur Bestellbestätigung.
                        </TranslatedText>
                    </p>
                  </div>
                )}

                {order.paymentStatus === 'completed' && (
                  <div className="mt-6 flex flex-col items-center justify-center rounded-md bg-green-50 p-4 text-sm font-semibold text-green-700">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <p>
                        <TranslatedText fr="Paiement validé" en="Payment validated">
                          Zahlung bestätigt
                        </TranslatedText>
                      </p>
                    </div>
                  </div>
                )}

                {order.paymentStatus === 'rejected' && (
                  <div className="mt-6 flex flex-col items-center justify-center rounded-md bg-red-50 p-4 text-sm font-semibold text-red-700">
                    <div className="flex items-center">
                      <Ban className="mr-2 h-5 w-5" />
                      <p>
                        <TranslatedText fr="Paiement rejeté" en="Payment rejected">
                          Zahlung abgelehnt
                        </TranslatedText>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">
              <TranslatedText fr="Aucune commande pour le moment" en="No orders yet">
                Noch keine Bestellungen
              </TranslatedText>
            </h3>
            <p className="mt-2 text-muted-foreground">
              <TranslatedText
                fr="Explorez nos collections et trouvez quelque chose qui vous plaît."
                en="Explore our collections and find something you like."
              >
                Entdecken Sie unsere Kollektionen und finden Sie etwas, das Ihnen gefällt.
              </TranslatedText>
            </p>
            <Button asChild className="mt-6">
              <Link href="/products/all">
                <TranslatedText fr="Continuer les achats" en="Continue Shopping">
                  Weiter einkaufen
                </TranslatedText>
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
