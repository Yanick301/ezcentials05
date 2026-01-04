
'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendReceiptEmail } from '@/app/actions/emailActions'
import { updateOrderStatus } from '@/app/actions/orderActions'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { UploadCloud, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { TranslatedText } from '@/components/TranslatedText'
import { useLanguage } from '@/context/LanguageContext'
import type { OrderItem } from '@/lib/types'
import { safeJsonParse, safeGetLocalStorage, safeSetLocalStorage, isLocalStorageAvailable } from '@/lib/security'

const uploadSchemaDE = z.object({
  receipt: z
    .any()
    .refine((files) => files?.length === 1, 'Eine Datei ist erforderlich.')
    .refine(
      (files) => files?.[0]?.size <= 5000 * 1024,
      'Die maximale Dateigröße beträgt 5 MB.'
    )
    .refine(
      (files) =>
        ['image/jpeg', 'image/png', 'application/pdf'].includes(
          files?.[0]?.type
        ),
      'Nur die Formate .jpg, .png oder .pdf werden akzeptiert.'
    ),
})

const uploadSchemaFR = z.object({
  receipt: z
    .any()
    .refine((files) => files?.length === 1, 'Un fichier est requis.')
    .refine(
      (files) => files?.[0]?.size <= 5000 * 1024,
      'La taille maximale du fichier est de 5 Mo.'
    )
    .refine(
      (files) =>
        ['image/jpeg', 'image/png', 'application/pdf'].includes(
          files?.[0]?.type
        ),
      'Seuls les formats .jpg, .png ou .pdf sont acceptés.'
    ),
})

const uploadSchemaEN = z.object({
  receipt: z
    .any()
    .refine((files) => files?.length === 1, 'A file is required.')
    .refine(
      (files) => files?.[0]?.size <= 5000 * 1024,
      'Maximum file size is 5MB.'
    )
    .refine(
      (files) =>
        ['image/jpeg', 'image/png', 'application/pdf'].includes(
          files?.[0]?.type
        ),
      'Only .jpg, .png, or .pdf formats are accepted.'
    ),
})

type UploadFormValues = z.infer<typeof uploadSchemaEN>

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



interface UploadReceiptFormProps {
  order: LocalOrder;
  onReceiptUploaded: () => void;
}

export default function UploadReceiptForm({ order, onReceiptUploaded }: UploadReceiptFormProps) {
  const { toast } = useToast()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileName, setFileName] = useState('')

  const currentSchema =
    language === 'fr'
      ? uploadSchemaFR
      : language === 'en'
        ? uploadSchemaEN
        : uploadSchemaDE

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(currentSchema),
  })

  const onSubmit: SubmitHandler<UploadFormValues> = async (data) => {
    setIsSubmitting(true)

    try {
      const file = data.receipt[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${order.id}-${Date.now()}.${fileExt}`
      const filePath = `${order.id}/${fileName}`

      // Create Supabase client for storage upload
      // We must use the client-side client here as it has the user's session (if any)
      // or we rely on public/anon policy if user is not signed in but keys are available.
      // However, our storage policy requires auth. If this form is used by public, policy might need adjustment
      // or we assume user is logged in (likely for orders).
      // Based on context, let's assume standard client creation works.
      const supabase = createClient()
      if (!supabase) throw new Error('Supabase not configured')

      const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

      const orderDetailsHtml = `
        <ul>
          ${order.items
          .map(
            (item) =>
              `<li>${item.quantity} x ${item.name} - €${(
                item.price * item.quantity
              ).toFixed(2)}</li>`
          )
          .join('')}
        </ul>
        <p><strong>Sous-total:</strong> €${order.subtotal.toFixed(2)}</p>
        <p><strong>Livraison:</strong> €${order.shipping.toFixed(2)}</p>
        <p><strong>Taxes:</strong> €${order.taxes.toFixed(2)}</p>
        <p><strong>Total: €${order.totalAmount.toFixed(2)}</strong></p>
      `

      // Mettre à jour le statut de la commande dans Supabase à 'processing'
      // Pass the public URL instead of Base64
      const updateResult = await updateOrderStatus({
        orderId: order.id,
        status: 'processing',
        receiptImageUrl: publicUrl,
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Impossible de mettre à jour le statut de la commande.');
      }

      // Envoyer l'email à l'admin
      const emailResult = await sendReceiptEmail({
        orderId: order.id,
        receiptDataUrl: publicUrl, // Send URL
        orderDetailsHtml,
        userEmail: order.shippingInfo.email,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
        customerDetails: {
          name: order.shippingInfo.name,
          address: order.shippingInfo.address,
          city: order.shippingInfo.city,
          zip: order.shippingInfo.zip,
          country: order.shippingInfo.country,
        }
      })

      if (!emailResult.success) {
        // If email fails because server is not configured, show a toast but don't stop the process
        if (emailResult.error?.includes('Email server is not configured')) {
          toast({
            variant: "destructive",
            title: <TranslatedText fr="Serveur d'email non configuré" en="Email server not configured">E-Mail-Server nicht konfiguriert</TranslatedText>,
            description: <TranslatedText fr="Le reçu n'a pas pu être envoyé à l'admin, mais votre commande est enregistrée." en="The receipt could not be sent to the admin, but your order is saved.">Der Beleg konnte nicht an den Administrator gesendet werden, aber Ihre Bestellung ist gespeichert.</TranslatedText>,
          });
        } else {
          // For other email errors, show warning but don't fail the process
          console.warn('Email sending failed:', emailResult.error);
          toast({
            variant: "default",
            title: <TranslatedText fr="Reçu enregistré" en="Receipt saved">Beleg gespeichert</TranslatedText>,
            description: <TranslatedText fr="Votre reçu a été enregistré, mais l'email n'a pas pu être envoyé." en="Your receipt has been saved, but the email could not be sent.">Ihr Beleg wurde gespeichert, aber die E-Mail konnte nicht gesendet werden.</TranslatedText>,
          });
        }
      }

      // Mettre à jour aussi localStorage pour compatibilité
      if (isLocalStorageAvailable()) {
        const localOrders = safeJsonParse<LocalOrder[]>(
          safeGetLocalStorage('localOrders'),
          []
        );
        const updatedOrders = localOrders.map((o: LocalOrder) =>
          o.id === order.id ? { ...o, paymentStatus: 'processing', receiptImageUrl: publicUrl } : o
        );
        safeSetLocalStorage('localOrders', JSON.stringify(updatedOrders));
      }

      toast({
        title: (
          <TranslatedText fr="Reçu envoyé" en="Receipt Sent">
            Beleg gesendet
          </TranslatedText>
        ),
        description: (
          <TranslatedText
            fr="Votre paiement est en cours de vérification. Un email de confirmation vous sera envoyé."
            en="Your payment is under review. A confirmation email will be sent to you."
          >
            Ihre Zahlung wird überprüft. Eine Bestätigungs-E-Mail wird Ihnen zugesandt.
          </TranslatedText>
        ),
      })

      onReceiptUploaded();

    } catch (err) {
      console.error('Failed to submit receipt:', err)
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Échec" en="Failed">Fehlgeschlagen</TranslatedText>,
        description: (
          <div className="flex flex-col gap-1">
            <TranslatedText
              fr="Erreur lors de l’envoi. Réessayez."
              en="Error sending. Please try again."
            >
              Fehler beim Senden. Bitte versuchen Sie es erneut.
            </TranslatedText>
            {err instanceof Error && (
              <span className="font-mono text-[10px] opacity-70">
                {err.message}
              </span>
            )}
          </div>
        ),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="receipt"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <TranslatedText
                  fr="Preuve de paiement"
                  en="Proof of Payment"
                >
                  Zahlungsnachweis
                </TranslatedText>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    onChange={(e) => {
                      field.onChange(e.target.files)
                      setFileName(e.target.files?.[0]?.name || '')
                    }}
                    accept="image/jpeg,image/png,application/pdf"
                  />

                  <div className="flex h-24 flex-col items-center justify-center rounded-md border-2 border-dashed">
                    {fileName ? (
                      <p className="px-4 text-center text-sm text-muted-foreground">
                        {fileName}
                      </p>
                    ) : (
                      <>
                        <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <TranslatedText
                            fr="Cliquer ou glisser-déposer"
                            en="Click or drag & drop"
                          >
                            Klicken oder Drag & Drop
                          </TranslatedText>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </FormControl>
              <p className="pt-1 text-xs text-muted-foreground">
                <TranslatedText
                  fr="Fichiers acceptés : JPG, PNG, PDF. Taille max : 5 Mo."
                  en="Accepted files: JPG, PNG, PDF. Max size: 5MB."
                >
                  Akzeptierte Dateien: JPG, PNG, PDF. Max. Größe: 5 MB.
                </TranslatedText>
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <TranslatedText fr="Envoi en cours..." en="Sending...">
                Wird gesendet...
              </TranslatedText>
            </>
          ) : (
            <TranslatedText
              fr="Envoyer le reçu pour vérification"
              en="Send Receipt for Verification"
            >
              Beleg zur Überprüfung senden
            </TranslatedText>
          )}
        </Button>
      </form>
    </Form>
  )
}
