
'use client';

import { User, LogOut, Heart, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { TranslatedText } from '../TranslatedText';
import { useUser, useAuth } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export function UserButton() {
  const { user, profile, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);


  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: <TranslatedText fr="Déconnecté" en="Logged Out">Abgemeldet</TranslatedText>,
        description: <TranslatedText fr="Vous avez été déconnecté avec succès." en="You have been successfully logged out.">Sie wurden erfolgreich abgemeldet.</TranslatedText>,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: <TranslatedText fr="Échec de la déconnexion" en="Logout Failed">Abmeldung fehlgeschlagen</TranslatedText>,
        description: error.message || (
          <TranslatedText fr="Une erreur s'est produite lors de la déconnexion." en="An error occurred during logout.">Bei der Abmeldung ist ein Fehler aufgetreten.</TranslatedText>
        ),
      });
    }
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  if (!hasMounted || isUserLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />
  }

  if (user) {
    const displayName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : user.email?.split('@')[0] || 'User';
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={profile?.photoURL || undefined} alt={displayName} />
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account"><User className="mr-2 h-4 w-4" /> <TranslatedText fr="Mon compte" en="My Account">Mein Konto</TranslatedText></Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link href="/account/orders"><ListOrdered className="mr-2 h-4 w-4" /> <TranslatedText fr="Mes commandes" en="My Orders">Meine Bestellungen</TranslatedText></Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/favorites"><Heart className="mr-2 h-4 w-4" /> <TranslatedText fr="Mes favoris" en="My Favorites">Meine Favoriten</TranslatedText></Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <TranslatedText fr="Se déconnecter" en="Log Out">Abmelden</TranslatedText>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
   <Button variant="ghost" asChild>
    <Link href="/login"><TranslatedText fr="Se connecter" en="Log In">Anmelden</TranslatedText></Link>
   </Button>
  );
}
