
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ListOrdered, User } from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';
import { cn } from '@/lib/utils';
import { useUser } from '@/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);


  const accountNav = [
    {
      name: 'Kontodetails',
      name_fr: 'Détails du compte',
      name_en: 'Account Details',
      href: '/account',
      icon: User,
    },
    {
      name: 'Bestellverlauf',
      name_fr: 'Historique des commandes',
      name_en: 'Order History',
      href: '/account/orders',
      icon: ListOrdered,
    },
    {
      name: 'Meine Favoriten',
      name_fr: 'Mes favoris',
      name_en: 'My Favorites',
      href: '/favorites',
      icon: Heart,
    },
  ];

  useEffect(() => {
    if (!hasMounted || isUserLoading) {
      return; // Do nothing while loading
    }
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, isUserLoading, router, hasMounted]);

  // Show a loading screen while auth state is being determined or if a redirect is imminent.
  if (!hasMounted || isUserLoading || !user) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
        <aside className="md:col-span-1">
          <h2 className="mb-6 hidden font-headline text-2xl md:block">
            <TranslatedText fr="Mon compte" en="My Account">
              Mein Konto
            </TranslatedText>
          </h2>
          <nav className="flex flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-1">
            {accountNav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden md:inline">
                  <TranslatedText fr={item.name_fr} en={item.name_en}>
                    {item.name}
                  </TranslatedText>
                </span>
              </Link>
            ))}
          </nav>
        </aside>
        <main className="md:col-span-3 lg:col-span-4">{children}</main>
      </div>
    </div>
  );
}
