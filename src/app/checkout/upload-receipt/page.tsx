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
import { UploadCloud, Loader2, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { TranslatedText } from '@/components/TranslatedText'
import type { OrderItem } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import UploadReceiptForm from '@/components/orders/UploadReceiptForm';
import { useCart } from '@/context/CartContext';
import { safeJsonParse, safeGetLocalStorage, isLocalStorageAvailable } from '@/lib/security';


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
      <Card className="w-full max-w-lg text-center">
        <CardContent className="p-10">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-semibold">
            <TranslatedText fr="Téléversement réussi" en="Upload Successful">
              Upload erfolgreich
            </TranslatedText>
          </h2>
          <p className="mt-2 text-muted-foreground">
            <TranslatedText
              fr="Votre reçu a été envoyé pour vérification. Vous serez redirigé automatiquement."
              en="Your receipt has been sent for verification. You will be redirected automatically."
            >
              Ihr Beleg wurde zur Überprüfung gesendet. Sie werden automatisch weitergeleitet.
            </TranslatedText>
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const taxPercentage = order && order.subtotal > 0 ? (order.taxes / order.subtotal * 100).toFixed(0) : 0;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>

        <CardTitle className="text-center">
          <TranslatedText fr="Finaliser votre paiement" en="Finalize Your Payment">
            Zahlung abschließen
          </TranslatedText>
        </CardTitle>

        <CardDescription className="text-center">
          <TranslatedText
            fr={`Pour la commande n° ${orderId}`}
            en={`For order ID ${orderId}`}
          >
            {`Für Bestell-ID ${orderId}`}
          </TranslatedText>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {order && (
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                <TranslatedText fr="Résumé de la commande" en="Order Summary">
                  Bestellübersicht
                </TranslatedText>
              </h4>
              <ul className="divide-y divide-border text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between py-2">
                    <span className="text-foreground">
                      {item.quantity} x{' '}
                      <TranslatedText fr={item.name_fr} en={item.name_en}>
                        {item.name}
                      </TranslatedText>
                    </span>
                    <span className="text-foreground font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-2" />
              <div className="space-y-1 text-sm">
                 <div className="flex justify-between">
                    <span className='text-muted-foreground'><TranslatedText fr="Sous-total" en="Subtotal">Zwischensumme</TranslatedText></span>
                    <span className="text-foreground">€{order.subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className='text-muted-foreground'><TranslatedText fr="Livraison" en="Shipping">Versand</TranslatedText></span>
                    <span className="text-foreground">€{order.shipping.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className='text-muted-foreground'><TranslatedText fr="Taxes" en="Taxes">Steuern</TranslatedText> ({taxPercentage}%)</span>
                    <span className="text-foreground">€{order.taxes.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span>€{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <div className='rounded-md border p-4'>
                <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                    <TranslatedText fr="Adresse de livraison" en="Shipping Address">
                        Lieferadresse
                    </TranslatedText>
                </h4>
                <address className="text-sm not-italic text-foreground">
                    {order.shippingInfo.name}<br />
                    {order.shippingInfo.address}<br />
                    {order.shippingInfo.zip} {order.shippingInfo.city}<br />
                    {order.shippingInfo.country}
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
