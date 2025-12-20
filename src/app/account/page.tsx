
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TranslatedText } from '@/components/TranslatedText';
import { useUser, useAuth, useSupabase } from '@/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, ListOrdered, User, Camera, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';




export default function AccountPage() {
  const { user, profile, isUserLoading } = useUser();
  const auth = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) router.push('/login?redirect=/account');
  }, [isUserLoading, user, router]);
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const displayName = useMemo(() => {
    const fromProfile = profile ? `${profile.firstName} ${profile.lastName}`.trim() : '';
    if (fromProfile) return fromProfile;
    return user?.email?.split('@')[0] || 'Utilisateur';
  }, [profile, user?.email]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: <TranslatedText fr="Déconnecté" en="Logged Out">Abgemeldet</TranslatedText>,
        description: <TranslatedText fr="Vous avez été déconnecté avec succès." en="You have been successfully logged out.">Sie wurden erfolgreich abgemeldet.</TranslatedText>,
      });
      router.push('/login');
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user || !supabase) {
      return;
    }
    
    const file = event.target.files[0];
     if (file.size > 2 * 1024 * 1024) { 
        toast({
            variant: "destructive",
            title: <TranslatedText fr="Fichier trop volumineux" en="File too large">Datei zu groß</TranslatedText>,
            description: <TranslatedText fr="La taille de l'image doit être inférieure à 2 Mo." en="Image size must be less than 2MB.">Die Bildgröße muss weniger als 2 MB betragen.</TranslatedText>,
        });
        return;
    }

    setIsUploading(true);

    try {
        // Upload vers Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `profile-pictures/${fileName}`;

        // Supprimer l'ancienne photo si elle existe
        if (profile?.photoURL && profile.photoURL.includes('supabase.co')) {
          const oldPath = profile.photoURL.split('/').slice(-2).join('/');
          await supabase.storage.from('avatars').remove([oldPath]);
        }

        // Upload de la nouvelle photo
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Mise à jour du profil avec l'URL de l'image
        const { error } = await supabase
          .from('user_profiles')
          .update({ photo_url: publicUrl })
          .eq('id', user.id);

        if (error) throw error;
        
        toast({
            title: <TranslatedText fr="Photo de profil mise à jour" en="Profile picture updated">Profilbild aktualisiert</TranslatedText>,
            description: <TranslatedText fr="Votre nouvelle photo de profil a été enregistrée." en="Your new profile picture has been saved.">Ihr neues Profilbild wurde gespeichert.</TranslatedText>,
        });

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: <TranslatedText fr="Erreur de téléversement" en="Upload Error">Upload-Fehler</TranslatedText>,
        description: error?.message || (
          <TranslatedText fr="Impossible de mettre à jour la photo de profil." en="Could not update profile picture.">Profilbild konnte nicht aktualisiert werden.</TranslatedText>
        ),
      });
    } finally {
        setIsUploading(false);
         if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };
  
  const photoURL = profile?.photoURL;

  if (isUserLoading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      <h1 className="mb-8 font-headline text-3xl">
        <TranslatedText fr="Aperçu du compte" en="Account Overview">Kontoübersicht</TranslatedText>
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <Card>
                <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                          <AvatarImage src={photoURL || undefined} alt={displayName} />
                          <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-muted/80 hover:bg-muted"
                        onClick={handleAvatarClick}
                        disabled={isUploading}
                      >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      </Button>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">{displayName}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Card className="hover:bg-muted/50 transition-colors">
                     <Link href="/account/orders">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium"><TranslatedText fr="Commandes récentes" en="Recent Orders">Letzte Bestellungen</TranslatedText></CardTitle>
                            <ListOrdered className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground"><TranslatedText fr="Afficher l'historique de vos commandes" en="View your order history">Ihren Bestellverlauf anzeigen</TranslatedText></p>
                        </CardContent>
                    </Link>
                </Card>
                 <Card className="hover:bg-muted/50 transition-colors">
                     <Link href="/favorites">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium"><TranslatedText fr="Vos favoris" en="Your Favorites">Ihre Favoriten</TranslatedText></CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground"><TranslatedText fr="Afficher les articles que vous avez aimés" en="View items you have liked">Artikel anzeigen, die Ihnen gefallen haben</TranslatedText></p>
                        </CardContent>
                    </Link>
                </Card>
                 <Card className="sm:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5" />
                            <TranslatedText fr="Détails du profil" en="Profile Details">Profildetails</TranslatedText>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground"><TranslatedText fr="Nom complet" en="Full Name">Vollständiger Name</TranslatedText></h3>
                            <p>{displayName || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground"><TranslatedText fr="Adresse e-mail" en="Email Address">E-Mail-Adresse</TranslatedText></h3>
                            <p>{user.email}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
        <div className="mt-12 flex justify-center">
            <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <TranslatedText fr="Se déconnecter" en="Log Out">Abmelden</TranslatedText>
            </Button>
        </div>
    </div>
  );
}
