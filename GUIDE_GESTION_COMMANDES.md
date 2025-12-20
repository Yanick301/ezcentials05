# Guide de Gestion des Commandes

Ce guide explique comment confirmer ou rejeter les commandes et comment le statut se met à jour automatiquement dans l'historique de l'utilisateur.

## 🎯 Fonctionnalités

### Pour les Administrateurs

1. **Page Admin** : `/admin/orders`
   - Voir toutes les commandes
   - Confirmer ou rejeter les commandes
   - Le statut se met à jour automatiquement dans la base de données Supabase

### Pour les Utilisateurs

1. **Page Historique** : `/account/orders`
   - Voir toutes leurs commandes
   - Le statut se met à jour en temps réel grâce à Supabase Realtime

## 📋 Comment ça fonctionne

### 1. Confirmer une Commande (Admin)

1. Connectez-vous en tant qu'administrateur
2. Allez sur `/admin/orders`
3. Trouvez la commande à confirmer
4. Cliquez sur le bouton **"Confirmer"**
5. Confirmez l'action dans la boîte de dialogue
6. ✅ Le statut passe à `completed` dans Supabase
7. ✅ L'utilisateur voit le changement en temps réel dans `/account/orders`

### 2. Rejeter une Commande (Admin)

1. Connectez-vous en tant qu'administrateur
2. Allez sur `/admin/orders`
3. Trouvez la commande à rejeter
4. Cliquez sur le bouton **"Rejeter"**
5. Confirmez l'action dans la boîte de dialogue
6. ✅ Le statut passe à `rejected` dans Supabase
7. ✅ L'utilisateur voit le changement en temps réel dans `/account/orders`

## 🔄 Mise à Jour en Temps Réel

Le système utilise **Supabase Realtime** pour mettre à jour automatiquement l'historique des commandes :

- Quand un admin confirme/rejette une commande, Supabase émet un événement
- La page `/account/orders` écoute ces événements
- L'interface se met à jour automatiquement sans rechargement

## 🛡️ Sécurité

- Seuls les utilisateurs avec `is_admin = true` peuvent accéder à `/admin/orders`
- Les utilisateurs ne peuvent voir que leurs propres commandes
- Les politiques RLS (Row Level Security) protègent les données

## 📝 Statuts des Commandes

- **pending** : En attente (l'utilisateur doit uploader un reçu)
- **processing** : En traitement (l'admin vérifie le paiement)
- **completed** : Terminé (commande confirmée)
- **rejected** : Rejeté (paiement refusé)

## 🔧 Configuration Requise

### 1. Créer un utilisateur admin

Dans Supabase SQL Editor, exécutez :

```sql
-- Remplacer 'user_id_ici' par l'ID de l'utilisateur à promouvoir admin
UPDATE user_profiles 
SET is_admin = true 
WHERE id = 'user_id_ici';
```

### 2. Vérifier les permissions RLS

Assurez-vous que les politiques RLS sont correctement configurées (voir `supabase/rls.sql`)

## 🎨 Interface Utilisateur

### Page Admin (`/admin/orders`)

- Liste de toutes les commandes
- Filtres par statut (à venir)
- Boutons d'action pour chaque commande
- Détails complets de chaque commande

### Page Utilisateur (`/account/orders`)

- Liste des commandes de l'utilisateur
- Statut en temps réel
- Actions selon le statut :
  - **pending** : Formulaire d'upload de reçu
  - **processing** : Message "En vérification"
  - **completed** : Badge "Terminé"
  - **rejected** : Badge "Rejeté"

## 🚀 Utilisation

### Pour un Admin

1. Connectez-vous avec un compte admin
2. Allez sur `/admin/orders`
3. Vous verrez toutes les commandes en attente
4. Cliquez sur "Confirmer" ou "Rejeter" selon le cas
5. Le statut se met à jour instantanément

### Pour un Utilisateur

1. Connectez-vous
2. Allez sur `/account/orders`
3. Vous verrez toutes vos commandes
4. Le statut se met à jour automatiquement quand l'admin confirme/rejette

## 📧 Notifications (À venir)

Dans une version future, vous pourrez :
- Envoyer un email automatique quand une commande est confirmée
- Envoyer un email automatique quand une commande est rejetée
- Notifier l'utilisateur par email des changements de statut

## 🐛 Dépannage

### L'admin ne voit pas les commandes

- Vérifiez que `is_admin = true` dans `user_profiles`
- Vérifiez que vous êtes bien connecté
- Vérifiez les logs de la console

### Le statut ne se met pas à jour

- Vérifiez que Supabase Realtime est activé
- Vérifiez la connexion internet
- Rechargez la page

### Erreur de permissions

- Vérifiez que les politiques RLS sont correctement configurées
- Vérifiez que l'utilisateur a les bonnes permissions




































