# Guide de Configuration Supabase - Étape par Étape

Ce guide vous explique comment configurer Supabase pour votre projet EZCentials.

## 📋 Prérequis

- Un compte GitHub, Google ou Email
- Un navigateur web
- Accès au terminal

---

## Étape 1 : Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **"Start your project"** ou **"Sign In"**
3. Connectez-vous avec :
   - GitHub (recommandé)
   - Google
   - Email

---

## Étape 2 : Créer un nouveau projet

1. Une fois connecté, cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `ezcentials` (ou le nom de votre choix)
   - **Database Password** : Créez un mot de passe fort (⚠️ **SAVEZ-LE**, vous en aurez besoin)
   - **Region** : Choisissez la région la plus proche (ex: `West Europe` pour la France)
   - **Pricing Plan** : Sélectionnez **Free** (gratuit pour commencer)
3. Cliquez sur **"Create new project"**
4. ⏳ Attendez 2-3 minutes que le projet soit créé

---

## Étape 3 : Récupérer les clés d'API

1. Dans votre projet Supabase, allez dans **Settings** (⚙️ en bas à gauche)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez :
   - **Project URL** : Copiez cette URL (ex: `https://xxxxx.supabase.co`)
   - **anon public key** : Copiez cette clé (commence par `eyJ...`)

⚠️ **IMPORTANT** : Gardez ces informations, vous en aurez besoin !

---

## Étape 4 : Configurer la base de données

### 4.1 Ouvrir l'éditeur SQL

1. Dans votre projet Supabase, cliquez sur **SQL Editor** dans le menu de gauche
2. Cliquez sur **"New query"**

### 4.2 Exécuter le schéma SQL

1. Ouvrez le fichier `supabase/schema.sql` de votre projet
2. Copiez **TOUT le contenu** du fichier
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **"Run"** (ou appuyez sur `Ctrl+Enter`)
5. ✅ Vous devriez voir "Success. No rows returned"

### 4.3 Exécuter les politiques RLS

1. Ouvrez le fichier `supabase/rls.sql` de votre projet
2. Copiez **TOUT le contenu** du fichier
3. Dans l'éditeur SQL, créez une nouvelle requête (ou remplacez la précédente)
4. Collez le contenu de `rls.sql`
5. Cliquez sur **"Run"**
6. ✅ Vous devriez voir "Success. No rows returned"

---

## Étape 5 : Configurer les variables d'environnement

### 5.1 Créer le fichier .env.local

1. Dans votre projet, créez/modifiez le fichier `.env.local` à la racine
2. Ajoutez ces lignes (remplacez par VOS valeurs) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
```

**Exemple concret :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.exemple
```

### 5.2 Vérifier que le fichier existe

Le fichier `.env.local` doit être à la racine du projet, au même niveau que `package.json`

---

## Étape 6 : Configurer l'authentification (Optionnel mais recommandé)

1. Dans Supabase, allez dans **Authentication** > **URL Configuration**
2. Ajoutez votre URL de redirection :
   - **Site URL** : `http://localhost:9002` (pour le développement)
   - **Redirect URLs** : Ajoutez :
     - `http://localhost:9002/**`
     - `http://localhost:9002/account`
     - `http://localhost:9002/verify-email`

---

## Étape 7 : Tester la connexion

### 7.1 Redémarrer le serveur de développement

1. Arrêtez le serveur actuel (si il tourne) : `Ctrl+C`
2. Redémarrez-le :
```bash
npm run dev
```

### 7.2 Tester l'application

1. Ouvrez votre navigateur sur `http://localhost:9002`
2. Essayez de vous inscrire :
   - Allez sur `/register`
   - Créez un compte
   - Vérifiez votre email (dans Supabase, allez dans **Authentication** > **Users** pour voir les utilisateurs créés)

### 7.3 Vérifier dans Supabase

1. Dans Supabase, allez dans **Table Editor**
2. Vous devriez voir vos tables :
   - `user_profiles`
   - `products`
   - `reviews`
   - `orders`
   - `receipts`
   - `favorites`

---

## Étape 8 : Vérifier que tout fonctionne

### Test 1 : Authentification
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Déconnexion fonctionne

### Test 2 : Base de données
- [ ] Le profil utilisateur est créé automatiquement
- [ ] Les données sont visibles dans Supabase Table Editor

### Test 3 : Console
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans le terminal

---

## 🔧 Dépannage

### Erreur : "Missing Supabase environment variables"

**Solution :**
1. Vérifiez que `.env.local` existe à la racine
2. Vérifiez que les variables commencent par `NEXT_PUBLIC_`
3. Redémarrez le serveur (`npm run dev`)

### Erreur : "Invalid API key"

**Solution :**
1. Vérifiez que vous avez copié la **anon public key** (pas la service_role key)
2. Vérifiez qu'il n'y a pas d'espaces avant/après la clé

### Erreur : "relation does not exist"

**Solution :**
1. Vérifiez que vous avez bien exécuté `schema.sql`
2. Allez dans **Table Editor** pour voir si les tables existent

### Erreur : "permission denied"

**Solution :**
1. Vérifiez que vous avez bien exécuté `rls.sql`
2. Vérifiez les politiques RLS dans **Authentication** > **Policies**

---

## 📝 Checklist finale

- [ ] Compte Supabase créé
- [ ] Projet Supabase créé
- [ ] Clés API récupérées
- [ ] Schéma SQL exécuté (`schema.sql`)
- [ ] Politiques RLS exécutées (`rls.sql`)
- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] Serveur redémarré
- [ ] Test d'inscription réussi
- [ ] Données visibles dans Supabase

---

## 🎉 Félicitations !

Votre projet est maintenant connecté à Supabase ! Vous pouvez commencer à utiliser toutes les fonctionnalités.

---

## 📚 Ressources utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation Supabase Database](https://supabase.com/docs/guides/database)






































