# 📋 Inventaire des Tâches Restantes - EZCENTIALS

**Date de création** : $(date)  
**Objectif** : Rendre le site totalement fonctionnel pour la production

---

## 🔴 PRIORITÉ HAUTE - Fonctionnalités Critiques

### 1. Migration des Produits vers Supabase
**Statut** : ⏳ **À FAIRE**  
**Description** : Les produits sont actuellement chargés depuis `src/lib/data.ts` (fichier statique). Ils doivent être migrés vers Supabase pour une gestion dynamique.

**Tâches** :
- [ ] Créer un script de migration pour importer les 800+ produits depuis `new_products.json` vers Supabase
- [ ] Modifier les pages produits pour charger depuis Supabase au lieu de `data.ts`
- [ ] Mettre en place un système de cache pour les performances
- [ ] Tester que tous les produits s'affichent correctement

**Fichiers concernés** :
- `src/lib/data.ts` (actuellement utilisé)
- `src/app/products/**/*.tsx` (pages produits)
- `src/app/product/[slug]/page.tsx` (page détail produit)
- `src/components/search/SearchDialog.tsx` (recherche)
- `new_products.json` (données source)

---

### 2. Intégration d'un Système de Paiement Réel
**Statut** : ⏳ **À FAIRE**  
**Description** : Actuellement, le système utilise un virement bancaire manuel. Il faut intégrer Stripe ou PayPal comme prévu dans le blueprint.

**Tâches** :
- [ ] Choisir et configurer Stripe ou PayPal
- [ ] Créer les pages de paiement avec intégration du gateway
- [ ] Gérer les webhooks pour les confirmations de paiement
- [ ] Mettre à jour le statut des commandes automatiquement
- [ ] Tester les transactions en mode sandbox puis production
- [ ] Mettre à jour la documentation

**Fichiers concernés** :
- `src/app/checkout/CheckoutClientPage.tsx` (actuellement virement bancaire)
- `src/app/actions/orderActions.ts` (création de commande)
- `docs/blueprint.md` (mentionne Stripe)

---

### 3. Upload et Stockage des Images de Produits
**Statut** : ⏳ **À FAIRE**  
**Description** : Les images doivent être téléchargées dans Supabase Storage ou un CDN, et les chemins mis à jour dans la base de données.

**Tâches** :
- [ ] Configurer Supabase Storage pour les images de produits
- [ ] Créer un script pour uploader les 800+ images depuis `/public/images/products/`
- [ ] Mettre à jour les chemins d'images dans la base de données
- [ ] Implémenter l'optimisation d'images (redimensionnement, compression)
- [ ] Configurer un CDN si nécessaire pour les performances

**Fichiers concernés** :
- `/public/images/products/` (257 images actuellement)
- `supabase/schema.sql` (table products avec colonne images)

---

### 4. Migration Complète de Firebase vers Supabase
**Statut** : ⏳ **EN COURS**  
**Description** : Certains composants utilisent encore Firebase. La migration doit être complétée.

**Tâches** :
- [ ] Vérifier et supprimer tous les imports Firebase restants
- [ ] Migrer Firebase Storage vers Supabase Storage (photos de profil, reçus)
- [ ] Nettoyer les fichiers Firebase obsolètes
- [ ] Mettre à jour la documentation de migration

**Fichiers concernés** :
- `src/firebase/` (dossier à nettoyer)
- `src/app/account/page.tsx` (upload photo de profil - actuellement base64)
- `src/components/orders/UploadReceiptForm.tsx` (upload reçus)

---

## 🟡 PRIORITÉ MOYENNE - Améliorations Importantes

### 5. Gestion du Stock des Produits
**Statut** : ⏳ **À FAIRE**  
**Description** : Aucun système de gestion de stock n'est actuellement implémenté.

**Tâches** :
- [ ] Ajouter une colonne `stock` ou `inventory` dans la table `products`
- [ ] Afficher le stock disponible sur les pages produits
- [ ] Empêcher l'ajout au panier si stock insuffisant
- [ ] Créer une interface admin pour gérer les stocks
- [ ] Ajouter des alertes pour les stocks faibles

