'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { UploadCloud, Loader2, CheckCircle, Truck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { TranslatedText } from '@/components/TranslatedText'
import type { OrderItem } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import UploadReceiptForm from '@/components/orders/UploadReceiptForm';
import { useCart } from '@/context/CartContext';
import { safeJsonParse, safeGetLocalStorage, isLocalStorageAvailable } from '@/lib/security';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface LocalOrder {
  id: string
  userId: string
  shippingInfo: {
    name: string
    email: string
    address: string
    city: string
    zip: string
    country: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  taxes: number
  totalAmount: number
  orderDate: string
  paymentStatus: 'pending' | 'processing' | 'completed' | 'rejected'
  receiptImageUrl: string | null
}


function UploadReceiptPageComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const { clearCart } = useCart();

  const { toast } = useToast()
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [order, setOrder] = useState<LocalOrder | null>(null)

  useEffect(() => {
    if (orderId) {
      if (!isLocalStorageAvailable()) {
        toast({
          variant: 'destructive',
          title: (
            <TranslatedText fr="Erreur" en="Error">
              Fehler
            </TranslatedText>
          ),
          description: (
            <TranslatedText
              fr="Le stockage local n'est pas disponible."
              en="Local storage is not available."
            >
              Der lokale Speicher ist nicht verfügbar.
            </TranslatedText>
          ),
        })
        router.push('/account/orders')
        return;
      }

      const localOrders = safeJsonParse<LocalOrder[]>(
        safeGetLocalStorage('localOrders'),
        []
      );
      const currentOrder = localOrders.find((o) => o.id === orderId)
      if (currentOrder) {
        setOrder(currentOrder)
      } else {
        toast({
          variant: 'destructive',
          title: (
            <TranslatedText fr="Erreur" en="Error">
              Fehler
            </TranslatedText>
          ),
          description: (
            <TranslatedText fr="Commande non trouvée." en="Order not found.">
              Bestellung nicht gefunden.
            </TranslatedText>
          ),
        })
        router.push('/account/orders')
      }
    }
  }, [orderId, router, toast])
  
  const handleReceiptUploaded = () => {
    setUploadSuccess(true);
    clearCart(); // Clear the cart on successful upload
     setTimeout(() => {
        router.push('/account/orders')
      }, 2500)
  }

  if (!orderId) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>
            <TranslatedText fr="Erreur" en="Error">
              Fehler
            </TranslatedText>
          </CardTitle>
          <CardDescription>
            <TranslatedText
              fr="Aucun ID de commande détecté."
              en="No order ID detected."
            >
              Keine Bestell-ID erkannt.
            </TranslatedText>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (uploadSuccess) {
    return (
      <Card className="w-full max-w-lg text-center border-2 shadow-xl animate-in fade-in zoom-in duration-500">
        <CardContent className="p-10 md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 animate-in zoom-in duration-500">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-4 text-3xl font-headline font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            <TranslatedText fr="Téléversement réussi" en="Upload Successful">
              Upload erfolgreich
            </TranslatedText>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            <TranslatedText
              fr="Votre reçu a été envoyé pour vérification. Vous serez redirigé automatiquement."
              en="Your receipt has been sent for verification. You will be redirected automatically."
            >
              Ihr Beleg wurde zur Überprüfung gesendet. Sie werden automatisch weitergeleitet.
            </TranslatedText>
          </p>
          {orderId && (
            <div className="mt-8 space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link href={`/tracking/${orderId}`}>
                  <Truck className="mr-2 h-4 w-4" />
                  <TranslatedText fr="Suivre ma commande" en="Track my order">
                    Meine Bestellung verfolgen
                  </TranslatedText>
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/account/orders">
                  <TranslatedText fr="Voir mes commandes" en="View my orders">
                    Meine Bestellungen ansehen
                  </TranslatedText>
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  const taxPercentage = order && order.subtotal > 0 ? (order.taxes / order.subtotal * 100).toFixed(0) : 0;

  return (
    <Card className="w-full max-w-2xl border-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="pb-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <UploadCloud className="h-8 w-8 text-primary" />
        </div>

        <CardTitle className="text-center text-2xl md:text-3xl font-headline">
          <TranslatedText fr="Finaliser votre paiement" en="Finalize Your Payment">
            Zahlung abschließen
          </TranslatedText>
        </CardTitle>

        <CardDescription className="text-center text-base mt-2">
          <TranslatedText
            fr={`Pour la commande n° ${orderId?.slice(0, 8).toUpperCase()}`}
            en={`For order ID ${orderId?.slice(0, 8).toUpperCase()}`}
          >
            {`Für Bestell-ID ${orderId?.slice(0, 8).toUpperCase()}`}
          </TranslatedText>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {order && (
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border-2 bg-muted/30 p-5 shadow-sm">
              <h4 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                <TranslatedText fr="Résumé de la commande" en="Order Summary">
                  Bestellübersicht
                </TranslatedText>
              </h4>
              <ul className="divide-y divide-border/50 text-sm mb-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between py-3">
                    <span className="text-foreground">
                      {item.quantity} x{' '}
                      <TranslatedText fr={item.name_fr} en={item.name_en}>
                        {item.name}
                      </TranslatedText>
                    </span>
                    <span className="text-foreground font-semibold">€{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                    <span className='text-muted-foreground'><TranslatedText fr="Sous-total" en="Subtotal">Zwischensumme</TranslatedText></span>
                    <span className="text-foreground font-medium">€{order.subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className='text-muted-foreground'><TranslatedText fr="Livraison" en="Shipping">Versand</TranslatedText></span>
                    <span className="text-foreground font-medium">€{order.shipping.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className='text-muted-foreground'><TranslatedText fr="Taxes" en="Taxes">Steuern</TranslatedText> ({taxPercentage}%)</span>
                    <span className="text-foreground font-medium">€{order.taxes.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-3" />
              <div className="flex justify-between text-base font-bold text-foreground">
                <span><TranslatedText fr="Total" en="Total">Gesamt</TranslatedText></span>
                <span>€{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className='rounded-lg border-2 bg-muted/30 p-5 shadow-sm'>
                <h4 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                    <TranslatedText fr="Adresse de livraison" en="Shipping Address">
                        Lieferadresse
                    </TranslatedText>
                </h4>
                <address className="text-sm not-italic text-foreground leading-relaxed">
                    <span className="font-semibold">{order.shippingInfo.name}</span><br />
                    {order.shippingInfo.address}<br />
                    {order.shippingInfo.zip} {order.shippingInfo.city}<br />
                    <span className="font-medium">{order.shippingInfo.country}</span>
                </address>
            </div>
          </div>
        )}

        {order && <UploadReceiptForm order={order} onReceiptUploaded={handleReceiptUploaded} />}

      </CardContent>
    </Card>
  )
}

export default function UploadReceiptPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense
        fallback={
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <TranslatedText fr="Chargement..." en="Loading...">
              Laden...
            </TranslatedText>
          </div>
        }
      >
        <UploadReceiptPageComponent />
      </Suspense>
    </div>
  )
}
