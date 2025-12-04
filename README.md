# EZCENTIALS - Boutique de Luxe

Bienvenue dans le projet EZCENTIALS, une application e-commerce moderne et élégante développée avec Next.js et Firebase. Ce document résume le fonctionnement général du site, son architecture et la manière de le gérer.

## Résumé du Fonctionnement du Site

### 1. Technologies Utilisées

- **Framework Frontend** : [Next.js](https://nextjs.org/) (avec App Router)
- **Langage** : TypeScript
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) avec [ShadCN UI](https://ui.shadcn.com/) pour les composants.
- **Backend & Base de Données** : [Firebase](https://firebase.google.com/) (Firestore pour la base de données, Firebase Auth pour l'authentification).
- **Internationalisation (i18n)** : Le site est multilingue (Allemand, Français, Anglais) grâce à un `LanguageContext` personnalisé. Le composant `TranslatedText` gère l'affichage des traductions.

### 2. Gestion des Données (Produits, Catégories, Avis)

Toutes les données principales du site (produits, catégories, avis statiques, etc.) sont gérées de manière **statique** directement dans les fichiers du dossier `src/lib/`.

- **Produits et Catégories** : Le fichier `src/lib/data.ts` contient les listes de tous les produits et catégories. Pour ajouter, modifier ou supprimer un article, vous devez éditer ce fichier.
- **Images des produits** : Les chemins d'accès aux images sont centralisés dans `src/lib/placeholder-images.json`. Pour ajouter une nouvelle image, vous devez d'abord l'ajouter à ce fichier JSON.
- **Promotions** : Pour qu'un produit apparaisse dans la section "Tendance" (promotions) de la page d'accueil, il suffit de lui ajouter une propriété `oldPrice` dans `src/lib/data.ts`. Le produit sera alors automatiquement considéré comme étant en solde.
- **Avis Clients** : Les avis de base sont stockés dans `src/lib/reviews.json`. Les nouveaux avis soumis par les utilisateurs sont sauvegardés dans le `localStorage` du navigateur.

### 3. Processus de Commande (Simulé)

Le site utilise un système de commande **simulé basé sur le stockage local (`localStorage`)**, sans intégration de paiement réel.

1.  **Ajout au Panier** : Les utilisateurs ajoutent des produits au panier. L'état du panier est géré par `CartContext` et est sauvegardé dans le `localStorage`.
2.  **Passage de la Commande** : Sur la page de paiement (`/checkout`), l'utilisateur remplit ses informations de livraison. Les coordonnées bancaires pour le virement sont affichées directement sur cette page (codées en dur dans `src/app/checkout/CheckoutClientPage.tsx`).
3.  **Création de la Commande Locale** : Une fois les informations soumises, une "commande locale" est créée et sauvegardée dans le `localStorage` de l'utilisateur avec le statut `pending`.
4.  **Téléversement du Reçu** : L'utilisateur est redirigé pour téléverser une preuve de paiement.
5.  **Notification à l'Admin** : Après le téléversement, une action serveur (`sendReceiptEmail`) est déclenchée pour envoyer un email à l'administrateur avec les détails de la commande et le reçu en pièce jointe. La commande locale de l'utilisateur passe au statut `processing`.
6.  **Validation par l'Admin** : L'email reçu par l'admin contient deux liens : "Confirmer" et "Rejeter".
7.  **Mise à Jour du Statut** : Cliquer sur l'un de ces liens ouvre une page qui met à jour un statut spécial dans le `localStorage` du navigateur de l'administrateur. Un composant invisible (`OrderStatusSyncer`) sur la page des commandes du client vérifie périodiquement ce statut et met à jour la commande locale du client en `completed` ou `rejected`.

> **Important** : Ce système est une simulation. Il n'y a pas de base de données centralisée pour les commandes ; tout est géré via le `localStorage` des navigateurs de l'utilisateur et de l'administrateur.

### 4. Authentification et Gestion des Utilisateurs

- **Fournisseur** : L'authentification est gérée par **Firebase Authentication** (Email/Mot de passe).
- **Processus d'Inscription** : Les nouveaux utilisateurs doivent vérifier leur adresse e-mail via un lien envoyé à leur boîte de réception avant de pouvoir se connecter.
- **Profils Utilisateurs** : Les informations de profil (nom, email, etc.) sont stockées dans la collection `userProfiles` de Firestore. Les règles de sécurité garantissent que chaque utilisateur ne peut modifier que son propre profil.
- **Favoris** : La liste des produits favoris est gérée via `FavoritesContext` et sauvegardée dans le `localStorage` du navigateur.

### 5. Structure du Projet

- `src/app/` : Contient toutes les pages et les layouts de l'application (App Router).
- `src/components/` : Contient les composants React réutilisables.
- `src/context/` : Gère l'état global de l'application (Panier, Langue, Favoris).
- `src/firebase/` : Gère la configuration et l'initialisation de Firebase.
- `src/lib/` : Contient les données statiques (`data.ts`, `reviews.json`) et les fonctions utilitaires.
- `src/ai/` : Contient les flux Genkit pour les fonctionnalités d'IA (actuellement, la traduction).