**Fichiers concernés** :
- `supabase/schema.sql` (ajouter colonne stock)
- `src/app/product/[slug]/page.tsx` (affichage stock)
- `src/components/cart/CartSheetContent.tsx` (vérification stock)

---

### 6. Système de Codes Promo / Réductions
**Statut** : ⏳ **À FAIRE**  
**Description** : Le champ `discountCode` existe dans le formulaire de checkout mais n'est pas fonctionnel.

**Tâches** :
- [ ] Créer une table `discount_codes` dans Supabase
- [ ] Implémenter la validation des codes promo
- [ ] Calculer et appliquer les réductions
- [ ] Créer une interface admin pour gérer les codes promo
- [ ] Ajouter des limites (date d'expiration, nombre d'utilisations)

**Fichiers concernés** :
- `src/app/checkout/CheckoutClientPage.tsx` (champ discountCode)
- `supabase/schema.sql` (créer table)

---

### 7. Notifications Email Automatiques
**Statut** : ⏳ **PARTIELLEMENT FAIT**  
**Description** : Certains emails sont envoyés, mais pas tous les cas de figure.

**Tâches** :
- [ ] Email de confirmation de commande au client
- [ ] Email de confirmation de paiement validé
- [ ] Email de rejet de paiement
- [ ] Email de préparation de commande
- [ ] Email d'expédition
- [ ] Email de livraison
- [ ] Templates d'emails professionnels et multilingues

**Fichiers concernés** :
- `src/app/actions/emailActions.ts` (actions email)
- `CONFIGURATION_EMAILS_AUTOMATIQUES.md` (documentation)

---

### 8. Interface Admin Complète
**Statut** : ⏳ **PARTIELLEMENT FAIT**  
**Description** : L'interface admin existe pour les commandes, mais manque d'autres fonctionnalités.

**Tâches** :
- [ ] Dashboard admin avec statistiques (commandes, revenus, produits)
- [ ] Gestion des produits (CRUD complet)
- [ ] Gestion des catégories
- [ ] Gestion des utilisateurs
- [ ] Gestion des avis (modération)
- [ ] Gestion des codes promo
- [ ] Export de données (commandes, produits)

**Fichiers concernés** :
- `src/app/admin/orders/page.tsx` (existe)
- Créer `src/app/admin/products/page.tsx`
- Créer `src/app/admin/dashboard/page.tsx`
- Créer `src/app/admin/users/page.tsx`

---

### 9. Système de Suivi de Livraison
**Statut** : ⏳ **À FAIRE**  
**Description** : Aucun système de suivi de colis n'est implémenté.

**Tâches** :
- [ ] Ajouter une colonne `tracking_number` dans la table `orders`
- [ ] Ajouter un champ `shipping_status` (en préparation, expédié, livré)
- [ ] Créer une page de suivi pour les clients
- [ ] Intégrer avec un service de transporteur (optionnel)
- [ ] Notifications email lors des changements de statut

**Fichiers concernés** :
- `supabase/schema.sql` (ajouter colonnes)
- `src/app/account/orders/page.tsx` (affichage tracking)
- Créer `src/app/tracking/[orderId]/page.tsx`

---

## 🟢 PRIORITÉ BASSE - Améliorations UX/UI

### 10. Optimisation des Performances
**Statut** : ⏳ **À FAIRE**  
**Description** : Optimisations pour améliorer les performances du site.

**Tâches** :
- [ ] Implémenter le lazy loading des images
- [ ] Optimiser les requêtes Supabase (indexes, pagination)
- [ ] Mettre en cache les produits fréquemment consultés
- [ ] Optimiser les bundles JavaScript
- [ ] Implémenter le service worker pour le cache offline

---

### 11. Amélioration de l'Accessibilité
**Statut** : ⏳ **À FAIRE**  
**Description** : Améliorer l'accessibilité du site.

**Tâches** :
- [ ] Ajouter les attributs ARIA manquants
- [ ] Améliorer la navigation au clavier
- [ ] Tester avec des lecteurs d'écran
- [ ] Vérifier les contrastes de couleurs
- [ ] Ajouter des textes alternatifs complets pour les images

---

### 12. Tests Automatisés
**Statut** : ⏳ **À FAIRE**  
**Description** : Aucun test automatisé n'est actuellement en place.

