
'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TranslatedText } from '@/components/TranslatedText';
import { Separator } from '@/components/ui/separator';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Loader2, Banknote, AlertTriangle } from 'lucide-react';
import { findProductImage } from '@/lib/image-utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { safeJsonParse, safeGetLocalStorage, safeSetLocalStorage, isLocalStorageAvailable } from '@/lib/security';
import { createOrder } from '@/app/actions/orderActions';


const baseSchema = {
  email: z.string(),
  country: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  apartment: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  discountCode: z.string().optional(),
};

const checkoutSchemaDE = z.object({
  ...baseSchema,
  email: z.string().email({ message: 'Geben Sie eine gültige E-Mail-Adresse ein' }),
  country: z.string().min(2, { message: 'Wählen Sie ein Land aus' }),
  firstName: z.string().min(1, { message: 'Geben Sie einen Vornamen ein' }),
  lastName: z.string().min(1, { message: 'Geben Sie einen Nachnamen ein' }),
  address: z.string().min(1, { message: 'Geben Sie eine Adresse ein' }),
  city: z.string().min(1, { message: 'Geben Sie eine Stadt ein' }),
  state: z.string().min(1, { message: 'Geben Sie ein Bundesland/eine Region ein' }),
  zip: z.string().min(1, { message: 'Geben Sie eine Postleitzahl ein' }),
});

const checkoutSchemaFR = z.object({
  ...baseSchema,
  email: z.string().email({ message: 'Entrez une adresse e-mail valide' }),
  country: z.string().min(2, { message: 'Sélectionnez un pays' }),
  firstName: z.string().min(1, { message: 'Entrez un prénom' }),
  lastName: z.string().min(1, { message: 'Entrez un nom de famille' }),
  address: z.string().min(1, { message: 'Entrez une adresse' }),
  city: z.string().min(1, { message: 'Entrez une ville' }),
  state: z.string().min(1, { message: 'Entrez un état/une région' }),
  zip: z.string().min(1, { message: 'Entrez un code postal' }),
});

