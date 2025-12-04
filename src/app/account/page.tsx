
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TranslatedText } from '@/components/TranslatedText';
import { useUser, useAuth, errorEmitter, FirestorePermissionError, useFirestore } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, ListOrdered, User, Camera, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';


// Helper to convert file to Base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


export default function AccountPage() {
  const { user, profile } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();


  if (!user) {
    return null;
  }
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: language === 'fr' ? 'Déconnecté' : language === 'en' ? 'Logged Out' : 'Abgemeldet',
        description: language === 'fr' ? 'Vous avez été déconnecté avec succès.' : language === 'en' ? 'You have been successfully logged out.' : 'Sie wurden erfolgreich abgemeldet.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: language === 'fr' ? 'Échec de la déconnexion' : language === 'en' ? 'Logout Failed' : 'Abmeldung fehlgeschlagen',
        description: error.message,
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user || !auth.currentUser || !firestore) {
      return;
    }
    
    const file = event.target.files[0];
     if (file.size > 1 * 1024 * 1024) { 
        toast({
            variant: "destructive",
            title: language === 'fr' ? "Fichier trop volumineux" : language === 'en' ? "File too large" : "Datei zu groß",
            description: language === 'fr' ? "La taille de l'image doit être inférieure à 1 Mo." : language === 'en' ? "Image size must be less than 1MB." : "Die Bildgröße muss weniger als 1 MB betragen.",
        });
        return;
    }

    setIsUploading(true);

    try {
        const base64Image = await toBase64(file);

        // Update Auth profile
        await updateProfile(auth.currentUser, { photoURL: base64Image });

        // Update Firestore profile
        const userProfileRef = doc(firestore, 'userProfiles', user.uid);
        await updateDoc(userProfileRef, { photoURL: base64Image });
        
        toast({
            title: language === 'fr' ? "Photo de profil mise à jour" : language === 'en' ? "Profile picture updated" : "Profilbild aktualisiert",
            description: language === 'fr' ? "Votre nouvelle photo de profil a été enregistrée." : language === 'en' ? "Your new profile picture has been saved." : "Ihr neues Profilbild wurde gespeichert.",
        });

    } catch (error) {
        const permissionError = new FirestorePermissionError({
          path: `userProfiles/${user.uid}`,
          operation: 'update',
          requestResourceData: { photoURL: '[BASE64_DATA]' }
        });
        errorEmitter.emit('permission-error', permissionError);

       toast({
        variant: "destructive",
        title: language === 'fr' ? "Erreur de téléversement" : language === 'en' ? "Upload Error" : "Upload-Fehler",
        description: language === 'fr' ? "Impossible de mettre à jour la photo de profil. Vérifiez les permissions." : language === 'en' ? "Could not update profile picture. Check permissions." : "Profilbild konnte nicht aktualisiert werden. Berechtigungen prüfen.",
      });
    } finally {
        setIsUploading(false);
         if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };
  
  const photoURL = user.photoURL || profile?.photoURL;

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
                          <AvatarImage src={photoURL || undefined} alt={user.displayName || 'User'} />
                          <AvatarFallback className="text-3xl">{getInitials(user.displayName)}</AvatarFallback>
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
                    <h2 className="mt-4 text-xl font-semibold">{user.displayName || 'Benutzer'}</h2>
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
                            <p>{user.displayName || 'N/A'}</p>
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