**Tâches** :
- [ ] Configurer Jest et React Testing Library
- [ ] Écrire des tests unitaires pour les composants critiques
- [ ] Écrire des tests d'intégration pour les flux utilisateur
- [ ] Configurer les tests E2E avec Playwright ou Cypress
- [ ] Intégrer les tests dans le CI/CD

---

### 13. Analytics et Tracking
**Statut** : ⏳ **À FAIRE**  
**Description** : Aucun système d'analytics n'est implémenté.

**Tâches** :
- [ ] Intégrer Google Analytics ou Plausible
- [ ] Configurer le tracking des événements (achats, ajouts au panier)
- [ ] Implémenter le tracking des conversions
- [ ] Respecter le RGPD (consentement cookies)

**Note** : Le composant `CookieConsent` existe déjà, il faut juste intégrer l'analytics.

---

### 14. SEO Avancé
**Statut** : ⏳ **PARTIELLEMENT FAIT**  
**Description** : Le SEO de base existe, mais peut être amélioré.

**Tâches** :
- [ ] Ajouter des meta descriptions pour toutes les pages
- [ ] Optimiser les images (alt text, lazy loading)
- [ ] Créer un blog pour le contenu SEO
- [ ] Implémenter les rich snippets pour les produits
- [ ] Créer un plan de sitemap complet

**Fichiers concernés** :
- `src/lib/seo.ts` (existe)
- `src/app/sitemap.ts` (existe mais peut être amélioré)

---

### 15. Gestion des Erreurs 404 et Pages d'Erreur
**Statut** : ✅ **FAIT**  
**Description** : La page 404 existe déjà.

---

## 🔧 Configuration et Déploiement

### 16. Variables d'Environnement Manquantes
**Statut** : ⏳ **À VÉRIFIER**  
**Description** : Vérifier que toutes les variables nécessaires sont documentées.

**Variables requises** :
- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `RESEND_API_KEY`
- [x] `ADMIN_EMAIL`
- [x] `RESEND_FROM_EMAIL`
- [ ] `STRIPE_PUBLIC_KEY` (si intégration Stripe)
- [ ] `STRIPE_SECRET_KEY` (si intégration Stripe)
- [ ] `NEXT_PUBLIC_SITE_URL`

---

### 17. Documentation Complète
**Statut** : ⏳ **PARTIELLEMENT FAIT**  
**Description** : La documentation existe mais peut être améliorée.

**Tâches** :
- [ ] Créer un guide d'installation complet
- [ ] Documenter toutes les variables d'environnement
- [ ] Créer un guide de contribution
- [ ] Documenter l'API (si applicable)
- [ ] Créer des guides vidéo (optionnel)

---

## 📊 Résumé par Priorité

### 🔴 Priorité Haute (Critique pour le lancement)
1. Migration des produits vers Supabase
2. Intégration d'un système de paiement réel
3. Upload et stockage des images
4. Migration complète Firebase → Supabase

### 🟡 Priorité Moyenne (Important pour l'expérience utilisateur)
5. Gestion du stock
6. Système de codes promo
7. Notifications email automatiques
8. Interface admin complète
9. Système de suivi de livraison

### 🟢 Priorité Basse (Améliorations continues)
10. Optimisation des performances
11. Amélioration de l'accessibilité
12. Tests automatisés
13. Analytics et tracking
14. SEO avancé

---

## 🎯 Prochaines Étapes Recommandées

1. **Semaine 1** : Migration des produits vers Supabase + Upload des images
2. **Semaine 2** : Intégration Stripe/PayPal + Tests de paiement
3. **Semaine 3** : Gestion du stock + Codes promo + Notifications email
4. **Semaine 4** : Interface admin complète + Tests finaux
5. **Post-lancement** : Optimisations, analytics, tests automatisés

---

## 📝 Notes Importantes

- Les produits sont actuellement dans `src/lib/data.ts` (statique) - **MIGRATION URGENTE**
- Le système de paiement actuel est un virement bancaire manuel - **INTÉGRATION STRIPE/PAYPAL REQUISE**
- Les images doivent être uploadées dans Supabase Storage - **800+ IMAGES À TRAITER**
- Certains fichiers Firebase existent encore - **NETTOYAGE NÉCESSAIRE**

---

**Dernière mise à jour** : $(date)