const checkoutSchemaEN = z.object({
  ...baseSchema,
  email: z.string().email({ message: 'Enter a valid email' }),
  country: z.string().min(2, { message: 'Select a country' }),
  firstName: z.string().min(1, { message: 'Enter a first name' }),
  lastName: z.string().min(1, { message: 'Enter a last name' }),
  address: z.string().min(1, { message: 'Enter an address' }),
  city: z.string().min(1, { message: 'Enter a city' }),
  state: z.string().min(1, { message: 'Enter a state' }),
  zip: z.string().min(1, { message: 'Enter a ZIP code' }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchemaEN>;

const europeanCountries = [
    { code: "DE", name_de: "Deutschland", name_fr: "Allemagne", name_en: "Germany" },
    { code: "FR", name_de: "Frankreich", name_fr: "France", name_en: "France" },
    { code: "AT", name_de: "Österreich", name_fr: "Autriche", name_en: "Austria" },
    { code: "BE", name_de: "Belgien", name_fr: "Belgique", name_en: "Belgium" },
    { code: "DK", name_de: "Dänemark", name_fr: "Danemark", name_en: "Denmark" },
    { code: "ES", name_de: "Spanien", name_fr: "Espagne", name_en: "Spain" },
    { code: "FI", name_de: "Finnland", name_fr: "Finlande", name_en: "Finland" },
    { code: "IT", name_de: "Italien", name_fr: "Italie", name_en: "Italy" },
    { code: "LU", name_de: "Luxemburg", name_fr: "Luxembourg", name_en: "Luxembourg" },
    { code: "NL", name_de: "Niederlande", name_fr: "Pays-Bas", name_en: "Netherlands" },
    { code: "PT", name_de: "Portugal", name_fr: "Portugal", name_en: "Portugal" },
    { code: "SE", name_de: "Schweden", name_fr: "Suède", name_en: "Sweden" },
    { code: "CH", name_de: "Schweiz", name_fr: "Suisse", name_en: "Switzerland" },
];


const TAX_RATE = 0.19;

export function CheckoutClientPage() {
  const { cartItems, subtotal } = useCart();
  const { language } = useLanguage();
  const router = useRouter();
  const { user, profile, isUserLoading } = useUser();
  const { toast } = useToast();
  
  const currentSchema = language === 'fr' ? checkoutSchemaFR : language === 'en' ? checkoutSchemaEN : checkoutSchemaDE;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      email: '',
      country: 'Germany',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      discountCode: '',
    },
  });

  const selectedCountry = form.watch('country');

  const shippingCost = selectedCountry === 'Germany' ? 0 : 40;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + taxes;
  
  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
        router.push('/login?redirect=/checkout');
        return;
    }

    form.reset({
        email: user.email || '',
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        country: 'Germany',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zip: '',
        discountCode: '',
    });

  }, [user, isUserLoading, router, form])

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    if (!user) {
        toast({ 
            variant: 'destructive', 
            title: <TranslatedText fr="Erreur" en="Error">Fehler</TranslatedText>, 
            description: <TranslatedText fr="Vous devez être connecté pour passer une commande." en="You must be logged in to place an order.">Sie müssen eingeloggt sein, um eine Bestellung aufzugeben.</TranslatedText>
        });
      return;
    }

    const finalShippingCost = data.country === 'Germany' ? 0 : 40;
    const finalTaxes = subtotal * TAX_RATE;
    const finalTotal = subtotal + finalShippingCost + finalTaxes;

    const shippingInfo = {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      address: data.address,
      city: data.city,
      zip: data.zip,
      country: data.country,
    };

    const orderItems = cartItems.map(item => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      name_fr: item.product.name_fr,
      name_en: item.product.name_en,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.product.images[0],
    }));

    // Créer la commande dans Supabase
    const orderResult = await createOrder({
      user_id: user.id,
      shipping_info: shippingInfo,
      items: orderItems,
      subtotal: subtotal,
      shipping: finalShippingCost,
      taxes: finalTaxes,
      total_amount: finalTotal,
    });

    if (!orderResult.success || !orderResult.orderId) {
      toast({
        variant: "destructive",
        title: <TranslatedText fr="Erreur de commande" en="Order Error">Bestellfehler</TranslatedText>,
        description: <TranslatedText fr="Impossible de créer la commande. Veuillez réessayer." en="Could not create order. Please try again.">Bestellung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.</TranslatedText>
      });
      return;
    }

    // Sauvegarder aussi dans localStorage pour compatibilité
    if (isLocalStorageAvailable()) {
      const orderData = {
        id: orderResult.orderId,
        userId: user.id,
        shippingInfo: shippingInfo,
        items: orderItems,
        subtotal: subtotal,
        shipping: finalShippingCost,
        taxes: finalTaxes,
        totalAmount: finalTotal,
        orderDate: new Date().toISOString(),
        paymentStatus: 'pending' as const,
        receiptImageUrl: null,
      };

      const localOrders = safeJsonParse<any[]>(safeGetLocalStorage('localOrders'), []);
      localOrders.push(orderData);
      safeSetLocalStorage('localOrders', JSON.stringify(localOrders));
    }

    toast({
        title: <TranslatedText fr="Veuillez téléverser votre reçu" en="Please upload your receipt">Bitte laden Sie Ihre Quittung hoch</TranslatedText>,
        description: <TranslatedText fr="Vous allez être redirigé pour finaliser votre commande." en="You will be redirected to finalize your order.">Sie werden weitergeleitet, um Ihre Bestellung abzuschließen.</TranslatedText>
    });
    
    router.push(`/checkout/upload-receipt?orderId=${orderResult.orderId}`);
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-semibold">
          <TranslatedText fr="Votre panier est vide" en="Your cart is empty">
            Ihr Warenkorb ist leer
          </TranslatedText>
        </h1>
        <p className="mt-2 text-muted-foreground">
          <TranslatedText
            fr="Ajoutez des produits à votre panier pour passer à la caisse."
            en="Add products to your cart to checkout."
          >
            Fügen Sie Produkte zu Ihrem Warenkorb hinzu, um zur Kasse zu
            gehen.
          </TranslatedText>
        </p>
        <Button asChild className="mt-6">
          <Link href="/products/all">
            <TranslatedText fr="Continuer les achats" en="Continue Shopping">
              Weiter einkaufen
            </TranslatedText>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex min-h-screen flex-col lg:flex-row">
            <main className="w-full px-4 pb-20 pt-8 sm:px-6 lg:w-1/2 lg:px-8">
              <div className="mx-auto max-w-lg">
                <h1 className="font-headline text-2xl font-medium tracking-tight text-foreground">
                  EZCENTIALS
                </h1>

                <nav aria-label="Breadcrumb" className="mt-4">
                  <ol
                    role="list"
                    className="flex items-center space-x-2 text-sm text-muted-foreground"
                  >
                    <li>
                      <Link href="/cart" className="hover:text-foreground transition-colors">
                        <TranslatedText fr="Panier" en="Cart">Warenkorb</TranslatedText>
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5 text-muted-foreground/50"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"></path>
                      </svg>
                    </li>
                    <li>
                      <span className="font-medium text-foreground">
                        <TranslatedText fr="Informations" en="Information">Informationen</TranslatedText>
                      </span>
                    </li>
                  </ol>
                </nav>

                <div className="mt-12">
                  <section>
                    <h2 className="text-lg font-medium text-foreground">
                      <TranslatedText fr="Contact" en="Contact">Kontakt</TranslatedText>
                    </h2>
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>

                  <section className="mt-10 border-t border-border pt-10">
                    <h2 className="text-lg font-medium text-foreground">
                      <TranslatedText fr="Adresse de livraison" en="Shipping address">Lieferadresse</TranslatedText>
                    </h2>

                    <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel><TranslatedText fr="Pays/Région" en="Country/Region">Land/Region</TranslatedText></FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={<TranslatedText fr="Sélectionnez un pays" en="Select a country">Wähle ein Land</TranslatedText>} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {europeanCountries.map(country => (
                                    <SelectItem key={country.code} value={country.name_en}>
                                        <TranslatedText fr={country.name_fr} en={country.name_en}>{country.name_de}</TranslatedText>
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><TranslatedText fr="Prénom" en="First name">Vorname</TranslatedText></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><TranslatedText fr="Nom de famille" en="Last name">Nachname</TranslatedText></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel><TranslatedText fr="Adresse" en="Address">Adresse</TranslatedText></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="apartment"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>
                              <TranslatedText fr="Appartement, suite, etc. (facultatif)" en="Apartment, suite, etc. (optional)">Wohnung, Suite usw. (optional)</TranslatedText>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><TranslatedText fr="Ville" en="City">Stadt</TranslatedText></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><TranslatedText fr="État/Région" en="State/Region">Staat/Region</TranslatedText></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel><TranslatedText fr="Code postal" en="ZIP code">Postleitzahl</TranslatedText></FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <TranslatedText fr="Retour au panier" en="Return to cart">Zum Warenkorb zurück</TranslatedText>
                  </Link>
                </div>
              </div>
            </main>
            <aside className="w-full bg-muted/30 p-4 sm:p-6 lg:w-1/2 lg:p-8">
              <div className="mx-auto max-w-lg">
                <h2 className="sr-only"><TranslatedText fr="Résumé de la commande" en="Order summary">Bestellübersicht</TranslatedText></h2>
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-border">
                    {cartItems.map((item) => {
                      const image = findProductImage(item.product.images[0]);
                      return (
                        <li key={item.id} className="flex space-x-4 py-6">
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <img
                              src={image.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full rounded-md object-cover object-center"
                              onError={(e) => {
                                e.currentTarget.src = '/images/logo.png';
                              }}
                            />
                            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-medium text-foreground">
                              <TranslatedText
                                fr={item.product.name_fr}
                                en={item.product.name_en}
                              >
                                {item.product.name}
                              </TranslatedText>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {item.size}
                            </p>
                          </div>
                          <p className="flex-none text-base font-medium text-foreground">
                            €
                            {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Separator className="my-6" />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <p><TranslatedText fr="Sous-total" en="Subtotal">Zwischensumme</TranslatedText></p>
                    <p className="font-medium text-foreground">
                      €{subtotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p><TranslatedText fr="Livraison" en="Shipping">Versand</TranslatedText></p>
                    <p className="font-medium text-foreground">
                      {shippingCost > 0 ? `€${shippingCost.toFixed(2)}` : <TranslatedText fr="Gratuit" en="Free">Gratis</TranslatedText>}
                    </p>
                  </div>
                   <div className="flex justify-between">
                    <p><TranslatedText fr="Taxes" en="Taxes">Steuern</TranslatedText> ({(TAX_RATE * 100).toFixed(0)}%)</p>
                    <p className="font-medium text-foreground">
                        €{taxes.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between text-base font-medium text-foreground">
                  <p>Total</p>
                  <p>€{total.toFixed(2)}</p>
                </div>

                <div className="mt-8">
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h3 className="mb-4 flex items-center text-lg font-medium text-card-foreground">
                            <Banknote className="mr-2 h-5 w-5" />
                            <TranslatedText fr="Paiement par virement bancaire" en="Bank Transfer Payment">Zahlung per Banküberweisung</TranslatedText>
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            <TranslatedText fr="Veuillez effectuer un virement instantané aux coordonnées ci-dessous. Votre commande ne sera traitée qu'à réception du paiement." en="Please make an instant bank transfer to the details below. Your order will only be processed upon receipt of payment.">Bitte tätigen Sie eine Sofortüberweisung an die unten stehenden Daten. Ihre Bestellung wird erst nach Zahlungseingang bearbeitet.</TranslatedText>
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="font-medium text-foreground"><TranslatedText fr="Titulaire du compte" en="Account Holder">Kontoinhaber</TranslatedText>:</span> <span className="text-foreground">Naoual Brown</span></div>
                            <div className="flex justify-between"><span className="font-medium text-foreground">IBAN:</span> <span className="text-foreground">DE63500319000015088117</span></div>
                            <div className="flex justify-between"><span className="font-medium text-foreground">BIC:</span> <span className="text-foreground">BBVADEFFXXX</span></div>
                            <div className="flex justify-between"><span className="font-medium text-foreground"><TranslatedText fr="Banque" en="Bank">Bank</TranslatedText>:</span> <span className="text-foreground">BBVA</span></div>
                            <div className="flex justify-between"><span className="font-medium text-foreground"><TranslatedText fr="Motif" en="Reference">Verwendungszweck</TranslatedText>:</span> <span className="font-bold text-foreground">EZCENTIALS</span></div>
                        </div>

                        <Alert variant="destructive" className="mt-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                            <AlertTriangle className="h-4 w-4 text-amber-800 dark:text-amber-200" />
                            <AlertTitle className="font-semibold text-amber-800 dark:text-amber-200"><TranslatedText fr="Avertissement Important" en="Important Warning">Wichtiger Hinweis</TranslatedText></AlertTitle>
                            <AlertDescription className="text-amber-700 dark:text-amber-300">
                                <TranslatedText fr="Après avoir cliqué sur 'Poursuivre ma commande', vous serez redirigé pour téléverser le reçu de votre virement pour finaliser votre commande." en="After clicking 'Continue my order', you will be redirected to upload your transfer receipt to finalize your order.">Nachdem Sie auf 'Meine Bestellung fortsetzen' geklickt haben, werden Sie weitergeleitet, um Ihren Überweisungsbeleg hochzuladen und Ihre Bestellung abzuschließen.</TranslatedText>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>

                <div className="mt-8">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <TranslatedText fr="Création en cours..." en="Creating...">Erstellung...</TranslatedText>
                        </>
                    ) : (
                        <TranslatedText fr="Poursuivre ma commande" en="Continue my order">Meine Bestellung fortsetzen</TranslatedText>
                    )}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </Form>
    </div>
  );
}

    
